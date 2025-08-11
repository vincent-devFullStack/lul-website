// app/api/memento/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase, getMementoModel } from "@/lib/mongodb";
import { withAuth } from "@/lib/auth";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };
const isHttpsUrl = (u) => typeof u === "string" && /^https?:\/\//i.test(u);
const t = (v) => (typeof v === "string" ? v.trim() : "");

export async function GET() {
  try {
    await connectToDatabase();
    const Memento = getMementoModel();

    const mementos = await Memento.find({})
      .sort({ createdAt: -1, _id: -1 })
      .lean();

    return NextResponse.json(mementos, { headers: noStore });
  } catch (err) {
    console.error("GET /api/memento error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des mementos" },
      { status: 500, headers: noStore }
    );
  }
}

export const POST = withAuth(async (req) => {
  try {
    await connectToDatabase();
    const Memento = getMementoModel();

    const bodyRaw = await req.json();
    const body = {
      quote: t(bodyRaw.quote),
      author: t(bodyRaw.author),
      role: t(bodyRaw.role),
      link: t(bodyRaw.link) || null,
      imageUrl: t(bodyRaw.imageUrl),
    };

    if (!body.quote || !body.author || !body.role || !body.imageUrl) {
      return NextResponse.json(
        { error: "Les champs citation, auteur, rôle et image sont requis" },
        { status: 400, headers: noStore }
      );
    }
    if (body.quote.length > 1000) {
      return NextResponse.json(
        { error: "Citation trop longue (max 1000 caractères)" },
        { status: 400, headers: noStore }
      );
    }
    if (body.link && !isHttpsUrl(body.link)) {
      return NextResponse.json(
        { error: "Lien invalide (http/https requis)" },
        { status: 400, headers: noStore }
      );
    }
    if (!isHttpsUrl(body.imageUrl)) {
      return NextResponse.json(
        { error: "URL d'image invalide (http/https requis)" },
        { status: 400, headers: noStore }
      );
    }

    const memento = await Memento.create(body);
    return NextResponse.json(memento, { status: 201, headers: noStore });
  } catch (err) {
    console.error("POST /api/memento error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la création du memento" },
      { status: 500, headers: noStore }
    );
  }
});

export const PUT = withAuth(async (req) => {
  try {
    await connectToDatabase();
    const Memento = getMementoModel();

    const bodyRaw = await req.json();
    const id = t(bodyRaw.id);
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "ID du memento invalide" },
        { status: 400, headers: noStore }
      );
    }

    const update = {
      // on ne met à jour que les champs fournis (trimés)
      ...(bodyRaw.quote !== undefined && { quote: t(bodyRaw.quote) }),
      ...(bodyRaw.author !== undefined && { author: t(bodyRaw.author) }),
      ...(bodyRaw.role !== undefined && { role: t(bodyRaw.role) }),
      ...(bodyRaw.link !== undefined && { link: t(bodyRaw.link) || null }),
      ...(bodyRaw.imageUrl !== undefined && { imageUrl: t(bodyRaw.imageUrl) }),
      updatedAt: new Date(),
    };

    if (update.link && !isHttpsUrl(update.link)) {
      return NextResponse.json(
        { error: "Lien invalide (http/https requis)" },
        { status: 400, headers: noStore }
      );
    }
    if (update.imageUrl && !isHttpsUrl(update.imageUrl)) {
      return NextResponse.json(
        { error: "URL d'image invalide (http/https requis)" },
        { status: 400, headers: noStore }
      );
    }

    const updatedMemento = await Memento.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!updatedMemento) {
      return NextResponse.json(
        { error: "Memento non trouvé" },
        { status: 404, headers: noStore }
      );
    }

    return NextResponse.json(updatedMemento, { headers: noStore });
  } catch (err) {
    console.error("PUT /api/memento error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du memento" },
      { status: 500, headers: noStore }
    );
  }
});

export const DELETE = withAuth(async (req) => {
  try {
    await connectToDatabase();
    const Memento = getMementoModel();

    const { id } = await req.json();
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "ID invalide" },
        { status: 400, headers: noStore }
      );
    }

    const deleted = await Memento.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Memento non trouvé" },
        { status: 404, headers: noStore }
      );
    }

    return NextResponse.json({ success: true }, { headers: noStore });
  } catch (err) {
    console.error("DELETE /api/memento error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500, headers: noStore }
    );
  }
});
