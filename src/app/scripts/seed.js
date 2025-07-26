// src/app/scripts/seed.js
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri || !dbName) {
  throw new Error(
    "Please define MONGODB_URI and MONGODB_DB in your .env.local file"
  );
}

async function seed() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const rooms = db.collection("rooms");

    const existingRoom = await rooms.findOne({ slug: "salle-1" });

    if (existingRoom) {
      console.log(
        "ℹ️ La salle 'salle-1' existe déjà. Aucune modification apportée."
      );
    } else {
      const result = await rooms.insertOne({
        slug: "salle-1",
        title: "Salle 1",
        artworks: [
          {
            title: "Composition No. 1",
            imageUrl: "/assets/artwork1.webp",
            description: "Une œuvre expérimentale inspirée du constructivisme.",
          },
          {
            title: "Déstructuration",
            imageUrl: "/assets/artwork2.webp",
            description: "Exploration brute de la fragmentation visuelle.",
          },
        ],
      });

      console.log(`✅ Nouvelle salle insérée : ${result.insertedId}`);
    }
  } catch (error) {
    console.error("❌ Erreur de seed :", error);
  } finally {
    await client.close();
  }
}

seed();
