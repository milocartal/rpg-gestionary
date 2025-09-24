// src/server/auth/password-token.ts
import { randomBytes, createHash } from "crypto";
import { addMinutes, isBefore } from "date-fns";
import { db } from "~/server/db";
import { env } from "~/env";

export const TOKEN_TTL_MIN = { RESET: 30, INVITE: 60 * 24 }; // 24h invite

export function createRawToken(bytes = 32) {
  return randomBytes(bytes).toString("hex");
}
export function sha256(s: string) {
  return createHash("sha256").update(s).digest("hex");
}

export async function issueToken(userId: string, purpose: "RESET" | "INVITE") {
  // Invalide les anciens du même type
  await db.passwordToken.deleteMany({ where: { userId, purpose } });

  const raw = createRawToken();
  const tokenHash = sha256(raw);
  const expires = addMinutes(new Date(), TOKEN_TTL_MIN[purpose]);

  await db.passwordToken.create({
    data: { tokenHash, purpose, expires, userId },
  });

  const base = env.NEXT_PUBLIC_URL;
  const path = purpose === "INVITE" ? "set-password" : "reset-password";
  const url = `${base}/${path}/${raw}`;
  return { raw, url };
}

export async function verifyToken(
  raw: string,
  purpose: "RESET" | "INVITE",
): Promise<boolean> {
  const rec = await db.passwordToken.findUnique({
    where: { tokenHash: sha256(raw) },
  });
  if (!rec || rec.purpose !== purpose) return false;
  if (rec.usedAt) return false;
  if (isBefore(rec.expires, new Date())) {
    await db.passwordToken.delete({ where: { tokenHash: rec.tokenHash } });
    return false;
  }
  return true;
}

export async function verifyAndGetToken(
  raw: string,
  purpose: "RESET" | "INVITE",
) {
  const rec = await db.passwordToken.findUnique({
    where: { tokenHash: sha256(raw) },
  });
  if (!rec || rec.purpose !== purpose) return null;
  if (rec.usedAt) return null;
  if (isBefore(rec.expires, new Date())) {
    await db.passwordToken.delete({ where: { tokenHash: rec.tokenHash } });
    return null;
  }
  return rec;
}

export async function consumeTokenAndSetPassword(
  raw: string,
  purpose: "RESET" | "INVITE",
  newPasswordHash: string,
) {
  const rec = await verifyAndGetToken(raw, purpose);
  if (!rec) return null;

  await db.$transaction([
    db.user.update({
      where: { id: rec.userId },
      data: { password: newPasswordHash, emailVerified: new Date() },
    }),
    db.passwordToken.update({
      where: { tokenHash: rec.tokenHash },
      data: { usedAt: new Date() },
    }),
    db.passwordToken.deleteMany({ where: { userId: rec.userId } }), // ménage
  ]);
  return { ok: true, userId: rec.userId };
}
