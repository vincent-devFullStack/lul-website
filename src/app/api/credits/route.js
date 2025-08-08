import { NextResponse } from "next/server";
import { connectToDatabase, getMementoModel } from "@/lib/mongodb";

export async function GET() {
  try {
    // ✅ Connexion correcte avec Mongoose
    await connectToDatabase();
    const Memento = getMementoModel();

    // ✅ Récupérer tous les mementos avec Mongoose
    const mementos = await Memento.find({}).sort({ createdAt: -1 }).lean();

    // ✅ Créer un Map pour éviter les doublons d'auteurs
    const creditsMap = new Map();

    mementos.forEach((memento) => {
      const authorKey = memento.author?.toLowerCase()?.trim();

      if (authorKey && !creditsMap.has(authorKey)) {
        creditsMap.set(authorKey, {
          _id: memento._id,
          author: memento.author,
          role: memento.role || "Artiste",
          imageUrl: memento.imageUrl,
          quote: memento.quote,
          link: memento.link || null,
          createdAt: memento.createdAt || new Date().toISOString(),
          quotesCount: 1,
        });
      } else if (authorKey && creditsMap.has(authorKey)) {
        // ✅ Incrémenter le compteur pour cet auteur
        const existingCredit = creditsMap.get(authorKey);
        existingCredit.quotesCount += 1;

        // ✅ Garder la citation la plus courte pour l'aperçu
        if (memento.quote.length < existingCredit.quote.length) {
          existingCredit.quote = memento.quote;
          existingCredit.imageUrl = memento.imageUrl;
          existingCredit.link = memento.link || existingCredit.link;
        }
      }
    });

    // ✅ Convertir en array
    const credits = Array.from(creditsMap.values());

    return NextResponse.json(credits);
  } catch (error) {
    console.error("Erreur API crédits:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des crédits" },
      { status: 500 }
    );
  }
}
