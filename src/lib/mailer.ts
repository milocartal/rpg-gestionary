import nodemailer from "nodemailer";
import type { Attachment } from "nodemailer/lib/mailer";
import type { MailOptions } from "nodemailer/lib/sendmail-transport";
import { env } from "~/env";

export interface EmailDetails {
  subject: string;
  to: string | string[];
  html: string;
  text: string;
  attachments?: Attachment[];
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.GOOGLE_APP_USER,
    pass: env.GOOGLE_APP_PASSWORD,
  },
});

export const sendMail = async (emailDetails: EmailDetails) => {
  const opts: MailOptions = {
    from: `SAGA <${env.GOOGLE_APP_USER}>`,
    to: emailDetails.to,
    subject: emailDetails.subject,
    html: emailDetails.html,
    text: emailDetails.text,
    attachments: emailDetails.attachments,
  };

  if (emailDetails.to.length === 0) {
    return;
  }

  return new Promise<void>((resolve, reject) => {
    transporter.sendMail(opts, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Fonction pour envoyer plusieurs emails en parallèle avec des contenus différents
export const sendMultipleMails = async (emails: EmailDetails[]) => {
  try {
    // Créer une promesse pour chaque email à envoyer
    const emailPromises = emails.map((email) => sendMail(email));

    // Attendre que tous les emails soient envoyés en parallèle
    await Promise.all(emailPromises);
    return true;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};
