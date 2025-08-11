// app/api/content/[type]/route.js
import { NextResponse } from "next/server";
import { getContentByType, createOrUpdateContent } from "@/lib/mongodb";
import { withAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_request, context) {
  try {
    const { type } = (await context).params; // ✅ await context before using params

    if (!type || typeof type !== "string") {
      return NextResponse.json(
        { error: "Paramètre 'type' manquant ou invalide." },
        { status: 400 }
      );
    }

    const content = await getContentByType(type);

    return NextResponse.json(
      content ?? {
        type,
        title: "À propos de moi",
        content: "Contenu à définir...",
        imageUrl: null,
      }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération du contenu:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du contenu" },
      { status: 500 }
    );
  }
}

export const PUT = withAuth(async (request, context) => {
  try {
    const { type } = (await context).params; // ✅ await context before using params

    if (!type || typeof type !== "string") {
      return NextResponse.json(
        { error: "Paramètre 'type' manquant ou invalide." },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Corps de requête JSON invalide." },
        { status: 400 }
      );
    }

    const { title, content, imageUrl } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "Le titre est requis" },
        { status: 400 }
      );
    }
    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "Le contenu est requis" },
        { status: 400 }
      );
    }
    if (content.length > 3000) {
      return NextResponse.json(
        {
          error: `Contenu excessivement long (${content.length} caractères). Limite : 3000.`,
          currentLength: content.length,
          recommendedMax: 2000,
        },
        { status: 400 }
      );
    }

    const filteredData = {
      type,
      title: title.trim(),
      content: content.trim(),
      imageUrl: imageUrl || null,
    };

    const updatedContent = await createOrUpdateContent(type, filteredData);

    return NextResponse.json({
      message: "Contenu mis à jour avec succès",
      content: updatedContent,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du contenu:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du contenu" },
      { status: 500 }
    );
  }
});
