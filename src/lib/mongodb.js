// src/lib/mongodb.js
import mongoose from "mongoose";
import cloudinary from "@/lib/cloudinary";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Veuillez définir MONGODB_URI dans .env.local");

// Cache de connexion pour éviter les multiples connexions en dev
let cached = globalThis.__mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { bufferCommands: false });
  }
  cached.conn = await cached.promise;
  globalThis.__mongoose = cached;
  return cached.conn;
}

/* =========================
   Schemas & Models
========================= */

const ArtworkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    // ✅ description optionnelle
    description: { type: String, required: false, default: "", trim: true },
    imageUrl: { type: String, required: true, trim: true },
    artist: { type: String, default: "", trim: true },
    // facultatif mais utile si tu veux supprimer côté Cloudinary sans parser l’URL
    publicId: { type: String, default: null },
  },
  { timestamps: true }
);

const ContentSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    imageUrl: { type: String, default: null },
  },
  { timestamps: true }
);

const RoomSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    coordinates: {
      top: { type: String, required: true },
      left: { type: String, required: true },
      width: { type: String, required: true },
      height: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["active", "maintenance"], // aligné avec tes routes API
      default: "active",
    },
    displayOrder: { type: Number, required: true },
    artworks: [ArtworkSchema],
  },
  { timestamps: true }
);

const MementoSchema = new mongoose.Schema(
  {
    quote: { type: String, required: true },
    author: { type: String, required: true },
    role: { type: String, required: true },
    link: { type: String, required: false, default: null },
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

/* =========================
   Sérialisation (ObjectId -> string)
========================= */

function serializeMongoObject(obj) {
  if (!obj) return null;
  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      if (
        value &&
        typeof value === "object" &&
        value.constructor &&
        value.constructor.name === "ObjectId"
      ) {
        return value.toString();
      }
      return value;
    })
  );
}

/* =========================
   ROOM CRUD
========================= */

export async function getRoomBySlug(slug) {
  await connectToDatabase();
  const Room = getRoomModel();

  // Inclut status (utilisé par l’API pour bloquer “maintenance”)
  const room = await Room.findOne(
    { slug },
    {
      slug: 1,
      name: 1,
      title: 1,
      description: 1,
      status: 1,
      coordinates: 1,
      artworks: 1,
    }
  ).lean();

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

/* =========================
   Helpers Cloudinary
========================= */

// Extrait le public_id complet depuis une URL Cloudinary (avec dossier)
// ex: https://res.cloudinary.com/.../upload/v1700000000/artworks/mon-image.webp
// -> "artworks/mon-image"
function extractCloudinaryPublicId(imageUrl = "") {
  if (
    !imageUrl ||
    typeof imageUrl !== "string" ||
    !imageUrl.includes("/upload/")
  ) {
    return null;
  }
  const m = imageUrl.match(
    /\/upload\/(?:v\d+\/)?(.+?)\.(?:jpg|jpeg|png|webp|gif|bmp|tiff|heic|svg)(?:\?.*)?$/i
  );
  return m ? m[1] : null;
}

/* =========================
   ARTWORK CRUD
========================= */

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

  const idx = room.artworks.findIndex(
    (art) => art._id.toString() === artworkId
  );
  if (idx === -1) throw new Error("Œuvre non trouvée");

  room.artworks[idx] = {
    ...room.artworks[idx].toObject(),
    ...updatedData,
    updatedAt: new Date(),
  };

  room.updatedAt = new Date();
  await room.save();
  return serializeMongoObject(room.artworks[idx]);
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
  const storedPublicId = room.artworks[index].publicId || null;

  // On privilégie publicId si présent, sinon on parse l’URL
  const publicId =
    storedPublicId || extractCloudinaryPublicId(imageUrl) || null;

  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (e) {
      console.warn("Erreur suppression Cloudinary :", e?.message || e);
    }
  }

  room.artworks.splice(index, 1);
  room.updatedAt = new Date();
  await room.save();

  return { success: true, deletedId: artworkId };
}

/* =========================
   CONTENT CRUD
========================= */

export async function getContentByType(type) {
  await connectToDatabase();
  const Content = getContentModel();
  const content = await Content.findOne({ type }).lean();
  return serializeMongoObject(content);
}

export async function createOrUpdateContent(type, data) {
  await connectToDatabase();
  const Content = getContentModel();
  const updateData = { ...data, updatedAt: new Date() };

  const content = await Content.findOneAndUpdate({ type }, updateData, {
    new: true,
    upsert: true,
    runValidators: true,
    lean: true,
  });
  return serializeMongoObject(content);
}
