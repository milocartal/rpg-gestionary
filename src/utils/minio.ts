import { Client } from "minio";

import { env } from "~/env";

export const minioClient = new Client({
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
  endPoint: env.MINIO_ENDPOINT,
  pathStyle: true,
  useSSL: true,
});
