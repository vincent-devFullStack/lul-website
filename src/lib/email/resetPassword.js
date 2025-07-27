// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function sendResetPasswordEmail(to, token) {
//   const resetUrl = `https://iconodule.vercel.app/reset-password/${token}`;

//   return await resend.emails.send({
//     from: "L'Iconodule <reset@iconodule.fr>",
//     to,
//     subject: "Réinitialisation de votre mot de passe",
//     html: `
//       <p>Bonjour,</p>
//       <p>Voici le lien pour réinitialiser votre mot de passe :</p>
//       <p><a href="${resetUrl}">${resetUrl}</a></p>
//       <p>Ce lien est valable 15 minutes.</p>
//     `,
//   });
// }
// <= A mettre en place avec o2Switch quand le nom de domaine sera acheté (DKIM and SPF
