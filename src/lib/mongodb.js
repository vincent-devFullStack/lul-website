import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Veuillez définir MONGODB_URI dans .env.local");
}

let cached = global.mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  global.mongoose = cached;
  return cached.conn;
}

// Utilitaires spécifiques aux rooms (optionnel)
const RoomSchema = new mongoose.Schema({ slug: String }, { strict: false });
let RoomModel;

function getRoomModel() {
  if (!RoomModel) {
    RoomModel = mongoose.models.Room || mongoose.model("Room", RoomSchema);
  }
  return RoomModel;
}

export async function getRoomBySlug(slug) {
  await connectToDatabase();
  const Room = getRoomModel();
  return await Room.findOne({ slug }).lean();
}

export async function getAllRoomSlugs() {
  await connectToDatabase();
  const Room = getRoomModel();
  const rooms = await Room.find({}, { slug: 1 }).lean();
  return rooms.map((room) => room.slug);
}
