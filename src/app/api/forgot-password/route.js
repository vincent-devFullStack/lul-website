// app/api/forgot-password/route.js
import { NextResponse } from "next/server";
import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

const ADMIN_PIN = process.env.ADMIN_PIN;

export async function POST(req) {
  const { email, pin } = await req.json();

  if (!email || !pin) {
    return NextResponse.json({ error: "Champs requis." }, { status: 400 });
  }

  if (pin !== ADMIN_PIN) {
    return NextResponse.json({ error: "Code PIN invalide." }, { status: 403 });
  }

  try {
    await connectToDatabase();

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json(
        { error: "Aucun utilisateur trouvé avec cet email." },
        { status: 404 }
      );
    }

    // Générer un token unique
    const token = uuidv4();
    const expiration = Date.now() + 1000 * 60 * 15; // 15 minutes

    // Sauvegarder le token dans la base de données
    user.resetToken = token;
    user.resetTokenExpires = expiration;
    await user.save();

    const transporter = nodemailer.createTransport({
      host: "mail.lit.o2switch.net",
      port: 465,
      secure: true,
      auth: {
        user: "contact@iconodule.fr",
        pass: process.env.EMAIL_PASSWORD_RESET,
      },
    });

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://www.iconodule.fr"
        : "http://localhost:3000";

    const resetUrl = `${baseUrl}/reset-password/${token}`;

    // ✅ Options du message
    const mailOptions = {
      from: `"L'iconodule - Sécurité" <contact@iconodule.fr>`,
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
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2a231a; font-size: 24px;">L'iconodule</h1>
            <p style="color: #666; font-size: 16px;">Musée d'art virtuel</p>
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
            <p>© L'iconodule - Musée d'art virtuel</p>
          </div>
        </div>
      `,
    };

    // ✅ Envoi de l'email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "Un email de réinitialisation a été envoyé à votre adresse.",
    });
  } catch (err) {
    console.error("Erreur envoi email reset :", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
