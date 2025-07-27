import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req, context) {
  const params = await context.params;
  const { token } = params;
  const { password } = await req.json();

  if (!password || !token) {
    return NextResponse.json({ error: "Champs manquants." }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const user = await User.findOne({ resetToken: token });

    if (!user) {
      return NextResponse.json(
        { error: "Lien invalide ou expiré." },
        { status: 400 }
      );
    }

    if (user.resetTokenExpires < Date.now()) {
      return NextResponse.json(
        { error: "Lien expiré. Veuillez refaire une demande." },
        { status: 403 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);
    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur reset password :", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
