import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { serialize } from "cookie";
import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req) {
  const { email, password, confirmPassword, pin } = await req.json();

  if (!email || !password || !confirmPassword || !pin) {
    return NextResponse.json({ error: "Champs manquants." }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: "Les mots de passe ne correspondent pas." },
      { status: 400 }
    );
  }

  if (pin !== process.env.ADMIN_PIN) {
    return NextResponse.json({ error: "Code PIN incorrect." }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const normalizedEmail = String(email).toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email: normalizedEmail, password: hashedPassword });
    await user.save();

    // Générer un JWT
    const token = await new SignJWT({ email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    // Créer un cookie sécurisé
    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });

    const response = NextResponse.json({ success: true }, { status: 201 });
    response.headers.set("Set-Cookie", cookie);

    return response;
  } catch (err) {
    console.error("Erreur à l'enregistrement :", err);
    return NextResponse.json(
      { error: "Erreur serveur. Veuillez réessayer plus tard." },
      { status: 500 }
    );
  }
}
