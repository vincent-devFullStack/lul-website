import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";

// Evite tout cache côté Vercel/Next
export const revalidate = 0;
export const dynamic = "force-dynamic";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// (optionnel) si besoin de forcer le runtime Node pour bcrypt en prod
// export const runtime = "nodejs";

const noStore = { "Cache-Control": "no-store" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function POST(req) {
  // Sécurité basique (même si Next route POST uniquement)
  if (req.method && req.method !== "POST") {
    return NextResponse.json(
      { error: "Méthode non autorisée" },
      { status: 405, headers: noStore }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "JSON invalide" },
      { status: 400, headers: noStore }
    );
  }

  const email = String(body?.email || "")
    .toLowerCase()
    .trim();
  const password = String(body?.password || "");

  if (!email || !password) {
    return NextResponse.json(
      { error: "Champs requis." },
      { status: 400, headers: noStore }
    );
  }

  try {
    await connectToDatabase();

    // Lookup + comparaison (sans révéler si l'email existe)
    const user = await User.findOne({ email }).lean();
    const ok = user && (await bcrypt.compare(password, user.password));
    if (!ok) {
      await sleep(300); // lissage timing
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect." },
        { status: 401, headers: noStore }
      );
    }

    // JWT minimal
    const token = await new SignJWT({ id: String(user._id), email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(SECRET);

    // Réponse + cookie httpOnly (unique source de vérité)
    const res = NextResponse.json(
      { success: true },
      { status: 200, headers: noStore }
    );
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24h
    });
    return res;
  } catch (err) {
    console.error("❌ Erreur login :", err);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500, headers: noStore }
    );
  }
}
