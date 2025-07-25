import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri || !dbName) {
  throw new Error("Please define MONGODB_URI and MONGODB_DB in .env.local");
}

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function getRoomBySlug(slug) {
  const client = await clientPromise;
  const db = client.db(dbName);
  const collection = db.collection("rooms");

  return await collection.findOne({ slug });
}

export async function getAllRoomSlugs() {
  const client = await clientPromise;
  const db = client.db(dbName);
  const rooms = await db
    .collection("rooms")
    .find({}, { projection: { slug: 1 } })
    .toArray();
  console.log("ROOM DATA:", rooms);

  return rooms.map((room) => room.slug);
}
