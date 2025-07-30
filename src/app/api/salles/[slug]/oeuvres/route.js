import { NextResponse } from "next/server";
import { 
  getRoomWithArtworks, 
  addArtworkToRoom, 
  updateArtworkInRoom, 
  deleteArtworkFromRoom 
} from "@/lib/mongodb";

// GET /api/salles/[slug]/oeuvres - Récupérer les œuvres d'une salle
export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const room = await getRoomWithArtworks(slug);
    
    if (!room) {
      return NextResponse.json(
        { error: "Salle non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      room: {
        slug: room.slug,
        title: room.title
      },
      artworks: room.artworks || []
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des œuvres:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des œuvres" },
      { status: 500 }
    );
  }
}

// POST /api/salles/[slug]/oeuvres - Ajouter une œuvre à une salle
export async function POST(request, { params }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    
    // Validation des données
    if (!body.title || !body.description || !body.imageUrl) {
      return NextResponse.json(
        { error: "Titre, description et image sont requis" },
        { status: 400 }
      );
    }

    const newArtwork = await addArtworkToRoom(slug, {
      title: body.title.trim(),
      description: body.description.trim(),
      imageUrl: body.imageUrl.trim()
    });

    return NextResponse.json({
      success: true,
      artwork: newArtwork
    }, { status: 201 });

  } catch (error) {
    console.error("Erreur lors de l'ajout de l'œuvre:", error);
    
    if (error.message === "Salle non trouvée") {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Erreur lors de l'ajout de l'œuvre" },
      { status: 500 }
    );
  }
}

// PUT /api/salles/[slug]/oeuvres - Modifier une œuvre
export async function PUT(request, { params }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    
    // Validation des données
    if (!body.artworkId || !body.title || !body.description || !body.imageUrl) {
      return NextResponse.json(
        { error: "ID de l'œuvre, titre, description et image sont requis" },
        { status: 400 }
      );
    }

    const updatedArtwork = await updateArtworkInRoom(slug, body.artworkId, {
      title: body.title.trim(),
      description: body.description.trim(),
      imageUrl: body.imageUrl.trim()
    });

    return NextResponse.json({
      success: true,
      artwork: updatedArtwork
    });

  } catch (error) {
    console.error("Erreur lors de la modification de l'œuvre:", error);
    
    if (error.message === "Salle non trouvée" || error.message === "Œuvre non trouvée") {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Erreur lors de la modification de l'œuvre" },
      { status: 500 }
    );
  }
}

// DELETE /api/salles/[slug]/oeuvres - Supprimer une œuvre
export async function DELETE(request, { params }) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const artworkId = searchParams.get('artworkId');
    
    if (!artworkId) {
      return NextResponse.json(
        { error: "ID de l'œuvre requis" },
        { status: 400 }
      );
    }

    const result = await deleteArtworkFromRoom(slug, artworkId);

    return NextResponse.json(result);

  } catch (error) {
    console.error("Erreur lors de la suppression de l'œuvre:", error);
    
    if (error.message === "Salle non trouvée" || error.message === "Œuvre non trouvée") {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'œuvre" },
      { status: 500 }
    );
  }
} 