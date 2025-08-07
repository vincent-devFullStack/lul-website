import { NextResponse } from "next/server";
import { connectToDatabase, getMementoModel } from "@/lib/mongodb";
import { withAuth } from "@/lib/auth";

export async function GET() {
  await connectToDatabase();
  const Memento = getMementoModel();
  const mementos = await Memento.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(mementos);
}

export const dynamic = "force-dynamic";

export const POST = withAuth(async (req) => {
  await connectToDatabase();
  const Memento = getMementoModel();
  const body = await req.json();

  if (!body.quote || !body.author || !body.role || !body.imageUrl) {
    return NextResponse.json(
      { error: "Les champs citation, auteur, rôle et image sont requis" },
      { status: 400 }
    );
  }

  const memento = await Memento.create({
    quote: body.quote,
    author: body.author,
    role: body.role,
    link: body.link || null,
    imageUrl: body.imageUrl,
  });
  return NextResponse.json(memento, { status: 201 });
});

export const PUT = withAuth(async (req) => {
  await connectToDatabase();
  const Memento = getMementoModel();
  const body = await req.json();

  if (!body.id) {
    return NextResponse.json(
      { error: "ID du memento requis" },
      { status: 400 }
    );
  }

  const updatedMemento = await Memento.findByIdAndUpdate(
    body.id,
    {
      quote: body.quote,
      author: body.author,
      role: body.role,
      link: body.link || null,
      imageUrl: body.imageUrl,
      updatedAt: new Date(),
    },
    { new: true }
  );

  if (!updatedMemento) {
    return NextResponse.json({ error: "Memento non trouvé" }, { status: 404 });
  }

  return NextResponse.json(updatedMemento);
});

export const DELETE = withAuth(async (req) => {
  await connectToDatabase();
  const Memento = getMementoModel();
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }
  await Memento.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
});
