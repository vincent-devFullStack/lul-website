import mongoose from "mongoose";
import cloudinary from "@/lib/cloudinary"; // 🔁 utilisé dans deleteArtworkFromRoom

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Veuillez définir MONGODB_URI dans .env.local");

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

// Schémas
const ArtworkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
); // ✅ Ajout timestamps

const ContentSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String, default: null },
  },
  { timestamps: true }
); // ✅ Ajout timestamps

const RoomSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    coordinates: {
      top: { type: String, required: true },
      left: { type: String, required: true },
      width: { type: String, required: true },
      height: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["active", "restricted", "maintenance"],
      default: "active",
    },
    displayOrder: { type: Number, required: true },
    artworks: [ArtworkSchema],
  },
  { timestamps: true }
); // ✅ Ajout timestamps

const MementoSchema = new mongoose.Schema(
  {
    quote: { type: String, required: true },
    author: { type: String, required: true },
    role: { type: String, required: true },
    link: { type: String, required: false, default: null }, // ✅ Champ link avec default
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export function getMementoModel() {
  return mongoose.models.Memento || mongoose.model("Memento", MementoSchema);
}

let RoomModel;
let ContentModel;

function getRoomModel() {
  if (!RoomModel) {
    RoomModel = mongoose.models.Room || mongoose.model("Room", RoomSchema);
  }
  return RoomModel;
}

function getContentModel() {
  if (!ContentModel) {
    ContentModel =
      mongoose.models.Content || mongoose.model("Content", ContentSchema);
  }
  return ContentModel;
}

function serializeMongoObject(obj) {
  if (!obj) return null;
  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      if (
        value &&
        typeof value === "object" &&
        value.constructor.name === "ObjectId"
      ) {
        return value.toString();
      }
      return value;
    })
  );
}

// ======== ROOM CRUD ==========

export async function getRoomBySlug(slug) {
  await connectToDatabase();
  const Room = getRoomModel();
  const room = await Room.findOne({ slug }).lean();
  return serializeMongoObject(room);
}

export async function getAllRoomSlugs() {
  await connectToDatabase();
  const Room = getRoomModel();
  const rooms = await Room.find({}, { slug: 1 }).lean();
  return rooms.map((room) => room.slug);
}

export async function getAllRooms() {
  await connectToDatabase();
  const Room = getRoomModel();
  const rooms = await Room.find({}).sort({ displayOrder: 1 }).lean();
  return serializeMongoObject(rooms);
}

export async function getRoomWithArtworks(slug) {
  await connectToDatabase();
  const Room = getRoomModel();
  const room = await Room.findOne({ slug }).lean();
  return serializeMongoObject(room);
}

export async function updateRoom(slug, updateData) {
  await connectToDatabase();
  const Room = getRoomModel();
  const room = await Room.findOneAndUpdate(
    { slug },
    { $set: updateData },
    { new: true, lean: true }
  );
  return serializeMongoObject(room);
}

// ======== ARTWORK CRUD ==========

export async function addArtworkToRoom(slug, artworkData) {
  await connectToDatabase();
  const Room = getRoomModel();
  const room = await Room.findOne({ slug });
  if (!room) throw new Error("Salle non trouvée");

  const newArtwork = {
    ...artworkData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  room.artworks.push(newArtwork);
  room.updatedAt = new Date();

  await room.save();
  return serializeMongoObject(room.artworks[room.artworks.length - 1]);
}

export async function updateArtworkInRoom(slug, artworkId, updatedData) {
  await connectToDatabase();
  const Room = getRoomModel();
  const room = await Room.findOne({ slug });
  if (!room) throw new Error("Salle non trouvée");

  const artworkIndex = room.artworks.findIndex(
    (artwork) => artwork._id.toString() === artworkId
  );
  if (artworkIndex === -1) throw new Error("Œuvre non trouvée");

  room.artworks[artworkIndex] = {
    ...room.artworks[artworkIndex].toObject(),
    ...updatedData,
    updatedAt: new Date(),
  };

  room.updatedAt = new Date();
  await room.save();
  return serializeMongoObject(room.artworks[artworkIndex]);
}

export async function deleteArtworkFromRoom(slug, artworkId) {
  await connectToDatabase();
  const Room = getRoomModel();
  const room = await Room.findOne({ slug });
  if (!room) throw new Error("Salle non trouvée");

  const index = room.artworks.findIndex(
    (a) => a._id.toString() === artworkId.toString()
  );
  if (index === -1) throw new Error("Œuvre non trouvée");

  const imageUrl = room.artworks[index].imageUrl;
  if (imageUrl && imageUrl.includes("res.cloudinary.com")) {
    const publicId = imageUrl.split("/").pop().split(".")[0];
    try {
      await cloudinary.uploader.destroy(`artworks/${publicId}`);
    } catch (e) {
      console.warn("Erreur suppression Cloudinary :", e.message);
    }
  }

  room.artworks.splice(index, 1);
  room.updatedAt = new Date();
  await room.save();

  return { success: true, deletedId: artworkId };
}

// ======== CONTENT CRUD ==========

export async function getContentByType(type) {
  await connectToDatabase();
  const Content = getContentModel();
  const content = await Content.findOne({ type }).lean();
  return serializeMongoObject(content);
}

export async function createOrUpdateContent(type, data) {
  await connectToDatabase();
  const Content = getContentModel();
  const updateData = {
    ...data,
    updatedAt: new Date(),
  };

  const content = await Content.findOneAndUpdate({ type }, updateData, {
    new: true,
    upsert: true,
    runValidators: true,
    lean: true,
  });
  return serializeMongoObject(content);
}
