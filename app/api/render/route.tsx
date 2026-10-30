import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { loadGoogleFont } from "@/lib/og-font";
import { GbpTemplate } from "@/lib/templates/gbp";
import { MetaTemplate } from "@/lib/templates/meta";
import type { PromoInput } from "@/lib/types";

export async function POST(request: Request) {
  const data = (await request.json()) as PromoInput;

  if (!data.imageDataUrl) {
    return new Response("Falta la imagen de fondo", { status: 400 });
  }

  const logoSvg = readFileSync(join(process.cwd(), "public", "logo.svg"), "utf-8");
  const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`;

  const [poppinsBlack, poppinsBold, interBold, interSemibold] = await Promise.all([
    loadGoogleFont("Poppins", 900),
    loadGoogleFont("Poppins", 700),
    loadGoogleFont("Inter", 700),
    loadGoogleFont("Inter", 600),
  ]);

  const element =
    data.variant === "gbp" ? (
      <GbpTemplate data={data} logoDataUri={logoDataUri} />
    ) : (
      <MetaTemplate data={data} logoDataUri={logoDataUri} />
    );

  return new ImageResponse(element, {
    width: 1080,
    height: 1080,
    fonts: [
      { name: "Poppins", data: poppinsBlack, weight: 900, style: "normal" },
      { name: "Poppins", data: poppinsBold, weight: 700, style: "normal" },
      { name: "Inter", data: interBold, weight: 700, style: "normal" },
      { name: "Inter", data: interSemibold, weight: 600, style: "normal" },
    ],
  });
}
