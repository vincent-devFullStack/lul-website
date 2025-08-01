import { NextResponse } from "next/server";
import { connectToDatabase, getMementoModel } from "@/lib/mongodb";
import { withAuth } from "@/lib/auth";

// GET all mementos
export async function GET() {
  await connectToDatabase();
  const Memento = getMementoModel();
  const mementos = await Memento.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(mementos);
}

// POST, PUT, DELETE by ID
export const dynamic = "force-dynamic"; // Pour Next.js App Router

export const POST = withAuth(async (req) => {
  await connectToDatabase();
  const Memento = getMementoModel();
  const body = await req.json();

  if (!body.quote || !body.author || !body.role || !body.imageUrl) {
    return NextResponse.json(
      { error: "Tous les champs sont requis" },
      { status: 400 }
    );
  }

  const memento = await Memento.create(body);
  return NextResponse.json(memento, { status: 201 });
});

export const PUT = withAuth(async (req) => {
  await connectToDatabase();
  const Memento = getMementoModel();
  const { id, ...body } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }
  const memento = await Memento.findByIdAndUpdate(id, body, { new: true });
  if (!memento) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }
  return NextResponse.json(memento);
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
