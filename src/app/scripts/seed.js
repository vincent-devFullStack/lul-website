// src/app/scripts/seed.js
import { MongoClient } from "mongodb";
import { config } from "dotenv";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Configuration pour les modules ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement depuis le bon chemin
config({ path: join(__dirname, "../../../.env.local") });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

console.log("🔍 Variables d'environnement chargées :");
console.log(`   - MONGODB_URI: ${uri ? "✅ Définie" : "❌ Non définie"}`);
console.log(`   - MONGODB_DB: ${dbName ? "✅ Définie" : "❌ Non définie"}`);

if (!uri || !dbName) {
  console.error("\n❌ Erreur de configuration :");
  console.error(
    "   Les variables MONGODB_URI et MONGODB_DB doivent être définies dans .env.local"
  );
  console.error("   Chemin attendu : lul-website/.env.local");
  process.exit(1);
}

// Configuration des salles avec leurs données complètes
const roomsData = [
  {
    slug: "salle-1",
    title: "Salle 1",
    name: "Grande Galerie Principale",
    description: "Collection permanente d'art contemporain",
    coordinates: {
      top: "20%",
      left: "3%",
      width: "16%",
      height: "24%",
    },
    status: "active",
    displayOrder: 1,
    artworks: [
      {
        title: "Composition No. 1",
        imageUrl: "/assets/artwork1.webp",
        description:
          "Une œuvre expérimentale inspirée du constructivisme. Cette pièce explore les limites entre forme et fonction.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Déstructuration",
        imageUrl: "/assets/artwork2.webp",
        description:
          "Exploration brute de la fragmentation visuelle. L'artiste déconstruit les conventions artistiques traditionnelles.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    slug: "salle-2",
    title: "Salle 2",
    name: "Salon Intimiste",
    description: "Petites œuvres et dessins",
    coordinates: {
      top: "47%",
      left: "3%",
      width: "8%",
      height: "15%",
    },
    status: "active",
    displayOrder: 2,
    artworks: [],
  },
  {
    slug: "salle-3",
    title: "Salle 3",
    name: "Salle des Maîtres",
    description: "Œuvres des grands maîtres classiques",
    coordinates: {
      top: "22%",
      left: "44%",
      width: "17%",
      height: "22%",
    },
    status: "active",
    displayOrder: 3,
    artworks: [],
  },
  {
    slug: "salle-4",
    title: "Salle 4",
    name: "Espace Numérique",
    description: "Art numérique et installations interactives",
    coordinates: {
      top: "23%",
      left: "61.5%",
      width: "6%",
      height: "12%",
    },
    status: "active",
    displayOrder: 4,
    artworks: [],
  },
  {
    slug: "salle-5",
    title: "Salle 5",
    name: "Salle des Archives",
    description: "Documentation et recherche",
    coordinates: {
      top: "36%",
      left: "61.5%",
      width: "6%",
      height: "9%",
    },
    status: "restricted",
    displayOrder: 5,
    artworks: [],
  },
  {
    slug: "salle-6",
    title: "Salle 6",
    name: "Galerie Verticale",
    description: "Exposition temporaire",
    coordinates: {
      top: "56%",
      left: "36%",
      width: "7%",
      height: "30%",
    },
    status: "active",
    displayOrder: 6,
    artworks: [],
  },
  {
    slug: "salle-7",
    title: "Salle 7",
    name: "Cabinet d'Art Moderne",
    description: "Sélection d'art moderne du XXe siècle",
    coordinates: {
      top: "51%",
      left: "44%",
      width: "10%",
      height: "22%",
    },
    status: "active",
    displayOrder: 7,
    artworks: [],
  },
  {
    slug: "salle-8",
    title: "Salle 8",
    name: "Espace Sculptures",
    description: "Sculptures contemporaines et installations",
    coordinates: {
      top: "75%",
      left: "44%",
      width: "10%",
      height: "22%",
    },
    status: "active",
    displayOrder: 8,
    artworks: [],
  },

  {
    slug: "salle-9",
    title: "Salle 9",
    name: "Alcôve Est",
    description: "Œuvres de petit format",
    coordinates: {
      top: "51%",
      left: "55%",
      width: "5%",
      height: "9%",
    },
    status: "active",
    displayOrder: 9,
    artworks: [],
  },
  {
    slug: "salle-10",
    title: "Salle 10",
    name: "Cabinet Privé",
    description: "Collection privée accessible sur réservation",
    coordinates: {
      top: "62%",
      left: "55%",
      width: "5%",
      height: "20%",
    },
    status: "restricted",
    displayOrder: 10,
    artworks: [],
  },
  {
    slug: "salle-11",
    title: "Salle 11",
    name: "Mini-Galerie",
    description: "Espace réduit pour œuvres spéciales",
    coordinates: {
      top: "85%",
      left: "55%",
      width: "5%",
      height: "13%",
    },
    status: "active",
    displayOrder: 11,
    artworks: [],
  },
  {
    slug: "salle-12",
    title: "Salle 12",
    name: "Antichambre",
    description: "Espace de transition",
    coordinates: {
      top: "52%",
      left: "61%",
      width: "6%",
      height: "9%",
    },
    status: "active",
    displayOrder: 12,
    artworks: [],
  },

  {
    slug: "salle-13",
    title: "Salle 13",
    name: "Pavillon Ouest",
    description: "Expositions thématiques",
    coordinates: {
      top: "46%",
      left: "68%",
      width: "5%",
      height: "14%",
    },
    status: "active",
    displayOrder: 13,
    artworks: [],
  },
  {
    slug: "salle-14",
    title: "Salle 14",
    name: "Grand Hall d'Exposition",
    description: "Principales expositions temporaires",
    coordinates: {
      top: "45%",
      left: "74%",
      width: "11%",
      height: "14%",
    },
    status: "active",
    displayOrder: 14,
    artworks: [],
  },
  {
    slug: "salle-15",
    title: "Salle 15",
    name: "Galerie Nord",
    description: "Art régional et local",
    coordinates: {
      top: "45%",
      left: "85.5%",
      width: "5.5%",
      height: "14%",
    },
    status: "active",
    displayOrder: 15,
    artworks: [],
  },
  {
    slug: "salle-16",
    title: "Salle 16",
    name: "Cabinet Terminal",
    description: "Dernière salle du parcours",
    coordinates: {
      top: "44%",
      left: "91.8%",
      width: "4.5%",
      height: "14%",
    },
    status: "active",
    displayOrder: 16,
    artworks: [],
  },
];

async function seed() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("🔗 Connexion à MongoDB réussie");

    const db = client.db(dbName);
    const rooms = db.collection("rooms");

    // Vérifier si des salles existent déjà
    const existingRoomsCount = await rooms.countDocuments();

    if (existingRoomsCount > 0) {
      console.log(`ℹ️  ${existingRoomsCount} salle(s) existante(s) trouvée(s)`);
      console.log("⚠️  Suppression des données existantes...");
      await rooms.deleteMany({});
      console.log("✅ Données existantes supprimées");
    }

    // Insérer toutes les salles
    console.log("📦 Insertion des nouvelles salles...");

    for (const roomData of roomsData) {
      const roomToInsert = {
        ...roomData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await rooms.insertOne(roomToInsert);
      console.log(`✅ ${roomData.title} créée (${result.insertedId})`);
    }

    // Statistiques finales
    const totalRooms = await rooms.countDocuments();
    const roomsWithArtworks = await rooms.countDocuments({
      "artworks.0": { $exists: true },
    });

    console.log("\n📊 Résumé du seed :");
    console.log(`   • Total salles créées : ${totalRooms}`);
    console.log(`   • Salles avec œuvres : ${roomsWithArtworks}`);
    console.log(`   • Salles vides : ${totalRooms - roomsWithArtworks}`);
    console.log("\n🎉 Seed terminé avec succès !");
    console.log("💡 Vous pouvez maintenant accéder à /admin/salles");
  } catch (error) {
    console.error("❌ Erreur de seed :", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("🔌 Connexion MongoDB fermée");
  }
}

seed();
