// app/api/forgot-password/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { v4 as uuidv4 } from "uuid";

const ADMIN_PIN = process.env.ADMIN_PIN;

export async function POST(req) {
  const { email, pin } = await req.json();

  if (!email || !pin) {
    return NextResponse.json({ error: "Champs requis." }, { status: 400 });
  }

  if (pin !== ADMIN_PIN) {
    return NextResponse.json({ error: "Code PIN invalide." }, { status: 403 });
  }

  try {
    await connectToDatabase();

    const normalizedEmail = email.trim().toLowerCase(); // 👈 nettoyage
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json(
        { error: "Aucun utilisateur trouvé avec cet email." },
        { status: 404 }
      );
    }

    const token = uuidv4();
    const expiration = Date.now() + 1000 * 60 * 15; // 15 min

    user.resetToken = token;
    user.resetTokenExpires = expiration;
    await user.save();

    return NextResponse.json({
      token,
      message: "✅ Code PIN validé. Veuillez saisir un nouveau mot de passe.",
    });
  } catch (err) {
    console.error("Erreur reset password :", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
