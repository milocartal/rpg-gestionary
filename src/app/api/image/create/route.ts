import cuid from "cuid";
import sharp from "sharp";

import { env } from "~/env";
import { minioClient } from "~/utils/minio";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as Blob;
    const type = formData.get("type") as string;
    const name = cuid() + ".webp";

    if (!image) {
      throw new Error("Image not found");
    }

    const imageBuffer = Buffer.from(await image.arrayBuffer());

    const optimizedImageBuffer = await sharp(imageBuffer)
      .resize({ width: 800 })
      .webp()
      .toBuffer();

    // Create thumbnail image
    const thumbnailImageBuffer = await sharp(imageBuffer)
      .resize({ width: 150 })
      .webp()
      .toBuffer();

    await minioClient.putObject(
      env.MINIO_BUCKET,
      `images/${type}/${name}`,
      optimizedImageBuffer,
    );

    await minioClient.putObject(
      env.MINIO_BUCKET,
      `images/${type}/thumbnail-${name}`,
      thumbnailImageBuffer,
    );
    return Response.json({
      url: `images/${type}/${name}`,
    });
  } catch (error) {
    console.error((error as Error).message);
    throw new Error("Error uploading image : ", error as Error);
  }
}
