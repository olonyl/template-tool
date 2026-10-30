import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { loadGoogleFont } from "@/lib/og-font";
import { GbpTemplate } from "@/lib/templates/gbp";
import { MetaTemplate } from "@/lib/templates/meta";
import { ChikiTechTemplate } from "@/lib/templates/chikitech";
import type { RenderPayload } from "@/lib/types";

function readAsDataUri(filename: string, mime: string) {
  const bytes = readFileSync(join(process.cwd(), "public", filename));
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

export async function POST(request: Request) {
  const data = (await request.json()) as RenderPayload;

  if (!data.imageDataUrl) {
    return new Response("Falta la imagen", { status: 400 });
  }

  const [poppinsBlack, poppinsBold, interBold, interSemibold] = await Promise.all([
    loadGoogleFont("Poppins", 900),
    loadGoogleFont("Poppins", 700),
    loadGoogleFont("Inter", 700),
    loadGoogleFont("Inter", 600),
  ]);

  let element: React.ReactElement;

  if (data.profile === "chikitech") {
    const logoDataUri = readAsDataUri("chikitech-logo.png", "image/png");
    const bgDataUri = readAsDataUri("chikitech-bg.png", "image/png");
    element = <ChikiTechTemplate data={data} logoDataUri={logoDataUri} bgDataUri={bgDataUri} />;
  } else {
    const logoSvg = readFileSync(join(process.cwd(), "public", "logo.svg"), "utf-8");
    const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`;
    element =
      data.variant === "gbp" ? (
        <GbpTemplate data={data} logoDataUri={logoDataUri} />
      ) : (
        <MetaTemplate data={data} logoDataUri={logoDataUri} />
      );
  }

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
