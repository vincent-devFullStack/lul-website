import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// (Optionnel) Forcer runtime Node si besoin de compat bcrypt en prod
// export const runtime = "nodejs";

export async function POST(req) {
  // 1) Défense basique
  if (req.method !== "POST") {
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

    // 2) Lookup + comparaison
    const user = await User.findOne({ email }).lean(); // lean = perf, pas de méthodes
    // Ne révèle pas si l'email existe (anti user-enumeration)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      await sleep(300); // petit délai constant pour rendre l’attaque timing moins triviale
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect." },
        { status: 401, headers: noStore }
      );
    }

    // 3) JWT
    const token = await new SignJWT({ id: user._id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(SECRET);

    // 4) Réponse + cookie httpOnly
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

// Utilitaires
const noStore = { "Cache-Control": "no-store" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
