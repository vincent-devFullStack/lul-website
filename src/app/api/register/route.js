// import bcrypt from "bcryptjs";
// import { SignJWT } from "jose";
// import { NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/mongodb";
// import User from "@/lib/models/User";

// export const revalidate = 0;
// export const dynamic = "force-dynamic";

// const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
// const noStore = { "Cache-Control": "no-store" };

// export async function POST(req) {
//   let body;
//   try {
//     body = await req.json();
//   } catch {
//     return NextResponse.json(
//       { error: "JSON invalide" },
//       { status: 400, headers: noStore }
//     );
//   }

//   const email = String(body?.email || "")
//     .toLowerCase()
//     .trim();
//   const password = String(body?.password || "");
//   const confirmPassword = String(body?.confirmPassword || "");
//   const pin = String(body?.pin || "");

//   if (!email || !password || !confirmPassword || !pin) {
//     return NextResponse.json(
//       { error: "Champs manquants." },
//       { status: 400, headers: noStore }
//     );
//   }

//   if (password !== confirmPassword) {
//     return NextResponse.json(
//       { error: "Les mots de passe ne correspondent pas." },
//       { status: 400, headers: noStore }
//     );
//   }

//   if (password.length < 6) {
//     return NextResponse.json(
//       { error: "Le mot de passe doit contenir au moins 6 caractères." },
//       { status: 400, headers: noStore }
//     );
//   }

//   if (pin !== process.env.ADMIN_PIN) {
//     return NextResponse.json(
//       { error: "Code PIN incorrect." },
//       { status: 401, headers: noStore }
//     );
//   }

//   try {
//     await connectToDatabase();

//     const existing = await User.findOne({ email }).lean();
//     if (existing) {
//       return NextResponse.json(
//         { error: "Cet email est déjà utilisé." },
//         { status: 409, headers: noStore }
//       );
//     }

//     const hashed = await bcrypt.hash(password, 12);
//     const created = await User.create({ email, password: hashed });

//     // ⚙️ JWT aligné sur /api/login (id + email, 24h)
//     const token = await new SignJWT({
//       id: String(created._id),
//       email: created.email,
//     })
//       .setProtectedHeader({ alg: "HS256" })
//       .setIssuedAt()
//       .setExpirationTime("24h")
//       .sign(SECRET);

//     const res = NextResponse.json(
//       { success: true },
//       { status: 201, headers: noStore }
//     );

//     // 🍪 Cookie aligné sur /api/login (httpOnly, sameSite=lax, 24h)
//     res.cookies.set("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//       maxAge: 60 * 60 * 24, // 24h
//     });

//     return res;
//   } catch (err) {
//     console.error("Erreur à l'inscription :", err);
//     return NextResponse.json(
//       { error: "Erreur serveur. Veuillez réessayer plus tard." },
//       { status: 500, headers: noStore }
//     );
//   }
// }
