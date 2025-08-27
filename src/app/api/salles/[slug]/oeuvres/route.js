// app/api/salles/[slug]/oeuvres/route.js
import { NextResponse } from "next/server";
import {
  getRoomWithArtworks,
  addArtworkToRoom,
  updateArtworkInRoom,
  deleteArtworkFromRoom,
} from "@/lib/mongodb";
import { withAuth } from "@/lib/auth";
import { revalidatePath, revalidateTag } from "next/cache";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const noStore = { "Cache-Control": "no-store" };

function sanitizeText(v) {
  return typeof v === "string" ? v.trim() : "";
}

// GET /api/salles/[slug]/oeuvres - Récupérer les œuvres d'une salle
export async function GET(_request, { params }) {
  try {
    const { slug } = await params;
    const room = await getRoomWithArtworks(slug);

    if (!room) {
      return NextResponse.json(
        { error: "Salle non trouvée" },
        { status: 404, headers: noStore }
      );
    }

    return NextResponse.json(
      {
        room: {
          slug: room.slug,
          title: room.name || room.title || room.slug,
        },
        artworks: room.artworks || [],
      },
      { headers: noStore }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des œuvres:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des œuvres" },
      { status: 500, headers: noStore }
    );
  }
}

// POST /api/salles/[slug]/oeuvres - Ajouter une œuvre à une salle
export const POST = withAuth(async (request, { params }) => {
  try {
    const { slug } = await params;
    const body = await request.json();

    const title = sanitizeText(body.title);
    const description = sanitizeText(body.description) || ""; // optionnel
    const imageUrl = sanitizeText(body.imageUrl);

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: "Titre et image sont requis" },
        { status: 400, headers: noStore }
      );
    }

    const newArtwork = await addArtworkToRoom(slug, {
      title,
      description,
      imageUrl,
    });

    // Invalidation ISR/CDN
    revalidatePath("/accueil");
    revalidatePath(`/rooms/${slug}`);
    revalidateTag("rooms");
    revalidateTag(`room:${slug}`);

    return NextResponse.json(
      { success: true, artwork: newArtwork },
      { status: 201, headers: noStore }
    );
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'œuvre:", error);

    if (error?.message === "Salle non trouvée") {
      return NextResponse.json(
        { error: error.message },
        { status: 404, headers: noStore }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de l'ajout de l'œuvre" },
      { status: 500, headers: noStore }
    );
  }
});

// PUT /api/salles/[slug]/oeuvres - Modifier une œuvre
export const PUT = withAuth(async (request, { params }) => {
  try {
    const { slug } = await params;
    const body = await request.json();

    const artworkId = sanitizeText(body.artworkId);
    const title = sanitizeText(body.title);
    const description = sanitizeText(body.description) || ""; // optionnel
    const imageUrl = sanitizeText(body.imageUrl);

    if (!artworkId || !title || !imageUrl) {
      return NextResponse.json(
        { error: "ID de l'œuvre, titre et image sont requis" },
        { status: 400, headers: noStore }
      );
    }

    const updatedArtwork = await updateArtworkInRoom(slug, artworkId, {
      title,
      description,
      imageUrl,
    });

    // Invalidation ISR/CDN
    revalidatePath("/accueil");
    revalidatePath(`/rooms/${slug}`);
    revalidateTag("rooms");
    revalidateTag(`room:${slug}`);

    return NextResponse.json(
      { success: true, artwork: updatedArtwork },
      { headers: noStore }
    );
  } catch (error) {
    console.error("Erreur lors de la modification de l'œuvre:", error);

    if (
      error?.message === "Salle non trouvée" ||
      error?.message === "Œuvre non trouvée"
    ) {
      return NextResponse.json(
        { error: error.message },
        { status: 404, headers: noStore }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la modification de l'œuvre" },
      { status: 500, headers: noStore }
    );
  }
});

// DELETE /api/salles/[slug]/oeuvres - Supprimer une œuvre
export const DELETE = withAuth(async (request, { params }) => {
  try {
    const { slug } = await params;

    // on tente d'abord querystring ?artworkId=...
    const { searchParams } = new URL(request.url);
    let artworkId = sanitizeText(searchParams.get("artworkId"));

    // fallback: dans le body JSON si besoin
    if (!artworkId) {
      try {
        const body = await request.json();
        artworkId = sanitizeText(body?.artworkId);
      } catch {
        // ignore si pas de body
      }
    }

    if (!artworkId) {
      return NextResponse.json(
        { error: "ID de l'œuvre requis" },
        { status: 400, headers: noStore }
      );
    }

    const result = await deleteArtworkFromRoom(slug, artworkId);

    // Invalidation ISR/CDN
    revalidatePath("/accueil");
    revalidatePath(`/rooms/${slug}`);
    revalidateTag("rooms");
    revalidateTag(`room:${slug}`);

    return NextResponse.json(result, { headers: noStore });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'œuvre:", error);

    if (
      error?.message === "Salle non trouvée" ||
      error?.message === "Œuvre non trouvée"
    ) {
      return NextResponse.json(
        { error: error.message },
        { status: 404, headers: noStore }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'œuvre" },
      { status: 500, headers: noStore }
    );
  }
});
