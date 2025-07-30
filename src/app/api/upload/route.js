import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

// Configuration
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    // Validation du type de fichier
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé. Utilisez JPG, PNG ou WebP." },
        { status: 400 }
      );
    }

    // Validation de la taille
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Fichier trop volumineux. Maximum 5MB." },
        { status: 400 }
      );
    }

    // Générer un nom de fichier unique
    const fileExtension = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // Convertir en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Définir le chemin de sauvegarde
    const uploadDir = join(process.cwd(), "public", "uploads", "artworks");
    const filePath = join(uploadDir, fileName);

    // Créer le dossier s'il n'existe pas
    try {
      await writeFile(filePath, buffer);
    } catch (error) {
      // Si le dossier n'existe pas, on essaie de le créer
      const { mkdir } = await import("fs/promises");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(filePath, buffer);
    }

    // Retourner l'URL publique
    const imageUrl = `/uploads/artworks/${fileName}`;

    return NextResponse.json({
      success: true,
      imageUrl,
      fileName,
      size: file.size
    });

  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload du fichier" },
      { status: 500 }
    );
  }
} 