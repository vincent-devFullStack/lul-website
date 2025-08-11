// src/app/api/contact/route.js
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// --- Anti-spam basique (rate-limit par IP, best-effort, non distribué)
const WINDOW_MS = 60_000; // 1 min
const MAX_REQ = 5;
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

// --- Utils
const isEmail = (s = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const esc = (s = "") =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c]
  );

function getEnvOrThrow(name, fallback = undefined) {
  const v = process.env[name] ?? fallback;
  if (v === undefined || v === null || v === "") {
    throw new Error(`ENV manquante: ${name}`);
  }
  return v;
}

export async function POST(request) {
  // Rate-limit
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

  // Parse JSON
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 });
  }

  const {
    name = "",
    prenom = "",
    societe = "",
    email = "",
    message = "",
    website = "", // honeypot optionnel
  } = payload || {};

  // Honeypot: si rempli, on fait semblant d'accepter
  if (website) return NextResponse.json({ ok: true });

  // Validation
  if (!name.trim() || !email.trim() || !message.trim()) {
    return NextResponse.json(
      { error: "Nom, email et message sont obligatoires" },
      { status: 400 }
    );
  }
  if (!isEmail(email)) {
    return NextResponse.json(
      { error: "Adresse email invalide" },
      { status: 400 }
    );
  }
  if (message.length > 4000) {
    return NextResponse.json(
      { error: "Message trop long (4000 caractères max)." },
      { status: 400 }
    );
  }

  // Sanitize (pour la version HTML)
  const safe = {
    name: esc(name.trim()),
    prenom: esc(prenom.trim()),
    societe: esc(societe.trim()),
    email: email.trim(), // déjà validé
    message: esc(message.trim()),
  };

  // SMTP config via ENV
  let transporter;
  try {
    const host = getEnvOrThrow("SMTP_HOST");
    const port = parseInt(process.env.SMTP_PORT ?? "465", 10);
    const secure =
      String(process.env.SMTP_SECURE ?? "true").toLowerCase() === "true";
    const user = getEnvOrThrow("SMTP_USER");
    const pass = getEnvOrThrow("SMTP_PASS");

    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  } catch (envErr) {
    console.error(envErr);
    return NextResponse.json(
      { error: "Configuration SMTP invalide côté serveur." },
      { status: 500 }
    );
  }

  const to = process.env.CONTACT_TO ?? "contact@iconodule.fr";
  const fromUser = process.env.SMTP_USER ?? "visiteur@iconodule.fr";
  const subject = `Nouveau message — ${safe.prenom ? safe.prenom + " " : ""}${safe.name}`;

  try {
    await transporter.sendMail({
      from: `"Formulaire L'iconodule" <${fromUser}>`,
      to,
      replyTo: `${safe.name} <${safe.email}>`,
      subject,
      text: `Nom: ${name}
Prénom: ${prenom || "-"}
Société: ${societe || "-"}
Email: ${email}

${message}`,
      html: `
        <h2>Nouveau message depuis le formulaire</h2>
        <p><strong>Nom:</strong> ${safe.name}</p>
        <p><strong>Prénom:</strong> ${safe.prenom || "—"}</p>
        <p><strong>Société:</strong> ${safe.societe || "—"}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        <p><strong>Message:</strong></p>
        <div style="background:#f5f5f5;padding:12px;border-radius:6px;white-space:pre-wrap">${safe.message}</div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erreur d'envoi d'email:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    );
  }
}
