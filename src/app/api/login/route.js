// app/api/login/route.js
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";

export const runtime = "nodejs"; // sûr pour bcrypt/jose
export const revalidate = 0;
export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET manquant dans l'environnement");
}
const SECRET = new TextEncoder().encode(JWT_SECRET);

const noStore = { "Cache-Control": "no-store" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function POST(req) {
  // Parse du corps
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
    .trim()
    .toLowerCase();
  const password = String(body?.password || "");

  if (!email || !password) {
    return NextResponse.json(
      { error: "Champs requis." },
      { status: 400, headers: noStore }
    );
  }

  try {
    await connectToDatabase();

    // Si dans ton schéma User le champ password est select:false,
    // dé-commente la ligne suivante :
    // const user = await User.findOne({ email }).select("+password").lean();
    const user = await User.findOne({ email }).lean();

    const ok = user && (await bcrypt.compare(password, user.password));
    if (!ok) {
      // Lissage timing pour ne pas révéler si l'email existe
      await sleep(300);
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect." },
        { status: 401, headers: noStore }
      );
    }

    // JWT 24h
    const token = await new SignJWT({ id: String(user._id), email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(SECRET);

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
      // priority: "high", // optionnel
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
