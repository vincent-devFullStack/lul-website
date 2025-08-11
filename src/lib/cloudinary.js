// src/lib/cloudinary.js
import "server-only";
import { v2 as cloudinary } from "cloudinary";

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  // En prod on évite de crasher pour ne pas masquer d’autres erreurs,
  // mais en dev c’est utile d’être bruyant.
  if (process.env.NODE_ENV !== "production") {
    throw new Error(
      "[cloudinary] Variables manquantes: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET"
    );
  }
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

/**
 * ⚠️ Idéalement stocke `public_id` à l’upload et ne parse pas l’URL.
 * Ce helper est un fallback si tu n’as que l’URL.
 */
export function getPublicIdFromUrl(url) {
  try {
    if (!url || !url.includes("/upload/")) return null;
    const u = new URL(url);
    const path = u.pathname; // /<cloud_name>/image/upload/v123/folder/name.ext
    const afterUpload = path.split("/upload/")[1] || "";
    // Retire la version (vNNN/)
    const noVersion = afterUpload.replace(/^v\d+\//, "");
    // Enlève l’extension
    const withoutExt = noVersion.replace(/\.[a-zA-Z0-9]+$/, "");
    return withoutExt; // ex: "artworks/folder/name"
  } catch {
    return null;
  }
}
