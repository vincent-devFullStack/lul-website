import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri || !dbName) {
  throw new Error("Please define MONGODB_URI and MONGODB_DB in .env.local");
}

let cached = global.mongoose || { conn: null, promise: null };

async function connectToDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      dbName,
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  global.mongoose = cached;
  return cached.conn;
}

export async function getRoomBySlug(slug) {
  const conn = await connectToDB();
  const Room = conn.model(
    "Room",
    new mongoose.Schema({ slug: String }, { strict: false })
  );
  return await Room.findOne({ slug }).lean();
}

export async function getAllRoomSlugs() {
  const conn = await connectToDB();
  const Room = conn.model(
    "Room",
    new mongoose.Schema({ slug: String }, { strict: false })
  );
  const rooms = await Room.find({}, { slug: 1 }).lean();
  return rooms.map((room) => room.slug);
}
