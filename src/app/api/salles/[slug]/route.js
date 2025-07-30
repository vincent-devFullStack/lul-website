import { NextResponse } from "next/server";
import { connectToDatabase, getRoomBySlug, updateRoom } from "@/lib/mongodb";

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const room = await getRoomBySlug(slug);
    
    if (!room) {
      return NextResponse.json(
        { error: "Salle non trouvée" },
        { status: 404 }
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

export async function PUT(request, { params }) {
  try {
    const { slug } = params;
    const updateData = await request.json();
    
    // Validation des données
    const allowedFields = ['name', 'description', 'status', 'coordinates'];
    const filteredData = {};
    
    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        if (key === 'name' || key === 'description') {
          if (typeof value !== 'string' || value.trim().length === 0) {
            return NextResponse.json(
              { error: `Le champ ${key} est requis et doit être une chaîne non vide` },
              { status: 400 }
            );
          }
          filteredData[key] = value.trim();
        } else if (key === 'status') {
          if (!['active', 'restricted', 'maintenance'].includes(value)) {
            return NextResponse.json(
              { error: "Le statut doit être 'active', 'restricted' ou 'maintenance'" },
              { status: 400 }
            );
          }
          filteredData[key] = value;
        } else if (key === 'coordinates') {
          if (typeof value !== 'object' || !value.top || !value.left || !value.width || !value.height) {
            return NextResponse.json(
              { error: "Les coordonnées doivent contenir top, left, width et height" },
              { status: 400 }
            );
          }
          filteredData[key] = value;
        }
      }
    }
    
    if (Object.keys(filteredData).length === 0) {
      return NextResponse.json(
        { error: "Aucune donnée valide à mettre à jour" },
        { status: 400 }
      );
    }
    
    // Ajouter updatedAt
    filteredData.updatedAt = new Date();
    
    const updatedRoom = await updateRoom(slug, filteredData);
    
    if (!updatedRoom) {
      return NextResponse.json(
        { error: "Salle non trouvée" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Salle mise à jour avec succès",
      room: updatedRoom
    });
    
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la salle:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la salle" },
      { status: 500 }
    );
  }
}