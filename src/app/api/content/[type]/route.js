import { NextResponse } from "next/server";
import { getContentByType, createOrUpdateContent } from "@/lib/mongodb";
import { withAuth } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const { type } = await params;

    const content = await getContentByType(type);

    if (!content) {
      const defaultContent = {
        type,
        title: "À propos de moi",
        content: "Contenu à définir...",
        imageUrl: null,
      };

      return NextResponse.json(defaultContent);
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("Erreur lors de la récupération du contenu:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du contenu" },
      { status: 500 }
    );
  }
}

export const PUT = withAuth(async (request, { params }) => {
  try {
    const { type } = await params;
    const updateData = await request.json();

    const { title, content, imageUrl } = updateData;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Le titre est requis" },
        { status: 400 }
      );
    }

    if (
      !content ||
      typeof content !== "string" ||
      content.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Le contenu est requis" },
        { status: 400 }
      );
    }

    if (content.length > 3000) {
      return NextResponse.json(
        {
          error: `Contenu excessivement long (${content.length} caractères). Limite : 3000 caractères pour maintenir une bonne expérience utilisateur.`,
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
