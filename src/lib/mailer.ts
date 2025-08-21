import nodemailer from "nodemailer";
import type { Attachment } from "nodemailer/lib/mailer";
import type { MailOptions } from "nodemailer/lib/sendmail-transport";
import { env } from "~/env";

/**
 * Représente les détails nécessaires pour envoyer un e-mail.
 *
 * @property subject - Sujet de l'e-mail.
 * @property to - Destinataire(s) de l'e-mail, peut être une chaîne ou un tableau de chaînes.
 * @property html - Contenu HTML de l'e-mail.
 * @property text - Version texte de l'e-mail.
 * @property attachments - (Optionnel) Liste des pièces jointes à inclure dans l'e-mail.
 */
export interface EmailDetails {
  subject: string;
  to: string | string[];
  html: string;
  text: string;
  attachments?: Attachment[];
}

/**
 * Crée un objet `transporter` pour envoyer des emails via le service SMTP de Gmail.
 *
 * Utilise le module `nodemailer` avec les paramètres suivants :
 * - `host`: Adresse du serveur SMTP (ici, "smtp.gmail.com").
 * - `port`: Port sécurisé utilisé pour la connexion (465).
 * - `secure`: Indique que la connexion doit être sécurisée (SSL/TLS).
 * - `auth`: Informations d'authentification, incluant l'utilisateur et le mot de passe de l'application Google.
 *
 * @remarks
 * Assurez-vous que les variables d'environnement `GOOGLE_APP_USER` et `GOOGLE_APP_PASSWORD` sont correctement définies.
 *
 * @see {@link https://nodemailer.com/about/} pour plus d'informations sur Nodemailer.
 */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: env.GOOGLE_APP_USER,
    pass: env.GOOGLE_APP_PASSWORD,
  },
});

/**
 * Envoie un e-mail en utilisant les détails fournis.
 *
 * @param emailDetails - Les informations nécessaires pour envoyer l'e-mail, incluant le destinataire, le sujet, le contenu HTML et texte, ainsi que les éventuelles pièces jointes.
 * @returns Une promesse qui se résout lorsque l'e-mail est envoyé avec succès, ou se rejette en cas d'erreur.
 */
export const sendMail = async (emailDetails: EmailDetails) => {
  const to = Array.isArray(emailDetails.to)
    ? emailDetails.to.join(", ")
    : emailDetails.to;

  console.log(`Sending email to: ${to}`);

  const opts: MailOptions = {
    from: `RPG Gestionary <${env.GOOGLE_APP_USER}>`,
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
        console.error(`Failed to send email to ${to}:`, err);
        reject(err);
      } else {
        console.log(`Email sent to ${to}`);
        resolve();
      }
    });
  });
};

/**
 * Envoie plusieurs emails en parallèle.
 *
 * @param emails - Un tableau contenant les détails de chaque email à envoyer.
 * @returns Une promesse qui se résout à `true` si tous les emails ont été envoyés avec succès.
 * @throws Une erreur si l'envoi d'un ou plusieurs emails échoue.
 */
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
