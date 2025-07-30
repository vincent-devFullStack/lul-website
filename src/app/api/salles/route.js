import { NextResponse } from "next/server";
import { getAllRooms } from "@/lib/mongodb";

export async function GET() {
  try {
    const rooms = await getAllRooms();
    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Erreur lors de la récupération des salles:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des salles" },
      { status: 500 }
    );
  }
} 