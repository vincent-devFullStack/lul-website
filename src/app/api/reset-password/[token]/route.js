import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";

export const revalidate = 0;
export const dynamic = "force-dynamic";
// bcrypt nécessite le runtime Node (pas Edge)
export const runtime = "nodejs";

const noStore = { "Cache-Control": "no-store" };

export async function POST(req, { params }) {
  // params vient directement du segment dynamique [token]
  const token = params?.token || "";

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "JSON invalide." },
      { status: 400, headers: noStore }
    );
  }

  const password = String(body?.password || "");

  if (!token || !password) {
    return NextResponse.json(
      { error: "Champs manquants." },
      { status: 400, headers: noStore }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Le mot de passe doit contenir au moins 6 caractères." },
      { status: 400, headers: noStore }
    );
  }

  try {
    await connectToDatabase();

    // 1) On trouve le user via le token
    const user = await User.findOne({ resetToken: token });

    if (!user) {
      return NextResponse.json(
        { error: "Lien invalide ou expiré." },
        { status: 400, headers: noStore }
      );
    }

    // 2) On vérifie l’expiration
    if (!user.resetTokenExpires || user.resetTokenExpires < Date.now()) {
      return NextResponse.json(
        { error: "Lien expiré. Veuillez refaire une demande." },
        { status: 403, headers: noStore }
      );
    }

    // 3) Hash + reset des champs de token
    const hashed = await bcrypt.hash(password, 12);
    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    return NextResponse.json(
      { success: true },
      { status: 200, headers: noStore }
    );
  } catch (err) {
    console.error("Erreur reset password :", err);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500, headers: noStore }
    );
  }
}
