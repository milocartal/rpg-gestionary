import { Client } from "minio";

import NodeCache from "node-cache";
import { env } from "~/env";

export const minioClient = new Client({
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
  endPoint: env.MINIO_ENDPOINT,
  pathStyle: true,
  useSSL: true,
});

const presignedCache = new NodeCache({
  stdTTL: 60 * 60 * 23,
  checkperiod: 300,
}); // 23h

//const MINIO_HOST = "minio.milocartal.com"; // adapte avec ce qui faut
//const DEFAULT_BUCKET = "rpg";              // idem
const EXPIRES_SECONDS = 60 * 60 * 24; // 24h (≤ 7 jours en SigV4)

//fabrique/retourne une URL signée et met en cache
export async function signAndCache(bucket: string, key: string) {
  const cacheKey = `${bucket}:${key}`;
  const cached = presignedCache.get<string>(cacheKey);
  if (cached) return cached;

  const url = await minioClient.presignedGetObject(
    bucket,
    key,
    EXPIRES_SECONDS,
  );
  // mets un TTL un peu plus court que l'expiration réelle
  presignedCache.set(cacheKey, url, EXPIRES_SECONDS - 120);
  return url;
}

export async function getPresignedUrl(
  imageURI: string | null,
): Promise<string> {
  if (!imageURI) return "";

  // Si c'est déjà une URL
  if (imageURI.startsWith("http")) {
    const u = new URL(imageURI);

    // si elle est déjà signée, on la garde
    if (u.searchParams.has("X-Amz-Signature")) return imageURI;

    // si c'est une URL brute pointant vers TON MinIO -> on extrait bucket+key puis on signe
    if (u.hostname === env.MINIO_ENDPOINT) {
      const [, bucket, ...rest] = u.pathname.split("/"); // /bucket/key...
      const key = decodeURIComponent(rest.join("/"));
      return signAndCache(bucket!, key);
    }

    //sinon (hébergeur externe), on renvoie tel quel ( pas obligatoire mais cool de l'avoir au besoin si tu évolue plus tard)
    return imageURI;
  }

  // sinon, c’est une "key" interne -> on signe avec le bucket par défaut
  const key = imageURI.replace(/^\/+/, ""); // nettoie les /
  return signAndCache(env.MINIO_BUCKET, key);
}
