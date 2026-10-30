"use client";

import { useState } from "react";
import { Download, Maximize2, Sparkles } from "lucide-react";
import type { ChikiTechInput, PriceRow, PromoInput, RenderPayload } from "@/lib/types";
import type { Profile } from "@/lib/profiles";
import { Field } from "@/components/ui/Field";
import { Dropzone } from "@/components/ui/Dropzone";
import { VariantSelector } from "@/components/ui/VariantSelector";
import { PriceRowsEditor } from "@/components/ui/PriceRowsEditor";
import { ImageCropperModal } from "@/components/ui/ImageCropperModal";
import { GeneratingOverlay } from "@/components/ui/GeneratingOverlay";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { SpecListEditor } from "@/components/ui/SpecListEditor";

const DEFAULT_PRICES: PriceRow[] = [
  { label: "Liviano", before: "500", after: "450" },
  { label: "Pesado", before: "650", after: "585" },
];

const DEFAULT_SPECS = ["15.6'' Full HD", "Intel Core i7", "16GB RAM", "512GB SSD"];

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-[#e3e8f2] bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold uppercase tracking-wide text-[#15649f]">{title}</h2>
      {children}
    </section>
  );
}

export function PromoForm({ profile }: { profile: Profile }) {
  // --- Taller state ---
  const [variant, setVariant] = useState<PromoInput["variant"]>("meta");
  const [title, setTitle] = useState("Cambio de aceite");
  const [badge, setBadge] = useState("10% OFF");
  const [validText, setValidText] = useState("Del 1 al 7 de noviembre");
  const [phone, setPhone] = useState("8364-1060");
  const [prices, setPrices] = useState<PriceRow[]>(DEFAULT_PRICES);
  const [imageDataUrl, setImageDataUrl] = useState<string>("");
  const [pendingCropSrc, setPendingCropSrc] = useState<string>("");

  // --- Chiki Tech state ---
  const [ctModel, setCtModel] = useState("Dell Latitude 5590 i7");
  const [ctSpecs, setCtSpecs] = useState<string[]>(DEFAULT_SPECS);
  const [ctGiftBadge, setCtGiftBadge] = useState("Incluye mochila de regalo");
  const [ctPrice, setCtPrice] = useState("$350");
  const [ctPhone, setCtPhone] = useState("8888-0000");
  const [ctImageDataUrl, setCtImageDataUrl] = useState<string>("");

  // --- Shared ---
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [cropTarget, setCropTarget] = useState<"taller" | "chikitech" | null>(null);

  async function handleTallerFile(file: File) {
    setCropTarget("taller");
    setPendingCropSrc(await fileToDataUrl(file));
  }

  async function handleChikiTechFile(file: File) {
    setCropTarget("chikitech");
    setPendingCropSrc(await fileToDataUrl(file));
  }

  async function handleGenerate() {
    setError("");

    let payload: RenderPayload;
    if (profile === "taller") {
      if (!imageDataUrl) {
        setError("Sube una imagen de fondo primero.");
        return;
      }
      payload = {
        profile: "taller",
        variant,
        title,
        badge,
        validText,
        phone,
        prices: prices.map((row) => ({ ...row, before: `C$${row.before}`, after: `C$${row.after}` })),
        imageDataUrl,
      };
    } else {
      if (!ctImageDataUrl) {
        setError("Sube la foto recortada del producto primero.");
        return;
      }
      const ctPayload: ChikiTechInput = {
        profile: "chikitech",
        model: ctModel,
        specs: ctSpecs.filter(Boolean),
        giftBadge: ctGiftBadge,
        price: ctPrice,
        phone: ctPhone,
        imageDataUrl: ctImageDataUrl,
      };
      payload = ctPayload;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      setPreviewUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al generar la imagen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 w-full max-w-6xl mx-auto p-8">
      <div className="flex flex-col gap-6">
        {profile === "taller" ? (
          <>
            <VariantSelector value={variant} onChange={setVariant} />

            <Card title="Imagen">
              <Dropzone previewUrl={imageDataUrl} onFile={handleTallerFile} onClear={() => setImageDataUrl("")} />
              {imageDataUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setCropTarget("taller");
                    setPendingCropSrc(imageDataUrl);
                  }}
                  className="cursor-pointer self-start text-xs font-semibold text-[#15649f] hover:underline"
                >
                  Ajustar recorte
                </button>
              )}
            </Card>

            <Card title="Contenido">
              <Field label="Título">
                <input
                  className="rounded-lg border border-[#c7d3ea] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4aa8e8]"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Field>
              <Field label="Insignia de descuento" hint="Se muestra en la cinta diagonal">
                <input
                  className="rounded-lg border border-[#c7d3ea] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4aa8e8]"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                />
              </Field>
            </Card>

            <Card title="Precios">
              <PriceRowsEditor rows={prices} onChange={setPrices} />
            </Card>

            <Card title="Vigencia y contacto">
              <Field label="Vigencia (texto libre)">
                <input
                  className="rounded-lg border border-[#c7d3ea] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4aa8e8]"
                  value={validText}
                  onChange={(e) => setValidText(e.target.value)}
                />
              </Field>
              <Field label="Teléfono">
                <input
                  className="rounded-lg border border-[#c7d3ea] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4aa8e8]"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Field>
            </Card>
          </>
        ) : (
          <>
            <Card title="Foto del producto">
              <Dropzone
                previewUrl={ctImageDataUrl}
                onFile={handleChikiTechFile}
                onClear={() => setCtImageDataUrl("")}
              />
              {ctImageDataUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setCropTarget("chikitech");
                    setPendingCropSrc(ctImageDataUrl);
                  }}
                  className="cursor-pointer self-start text-xs font-semibold text-[#15649f] hover:underline"
                >
                  Ajustar recorte / quitar fondo
                </button>
              )}
              <span className="text-xs text-[#9399b3]">
                Puedes quitar el fondo directamente desde la pantalla de recorte.
              </span>
            </Card>

            <Card title="Modelo">
              <Field label="Nombre del equipo">
                <input
                  className="rounded-lg border border-[#c7d3ea] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4aa8e8]"
                  value={ctModel}
                  onChange={(e) => setCtModel(e.target.value)}
                />
              </Field>
            </Card>

            <Card title="Especificaciones">
              <SpecListEditor specs={ctSpecs} onChange={setCtSpecs} />
            </Card>

            <Card title="Precio y promoción">
              <Field label="Precio">
                <input
                  className="rounded-lg border border-[#c7d3ea] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4aa8e8]"
                  value={ctPrice}
                  onChange={(e) => setCtPrice(e.target.value)}
                />
              </Field>
              <Field label="Insignia de regalo (opcional)" hint="Déjalo vacío para no mostrarla">
                <input
                  className="rounded-lg border border-[#c7d3ea] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4aa8e8]"
                  value={ctGiftBadge}
                  onChange={(e) => setCtGiftBadge(e.target.value)}
                />
              </Field>
            </Card>

            <Card title="Contacto">
              <Field label="Teléfono">
                <input
                  className="rounded-lg border border-[#c7d3ea] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4aa8e8]"
                  value={ctPhone}
                  onChange={(e) => setCtPhone(e.target.value)}
                />
              </Field>
            </Card>
          </>
        )}

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#bfe3ff] via-[#4aa8e8] to-[#15649f] py-3 font-bold text-[#0d0f2b] shadow-lg shadow-[#4aa8e8]/30 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles size={18} />
          {loading ? "Generando..." : "Generar imagen"}
        </button>
      </div>

      <div className="lg:sticky lg:top-8 flex h-fit flex-col gap-3 items-center rounded-2xl border border-[#e3e8f2] bg-white p-5 shadow-sm">
        <span className="self-start text-sm font-bold uppercase tracking-wide text-[#15649f]">Vista previa</span>
        {loading ? (
          <GeneratingOverlay />
        ) : previewUrl ? (
          <>
            <button type="button" onClick={() => setLightboxOpen(true)} className="group relative w-full cursor-pointer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Vista previa de la promoción" className="w-full rounded-xl border border-[#c7d3ea]" />
              <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                <Maximize2 className="text-white" size={28} />
              </span>
            </button>
            <a
              href={previewUrl}
              download={`promo-${profile}.png`}
              className="flex cursor-pointer items-center gap-2 text-sm font-bold text-[#15649f] hover:underline"
            >
              <Download size={16} /> Descargar PNG
            </a>
          </>
        ) : (
          <div className="flex aspect-square w-full items-center justify-center rounded-xl border border-dashed border-[#c7d3ea] bg-[#f4f6fb] text-center text-sm text-[#9399b3]">
            La vista previa aparece aquí
          </div>
        )}
      </div>

      {pendingCropSrc && (
        <ImageCropperModal
          imageSrc={pendingCropSrc}
          aspect={cropTarget === "chikitech" ? 600 / 520 : 1}
          onCancel={() => {
            setPendingCropSrc("");
            setCropTarget(null);
          }}
          onConfirm={(dataUrl) => {
            if (cropTarget === "chikitech") {
              setCtImageDataUrl(dataUrl);
            } else {
              setImageDataUrl(dataUrl);
            }
            setPendingCropSrc("");
            setCropTarget(null);
          }}
        />
      )}

      {lightboxOpen && previewUrl && (
        <ImageLightbox src={previewUrl} downloadName={`promo-${profile}.png`} onClose={() => setLightboxOpen(false)} />
      )}
    </div>
  );
}

