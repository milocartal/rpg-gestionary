import "server-only"; // empêche toute importation côté client (build-time) :contentReference[oaicite:1]{index=1}
import nodemailer from "nodemailer";
import type { SendMailOptions } from "nodemailer"; // bon type TS (pas celui de sendmail-transport)
import { env } from "~/env";
import type { Attachment } from "nodemailer/lib/mailer";

export interface EmailDetails {
  subject: string;
  to: string | string[];
  html: string;
  text: string;
  attachments?: Attachment[];
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // 587 = submission + STARTTLS (OK chez Hetzner)
  secure: false, // false avec 587 (on upgrade en TLS via STARTTLS)
  requireTLS: true,
  auth: { user: env.GOOGLE_APP_USER, pass: env.GOOGLE_APP_PASSWORD },
  // Active les logs détaillés en dev
  logger: process.env.NODE_ENV !== "production",
  debug: process.env.NODE_ENV !== "production", // affiche le handshake SMTP
});

export async function sendMail(email: EmailDetails) {
  const to = Array.isArray(email.to) ? email.to : [email.to];
  if (to.length === 0 || to.every((v) => !v || v.trim() === "")) return;

  const opts: SendMailOptions = {
    from: `RPG Gestionary <${env.GOOGLE_APP_USER}>`,
    to,
    subject: email.subject,
    html: email.html,
    text: email.text,
    attachments: email.attachments,
  };

  // Ne passe PAS de callback -> sendMail renvoie une Promise
  const info = await transporter.sendMail(opts);
  if (process.env.NODE_ENV !== "production") {
    console.log("Mail sent:", info.messageId, info.response);
  }
  return info;
}

export async function sendMultipleMails(emails: EmailDetails[]) {
  await Promise.all(emails.map(sendMail));
  return true;
}
