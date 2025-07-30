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

// Schéma pour les œuvres
const ArtworkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Schéma pour le contenu éditable du site
const ContentSchema = new mongoose.Schema({
  type: { type: String, required: true, unique: true }, // 'about-page'
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Schéma pour les salles
const RoomSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  name: { type: String, required: true }, // Nom complet pour affichage
  description: { type: String, required: true }, // Description pour tooltip
  coordinates: {
    top: { type: String, required: true },
    left: { type: String, required: true },
    width: { type: String, required: true },
    height: { type: String, required: true }
  },
  status: { 
    type: String, 
    enum: ['active', 'restricted', 'maintenance'], 
    default: 'active' 
  },
  displayOrder: { type: Number, required: true }, // Ordre d'affichage
  artworks: [ArtworkSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

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
    ContentModel = mongoose.models.Content || mongoose.model("Content", ContentSchema);
  }
  return ContentModel;
}

// Fonctions existantes
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

// Nouvelles fonctions pour la gestion des salles
export async function getAllRooms() {
  await connectToDatabase();
  const Room = getRoomModel();
  return await Room.find({}).sort({ displayOrder: 1 }).lean();
}

export async function getRoomWithArtworks(slug) {
  await connectToDatabase();
  const Room = getRoomModel();
  return await Room.findOne({ slug }).lean();
}

export async function updateRoom(slug, updateData) {
  await connectToDatabase();
  const Room = getRoomModel();
  return await Room.findOneAndUpdate(
    { slug },
    { $set: updateData },
    { new: true, lean: true }
  );
}

// Fonctions CRUD pour les œuvres
export async function addArtworkToRoom(slug, artworkData) {
  await connectToDatabase();
  const Room = getRoomModel();
  
  const room = await Room.findOne({ slug });
  if (!room) {
    throw new Error("Salle non trouvée");
  }

  const newArtwork = {
    ...artworkData,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  room.artworks.push(newArtwork);
  room.updatedAt = new Date();
  
  await room.save();
  return room.artworks[room.artworks.length - 1];
}

export async function updateArtworkInRoom(slug, artworkId, updatedData) {
  await connectToDatabase();
  const Room = getRoomModel();
  
  const room = await Room.findOne({ slug });
  if (!room) {
    throw new Error("Salle non trouvée");
  }

  const artworkIndex = room.artworks.findIndex(
    artwork => artwork._id.toString() === artworkId
  );
  
  if (artworkIndex === -1) {
    throw new Error("Œuvre non trouvée");
  }

  room.artworks[artworkIndex] = {
    ...room.artworks[artworkIndex].toObject(),
    ...updatedData,
    updatedAt: new Date()
  };
  
  room.updatedAt = new Date();
  await room.save();
  
  return room.artworks[artworkIndex];
}

export async function deleteArtworkFromRoom(slug, artworkId) {
  await connectToDatabase();
  const Room = getRoomModel();
  
  const room = await Room.findOne({ slug });
  if (!room) {
    throw new Error("Salle non trouvée");
  }

  const initialLength = room.artworks.length;
  room.artworks = room.artworks.filter(
    artwork => artwork._id.toString() !== artworkId
  );
  
  if (room.artworks.length === initialLength) {
    throw new Error("Œuvre non trouvée");
  }

  room.updatedAt = new Date();
  await room.save();
  
  return { success: true, deletedId: artworkId };
}

// Nouvelles fonctions pour le contenu
export async function getContentByType(type) {
  await connectToDatabase();
  const Content = getContentModel();
  return await Content.findOne({ type }).lean();
}

export async function createOrUpdateContent(type, data) {
  await connectToDatabase();
  const Content = getContentModel();
  
  const updateData = {
    ...data,
    updatedAt: new Date()
  };
  
  return await Content.findOneAndUpdate(
    { type },
    updateData,
    { 
      new: true, 
      upsert: true, // Crée le document s'il n'existe pas
      runValidators: true,
      lean: true
    }
  );
}
