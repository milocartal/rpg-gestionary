import { env } from "~/env";
import { getThumbnailUrl, getUnsignedUrl } from "~/lib/minio";
import { minioClient } from "~/utils/minio";

export async function POST(req: Request) {
  const image = (await req.formData()).get("imageUrl") as string;

  const final = getUnsignedUrl(image)!;

  await minioClient.removeObject(env.MINIO_BUCKET, final);

  const thumbnailImage = getThumbnailUrl(image);
  const finalThumbnail = getUnsignedUrl(thumbnailImage)!;
  await minioClient.removeObject(env.MINIO_BUCKET, finalThumbnail);

  return new Response(null, { status: 200 });
}
