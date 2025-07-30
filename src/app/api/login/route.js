import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose"; // ✅ UNIFORMISATION VERS JOSE
import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Champs requis." }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: email.toLowerCase() });

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

    // ✅ Génération du token JWT avec JOSE (uniformisé)
    const token = await new SignJWT({
      id: user._id,
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(SECRET);

    // ✅ Création de la réponse avec le cookie sécurisé
    const response = NextResponse.json({ success: true });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 jour
    });

    return response;
  } catch (err) {
    console.error("❌ Erreur login :", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
