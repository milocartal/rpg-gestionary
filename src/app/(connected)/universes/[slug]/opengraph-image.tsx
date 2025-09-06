import { ImageResponse } from "next/og";
import { db } from "~/server/db";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: { slug: string } };

export default async function OG({ params }: Props) {
  const c = await db.universe.findFirst({
    where: { id: params.slug },
    select: { name: true, banner: true },
  });

  const title = c?.name ?? "Univers inconnu";
  const portrait = "/favicon.svg";

  // Simple visuel propre. Tu peux raffiner la typo et la mise en page.
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "48px",
          background: "linear-gradient(135deg,#020617 0%,#0ea5e9 100%)",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            maxWidth: 760,
          }}
        >
          <div style={{ fontSize: 60, fontWeight: 800 }}>{title}</div>
        </div>
        <div
          style={{
            width: 360,
            height: 360,
            background: "rgba(255,255,255,0.08)",
            borderRadius: 24,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {portrait ? (
            // next/og n’accepte pas <Image/>, on utilise <img>
            <img
              src={portrait}
              alt={title}
              width={360}
              height={360}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div style={{ fontSize: 28, opacity: 0.8 }}>Aucune image</div>
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
