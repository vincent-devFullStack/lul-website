import { NextResponse } from "next/server";
import { getRoomBySlug, updateRoom } from "@/lib/mongodb";
import { withAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache"; // 👈 NEW

export async function GET(_request, { params }) {
  try {
    const { slug } = await params;
    const room = await getRoomBySlug(slug);

    if (!room) {
      return NextResponse.json({ error: "Salle non trouvée" }, { status: 404 });
    }
    if (room.status === "maintenance") {
      return NextResponse.json(
        { error: "Salle en maintenance" },
        { status: 403 }
      );
    }

    return NextResponse.json(room);
  } catch (error) {
    console.error("Erreur lors de la récupération de la salle:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la salle" },
      { status: 500 }
    );
  }
}

export const PUT = withAuth(async (request, { params }) => {
  try {
    const { slug } = await params;
    const updateData = await request.json();

    // validation…
    const allowedFields = ["name", "description", "status", "coordinates"];
    const filteredData = {};
    for (const [key, value] of Object.entries(updateData)) {
      if (!allowedFields.includes(key)) continue;

      if (key === "name" || key === "description") {
        if (typeof value !== "string" || !value.trim()) {
          return NextResponse.json(
            {
              error: `Le champ ${key} est requis et doit être une chaîne non vide`,
            },
            { status: 400 }
          );
        }
        filteredData[key] = value.trim();
      } else if (key === "status") {
        if (!["active", "maintenance"].includes(value)) {
          return NextResponse.json(
            { error: "Le statut doit être 'active' ou 'maintenance'" },
            { status: 400 }
          );
        }
        filteredData[key] = value;
      } else if (key === "coordinates") {
        if (!value?.top || !value?.left || !value?.width || !value?.height) {
          return NextResponse.json(
            {
              error:
                "Les coordonnées doivent contenir top, left, width et height",
            },
            { status: 400 }
          );
        }
        filteredData[key] = value;
      }
    }

    if (Object.keys(filteredData).length === 0) {
      return NextResponse.json(
        { error: "Aucune donnée valide à mettre à jour" },
        { status: 400 }
      );
    }

    filteredData.updatedAt = new Date();

    const updatedRoom = await updateRoom(slug, filteredData);
    if (!updatedRoom) {
      return NextResponse.json({ error: "Salle non trouvée" }, { status: 404 });
    }

    // ✅ Invalidation ISR (Vercel/CDN)
    revalidatePath("/accueil"); // la carte interactive
    revalidatePath(`/rooms/${slug}`); // la page de cette salle

    return NextResponse.json({
      success: true,
      message: "Salle mise à jour avec succès",
      room: updatedRoom,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la salle:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la salle" },
      { status: 500 }
    );
  }
});
