// app/api/credits/route.js
import { NextResponse } from "next/server";
import { connectToDatabase, getMementoModel } from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await connectToDatabase();
    const Memento = getMementoModel();

    // Ne charger que les champs utiles
    const mementos = await Memento.find(
      {},
      "author role imageUrl quote link createdAt"
    )
      .sort({ createdAt: -1 })
      .lean();

    // Regrouper par auteur (sans doublons, insensible à la casse/espaces)
    const creditsMap = new Map();

    for (const m of mementos) {
      const authorKey = (m.author || "").toLowerCase().trim();
      if (!authorKey) continue;

      if (!creditsMap.has(authorKey)) {
        creditsMap.set(authorKey, {
          _id: m._id,
          author: m.author,
          role: m.role || "Artiste",
          imageUrl: m.imageUrl || null,
          quote: m.quote || "",
          link: m.link || null,
          createdAt: m.createdAt
            ? new Date(m.createdAt).toISOString()
            : new Date().toISOString(),
          quotesCount: 1,
        });
      } else {
        const existing = creditsMap.get(authorKey);
        existing.quotesCount += 1;

        // Garder la citation la plus courte pour l'aperçu
        if ((m.quote || "").length < (existing.quote || "").length) {
          existing.quote = m.quote || existing.quote;
          existing.imageUrl = m.imageUrl || existing.imageUrl;
          existing.link = m.link || existing.link;
        }
      }
    }

    // Tableau final trié par nom d’auteur
    const credits = Array.from(creditsMap.values()).sort((a, b) =>
      a.author.localeCompare(b.author, "fr", { sensitivity: "base" })
    );

    return NextResponse.json(credits, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Erreur API crédits:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des crédits" },
      { status: 500 }
    );
  }
}
