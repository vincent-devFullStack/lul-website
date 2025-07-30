// src/app/scripts/check-mongoose.js
import mongoose from "mongoose";
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

console.log("🔍 Inspection via Mongoose");
console.log(`   - MONGODB_URI: ${uri ? "✅ Définie" : "❌ Non définie"}`);

if (!uri) {
  console.error("❌ MONGODB_URI manquante dans .env.local");
  process.exit(1);
}

async function checkMongoose() {
  try {
    // Connexion via Mongoose (comme l'application)
    await mongoose.connect(uri, {
      bufferCommands: false,
    });
    
    console.log("🔗 Connexion Mongoose réussie");
    
    // Obtenir la connexion native pour explorer
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    
    console.log(`📊 Base de données utilisée : '${dbName}'`);
    
    // Lister toutes les collections via Mongoose
    const collections = await db.listCollections().toArray();
    console.log(`\n📁 Collections trouvées :`);
    
    if (collections.length === 0) {
      console.log("   ⚠️  Aucune collection trouvée !");
      return;
    }
    
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = db.collection(collectionName);
      const count = await collection.countDocuments();
      
      console.log(`\n   • ${collectionName}: ${count} document(s)`);
      
      if (count > 0 && count <= 5) {
        // Afficher tous les documents si peu nombreux
        const docs = await collection.find({}).toArray();
        docs.forEach((doc, index) => {
          console.log(`     ${index + 1}. ${JSON.stringify(doc, null, 2).substring(0, 200)}...`);
        });
      } else if (count > 0) {
        // Afficher quelques exemples
        const samples = await collection.find({}).limit(2).toArray();
        samples.forEach((doc, index) => {
          if (collectionName === 'users') {
            console.log(`     ${index + 1}. Email: ${doc.email}, Créé: ${doc.createdAt}`);
          } else if (collectionName === 'rooms') {
            console.log(`     ${index + 1}. Slug: ${doc.slug}, Titre: ${doc.title}, Œuvres: ${doc.artworks?.length || 0}`);
          } else {
            console.log(`     ${index + 1}. ${JSON.stringify(doc, null, 2).substring(0, 100)}...`);
          }
        });
      }
    }
    
    // Vérification spéciale pour les utilisateurs
    try {
      const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
        email: String,
        password: String,
        createdAt: Date,
        updatedAt: Date
      }));
      
      const userCount = await User.countDocuments();
      console.log(`\n👥 Via modèle User Mongoose : ${userCount} utilisateur(s)`);
      
      if (userCount > 0) {
        const users = await User.find({}).select('email createdAt').limit(5);
        users.forEach((user, index) => {
          console.log(`   ${index + 1}. ${user.email} (${user.createdAt})`);
        });
      }
    } catch (err) {
      console.log(`⚠️  Erreur modèle User: ${err.message}`);
    }
    
    console.log(`\n✅ Inspection Mongoose terminée !`);
    
  } catch (error) {
    console.error("❌ Erreur Mongoose :", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Connexion Mongoose fermée");
  }
}

checkMongoose(); 