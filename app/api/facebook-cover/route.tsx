import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DEFAULT_COVER, type FacebookCoverInput } from "@/lib/facebook-cover";

// Facebook's centered avatar overlaps the lower cover at narrow widths.

export async function GET() {
  return renderCover(DEFAULT_COVER);
}

export async function POST(request: Request) {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return new Response("Solicitud no válida", { status: 400 });
  }
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return new Response("Solicitud no válida", { status: 400 });
  }
  const data = { ...DEFAULT_COVER };
  const limits: Record<keyof FacebookCoverInput, number> = {
    name: 18, accentName: 24, location: 45, headline: 24,
    accentHeadline: 26, promise: 55, imageDataUrl: 8_000_000,
  };
  for (const key of Object.keys(DEFAULT_COVER) as (keyof FacebookCoverInput)[]) {
    const value = (input as Record<string, unknown>)[key];
    if (value === undefined) continue;
    if (typeof value !== "string" || value.length > limits[key]) {
      return new Response(`Campo no válido: ${key}`, { status: 400 });
    }
    data[key] = value;
  }
  if (data.imageDataUrl && !/^data:image\/(jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(data.imageDataUrl)) {
    return new Response("La imagen debe ser JPG o PNG", { status: 400 });
  }
  return renderCover(data);
}

async function renderCover(data: FacebookCoverInput) {
  const logoSvg = readFileSync(join(process.cwd(), "public", "logo.svg"), "utf-8");
  const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`;
  const photoBytes = readFileSync(join(process.cwd(), "public", "mecanica-og.jpg"));
  const photoDataUri = `data:image/jpeg;base64,${Buffer.from(photoBytes).toString("base64")}`;
  const geist = await readFile(join(process.cwd(), "node_modules", "next", "dist", "compiled", "@vercel", "og", "Geist-Regular.ttf"));
  const barlow = await readFile(join(process.cwd(), "public", "Barlow-SemiBold.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#f3f6fb",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", position: "absolute", left: 620, top: 0, width: 1020, height: 624 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.imageDataUrl || photoDataUri}
            width={1020}
            height={624}
            alt=""
            style={{ width: 1020, height: 624, objectFit: "cover", objectPosition: "62% 50%" }}
          />
        </div>

        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 620,
            top: 0,
            width: 460,
            height: 624,
            backgroundImage: "linear-gradient(90deg, #f3f6fb 0%, #f3f6fb 45%, rgba(243,246,251,0.78) 66%, rgba(243,246,251,0.2) 84%, rgba(243,246,251,0) 100%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            left: 88,
            top: 88,
            width: 820,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoDataUri} width={82} height={82} alt="" style={{ borderRadius: 8 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <div style={{ display: "flex", fontFamily: "Barlow", fontSize: 40, fontWeight: 600, color: "#0d0f2b", letterSpacing: 0 }}>
                {data.name} <span style={{ color: "#15649f", marginLeft: 9 }}>{data.accentName}</span>
              </div>
              <div style={{ display: "flex", fontSize: 20, color: "#475569", letterSpacing: 0 }}>
                {data.location}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: 48, fontFamily: "Barlow", fontSize: 68, fontWeight: 600, lineHeight: 1.08, color: "#0d0f2b", letterSpacing: 0 }}>
            <span style={{ display: "flex" }}>{data.headline}</span>
            <span style={{ display: "flex", color: "#15649f" }}>{data.accentHeadline}</span>
          </div>

          <div style={{ display: "flex", marginTop: 26, fontSize: 28, lineHeight: 1.3, color: "#0d0f2b", letterSpacing: 0 }}>
            {data.promise}
          </div>
        </div>
      </div>
    ),
    {
      width: 1640,
      height: 624,
      fonts: [
        { name: "Geist", data: geist, style: "normal", weight: 400 },
        { name: "Barlow", data: barlow, style: "normal", weight: 600 },
      ],
    }
  );
}
