import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Champs requis." }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    // ⚠️ Authentification réussie — ici, on pourrait créer un token ou une session
    return NextResponse.json(
      { success: true, userId: user._id },
      { status: 200 }
    );
  } catch (err) {
    console.error("Erreur login :", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
