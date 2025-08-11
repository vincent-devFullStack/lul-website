// app/api/salles/[slug]/route.js
import { NextResponse } from "next/server";
import { getRoomBySlug, updateRoom } from "@/lib/mongodb";
import { withAuth } from "@/lib/auth";
import { revalidatePath, revalidateTag } from "next/cache";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const noStore = { "Cache-Control": "no-store" };

export async function GET(_req, { params }) {
  try {
    const { slug } = params; // pas de await ici
    const room = await getRoomBySlug(slug);

    if (!room) {
      return NextResponse.json(
        { error: "Salle non trouvée" },
        { status: 404, headers: noStore }
      );
    }

    if (room.status === "maintenance") {
      return NextResponse.json(
        { error: "Salle en maintenance", maintenance: true },
        { status: 403, headers: noStore }
      );
    }

    return NextResponse.json(room, { headers: noStore });
  } catch (error) {
    console.error("Erreur lors de la récupération de la salle:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la salle" },
      { status: 500, headers: noStore }
    );
  }
}

export const PUT = withAuth(async (request, { params }) => {
  try {
    const { slug } = params; // pas de await
    const body = await request.json();

    // validation
    const allowedFields = ["name", "description", "status", "coordinates"];
    const filteredData = {};

    for (const [key, value] of Object.entries(body)) {
      if (!allowedFields.includes(key)) continue;

      if (key === "name" || key === "description") {
        if (typeof value !== "string" || !value.trim()) {
          return NextResponse.json(
            {
              error: `Le champ ${key} est requis et doit être une chaîne non vide`,
            },
            { status: 400, headers: noStore }
          );
        }
        filteredData[key] = value.trim();
      }

      if (key === "status") {
        if (!["active", "maintenance"].includes(value)) {
          return NextResponse.json(
            { error: "Le statut doit être 'active' ou 'maintenance'" },
            { status: 400, headers: noStore }
          );
        }
        filteredData.status = value;
      }

      if (key === "coordinates") {
        const c = value || {};
        const needed = ["top", "left", "width", "height"];
        for (const k of needed) {
          // autorise 0 (== null/undefined seulement)
          if (c[k] == null || !Number.isFinite(Number(c[k]))) {
            return NextResponse.json(
              { error: `Coordonnée invalide: ${k}` },
              { status: 400, headers: noStore }
            );
          }
          // si ce sont des pourcentages, on borne 0..100
          c[k] = Math.max(0, Math.min(100, Number(c[k])));
        }
        filteredData.coordinates = c;
      }
    }

    if (Object.keys(filteredData).length === 0) {
      return NextResponse.json(
        { error: "Aucune donnée valide à mettre à jour" },
        { status: 400, headers: noStore }
      );
    }

    filteredData.updatedAt = new Date();

    const updatedRoom = await updateRoom(slug, filteredData);
    if (!updatedRoom) {
      return NextResponse.json(
        { error: "Salle non trouvée" },
        { status: 404, headers: noStore }
      );
    }

    // Invalidate le cache côté pages + les requêtes taguées
    revalidatePath("/accueil");
    revalidatePath(`/rooms/${slug}`);
    revalidateTag(`room:${slug}`);
    revalidateTag("rooms");

    return NextResponse.json(
      {
        success: true,
        message: "Salle mise à jour avec succès",
        room: updatedRoom,
      },
      { headers: noStore }
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la salle:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la salle" },
      { status: 500, headers: noStore }
    );
  }
});
