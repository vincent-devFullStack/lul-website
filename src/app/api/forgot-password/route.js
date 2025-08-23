// app/api/forgot-password/route.js
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const ADMIN_PIN = process.env.ADMIN_PIN;
const HIDE_USER_EXISTENCE = true;

// --- rate-limit simple (best-effort, non distribué)
const WINDOW_MS = 60_000;
const MAX_REQ = 10;
const hits = new Map();
function allow(key) {
  const now = Date.now();
  const entry = hits.get(key) || { count: 0, ts: now };
  if (now - entry.ts > WINDOW_MS) {
    entry.count = 0;
    entry.ts = now;
  }
  entry.count += 1;
  hits.set(key, entry);
  return entry.count <= MAX_REQ;
}

function getEnvOrThrow(name, fallback = undefined) {
  const v = process.env[name] ?? fallback;
  if (v === undefined || v === null || v === "") {
    throw new Error(`ENV manquante: ${name}`);
  }
  return v;
}

export async function POST(req) {
  // rate-limit par IP
  const h = headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  if (!allow(ip)) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessayez dans une minute." },
      { status: 429 }
    );
  }

  // parse
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Corps JSON invalide." },
      { status: 400 }
    );
  }

  const email = String(body?.email || "")
    .trim()
    .toLowerCase();
  const pin = String(body?.pin || "").trim();
  if (!email || !pin) {
    return NextResponse.json({ error: "Champs requis." }, { status: 400 });
  }

  // vérif PIN (légère temporisation anti-bruteforce)
  if (pin !== ADMIN_PIN) {
    await new Promise((r) => setTimeout(r, 350));
    return NextResponse.json({ error: "Code PIN invalide." }, { status: 403 });
  }

  await connectToDatabase();

  // ne pas révéler si l'email existe (option recommandée)
  const user = await User.findOne({ email });
  if (!user) {
    if (HIDE_USER_EXISTENCE) {
      return NextResponse.json(
        {
          success: true,
          message: "Un email de réinitialisation a été envoyé à votre adresse.",
        },
        { headers: { "Cache-Control": "no-store" } }
      );
    }
    return NextResponse.json(
      { error: "Aucun utilisateur trouvé avec cet email." },
      { status: 404 }
    );
  }

  // génère un token court-vivant
  const token = uuidv4();
  user.resetToken = token;

  // ⬇️ Si ton schéma utilise Date (recommandé)
  user.resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  // ⬆️ Si tu es resté en Number, garde: Date.now() + 15 * 60 * 1000

  await user.save();

  // construit l’URL de reset (dev/preview/prod)
  const { origin } = new URL(req.url);
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || origin;
  const resetUrl = `${baseUrl}/reset-password/${token}`;

  // config SMTP (dédiée si dispo, sinon générique)
  let transporter;
  try {
    const host = getEnvOrThrow("SMTP_HOST");
    const port = parseInt(process.env.SMTP_PORT ?? "465", 10);
    const secure = /^(true|1)$/i.test(
      String(process.env.SMTP_SECURE ?? "true")
    );

    const smtpUser = process.env.RESET_SMTP_USER ?? process.env.SMTP_USER; // dédié si présent
    const smtpPass = process.env.RESET_SMTP_PASS ?? process.env.SMTP_PASS; // dédié si présent
    if (!smtpUser || !smtpPass) {
      throw new Error(
        "RESET_SMTP_USER/RESET_SMTP_PASS ou SMTP_USER/SMTP_PASS manquants"
      );
    }

    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user: smtpUser, pass: smtpPass },
    });
  } catch (e) {
    console.error("SMTP config error:", e);
    return NextResponse.json(
      { error: "Configuration SMTP invalide côté serveur." },
      { status: 500 }
    );
  }

  const fromHeader =
    process.env.RESET_FROM ||
    `"L'iconodule - Sécurité" <${process.env.RESET_SMTP_USER ?? process.env.SMTP_USER}>`;

  try {
    await transporter.sendMail({
      from: fromHeader,
      to: email,
      subject: "Réinitialisation de votre mot de passe - L'iconodule",
      text: `
Bonjour,

Vous avez demandé la réinitialisation de votre mot de passe pour votre compte L'iconodule.

Cliquez sur le lien suivant pour réinitialiser votre mot de passe :
${resetUrl}

Ce lien est valable pendant 15 minutes uniquement.

Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.

Cordialement,
L'équipe L'iconodule
      `.trim(),
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2a231a; font-size: 24px;">L'iconodule</h1>
    <p style="color: #666; font-size: 16px;">Musée de lul</p>
  </div>

  <div style="background: #f9f9f9; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="color: #2a231a; margin-bottom: 20px;">Réinitialisation de mot de passe</h2>

    <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
      Bonjour,
    </p>

    <p style="color: #333; line-height: 1.6; margin-bottom: 25px;">
      Vous avez demandé la réinitialisation de votre mot de passe pour votre compte L'iconodule.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}"
         style="background-color: #bfa76a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
        Réinitialiser mon mot de passe
      </a>
    </div>

    <p style="color: #666; font-size: 14px; line-height: 1.6;">
      <strong>Important :</strong> Ce lien est valable pendant 15 minutes uniquement.
    </p>

    <p style="color: #666; font-size: 14px; line-height: 1.6;">
      Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
      <span style="word-break: break-all; color: #bfa76a;">${resetUrl}</span>
    </p>
  </div>

  <div style="text-align: center; color: #999; font-size: 12px;">
    <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
    <p>© L'iconodule - Musée de lul</p>
  </div>
</div>
      `.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Un email de réinitialisation a été envoyé à votre adresse.",
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("Erreur envoi email reset :", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
