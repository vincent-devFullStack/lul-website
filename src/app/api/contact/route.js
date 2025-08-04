import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { name, prenom, societe, email, message } = await request.json();

    // Validation basique
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nom, email et message sont obligatoires" },
        { status: 400 }
      );
    }

    // Configuration du transporteur d'emails
    const transporter = nodemailer.createTransport({
      host: "mail.lit.o2switch.net", // ← C'est celui à utiliser chez O2Switch
      port: 465,
      secure: true,
      auth: {
        user: "visiteur@iconodule.fr",
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Options du message
    const mailOptions = {
      from: `"Formulaire L'iconodule" <noreply@iconodule.fr>`,
      to: "contact@iconodule.fr",
      subject: `Nouveau message de ${prenom} ${name}`,
      text: `
        Nom: ${name}
        Prénom: ${prenom}
        Société: ${societe || "Non renseigné"}
        Email: ${email}
        
        Message:
        ${message}
      `,
      html: `
        <h2>Nouveau message depuis le formulaire de contact</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Prénom:</strong> ${prenom}</p>
        <p><strong>Société:</strong> ${societe || "Non renseigné"}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${message.replace(/\n/g, "<br>")}</div>
      `,
    };

    // Envoi de l'email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur d'envoi d'email:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    );
  }
}
