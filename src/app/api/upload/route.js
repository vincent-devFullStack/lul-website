// app/api/upload/route.js
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);
const ALLOWED_FOLDERS = new Set(["artworks", "mementos"]);
const noStore = { "Cache-Control": "no-store" };

export const POST = withAuth(async (request) => {
  try {
    const formData = await request.formData();
    const file = formData.get("image");
    let folder = String(formData.get("folder") || "artworks").toLowerCase();

    // Fichier manquant / invalide
    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Aucun fichier envoyé" },
        { status: 400, headers: noStore }
      );
    }

    // Dossier autorisé
    if (!ALLOWED_FOLDERS.has(folder)) {
      return NextResponse.json(
        { error: "Dossier non autorisé" },
        { status: 400, headers: noStore }
      );
    }

    // Type autorisé
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé. Utilisez JPG, PNG ou WebP." },
        { status: 400, headers: noStore }
      );
    }

    // Taille max
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Fichier trop volumineux. Maximum 5 Mo." },
        { status: 400, headers: noStore }
      );
    }

    // On convertit en Data URI (OK vu la limite 5 Mo)
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataURI = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder,
      resource_type: "image",
      overwrite: false,
      invalidate: false,
    });

    return NextResponse.json(
      {
        success: true,
        imageUrl: result.secure_url,
        publicId: result.public_id,
      },
      { headers: noStore }
    );
  } catch (error) {
    console.error("Erreur Cloudinary :", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload du fichier" },
      { status: 500, headers: noStore }
    );
  }
});
