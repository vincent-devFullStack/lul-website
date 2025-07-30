// src/app/scripts/check-db.js
import { MongoClient } from "mongodb";
import { config } from "dotenv";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Configuration pour les modules ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
config({ path: join(__dirname, "../../../.env.local") });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

console.log("🔍 Variables d'environnement chargées :");
console.log(`   - MONGODB_URI: ${uri ? "✅ Définie" : "❌ Non définie"}`);
console.log(`   - MONGODB_DB: ${dbName ? "✅ Définie" : "❌ Non définie"}`);

if (!uri || !dbName) {
  console.error("\n❌ Erreur de configuration :");
  console.error("   Les variables MONGODB_URI et MONGODB_DB doivent être définies dans .env.local");
  process.exit(1);
}

async function checkDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("\n🔗 Connexion à MongoDB réussie");
    
    const db = client.db(dbName);
    
    // Lister toutes les collections
    const collections = await db.listCollections().toArray();
    console.log(`\n📊 Collections trouvées dans '${dbName}' :`);
    
    if (collections.length === 0) {
      console.log("   ⚠️  Aucune collection trouvée !");
      return;
    }

    // Afficher d'abord la liste des collections
    collections.forEach(collection => {
      console.log(`   • ${collection.name}`);
    });

    // Analyser chaque collection
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = db.collection(collectionName);
      const count = await collection.countDocuments();
      
      console.log(`\n📁 Collection: ${collectionName}`);
      console.log(`   • Documents: ${count}`);
      
      if (count > 0) {
        // Afficher quelques exemples
        const samples = await collection.find({}).limit(3).toArray();
        
        samples.forEach((doc, index) => {
          console.log(`   • Exemple ${index + 1}:`);
          
          // Affichage spécialisé selon le type de collection
          if (collectionName === 'users') {
            console.log(`     - Email: ${doc.email}`);
            console.log(`     - ID: ${doc._id}`);
            console.log(`     - Créé: ${doc.createdAt ? new Date(doc.createdAt).toLocaleString() : 'N/A'}`);
          } else if (collectionName === 'rooms') {
            console.log(`     - Slug: ${doc.slug}`);
            console.log(`     - Titre: ${doc.title}`);
            console.log(`     - Œuvres: ${doc.artworks ? doc.artworks.length : 0}`);
          } else {
            // Affichage générique
            const keys = Object.keys(doc).filter(key => key !== '_id').slice(0, 3);
            keys.forEach(key => {
              const value = typeof doc[key] === 'object' ? 
                (Array.isArray(doc[key]) ? `[${doc[key].length} items]` : '[Object]') : 
                String(doc[key]).substring(0, 50);
              console.log(`     - ${key}: ${value}`);
            });
          }
        });
      }
    }

    // Statistiques détaillées pour les collections importantes
    if (collections.find(c => c.name === 'users')) {
      const usersCollection = db.collection('users');
      const userCount = await usersCollection.countDocuments();
      console.log(`\n👥 Statistiques Users :`);
      console.log(`   • Total utilisateurs: ${userCount}`);
      
      if (userCount > 0) {
        const latestUser = await usersCollection.findOne({}, { sort: { createdAt: -1 } });
        console.log(`   • Dernier inscrit: ${latestUser.email}`);
        console.log(`   • Date: ${latestUser.createdAt ? new Date(latestUser.createdAt).toLocaleString() : 'N/A'}`);
      }
    }

    if (collections.find(c => c.name === 'rooms')) {
      const roomsCollection = db.collection('rooms');
      const roomCount = await roomsCollection.countDocuments();
      const roomsWithArtworks = await roomsCollection.countDocuments({ 
        "artworks.0": { $exists: true } 
      });
      
      console.log(`\n🏛️ Statistiques Salles :`);
      console.log(`   • Total salles: ${roomCount}`);
      console.log(`   • Salles avec œuvres: ${roomsWithArtworks}`);
      console.log(`   • Salles vides: ${roomCount - roomsWithArtworks}`);
      
      if (roomsWithArtworks > 0) {
        const totalArtworks = await roomsCollection.aggregate([
          { $unwind: "$artworks" },
          { $count: "total" }
        ]).toArray();
        
        const artworkCount = totalArtworks.length > 0 ? totalArtworks[0].total : 0;
        console.log(`   • Total œuvres: ${artworkCount}`);
      }
    }

    console.log(`\n✅ Inspection terminée !`);

  } catch (error) {
    console.error("❌ Erreur lors de l'inspection :", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("🔌 Connexion MongoDB fermée");
  }
}

checkDatabase(); 