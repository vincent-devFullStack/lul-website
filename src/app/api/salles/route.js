// app/api/salles/route.js
import { NextResponse } from "next/server";
import { getAllRooms } from "@/lib/mongodb";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const noStore = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    const rooms = await getAllRooms();

    // Optionnel : ne renvoyer que les champs utiles + tri par displayOrder
    const safe = rooms
      .map((r) => ({
        _id: r._id,
        slug: r.slug,
        name: r.name ?? r.title ?? "",
        title: r.title ?? r.name ?? "",
        description: r.description ?? "",
        status: r.status ?? "active",
        displayOrder: r.displayOrder ?? 9999,
        artworks: r.artworks ?? [],
      }))
      .sort((a, b) => (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999));

    return NextResponse.json(safe, { headers: noStore });
  } catch (error) {
    console.error("Erreur lors de la récupération des salles:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des salles" },
      { status: 500, headers: noStore }
    );
  }
}
