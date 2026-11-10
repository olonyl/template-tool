"use client";

import { useEffect, useRef, useState } from "react";
import { Download, ImagePlus, RefreshCw, X } from "lucide-react";
import { DEFAULT_COVER, type FacebookCoverInput } from "@/lib/facebook-cover";

const FIELDS = [
  { key: "name", label: "Nombre", max: 18 },
  { key: "accentName", label: "Nombre destacado", max: 24 },
  { key: "location", label: "Ubicación", max: 45 },
  { key: "headline", label: "Titular, primera línea", max: 24 },
  { key: "accentHeadline", label: "Titular, segunda línea", max: 26 },
  { key: "promise", label: "Frase de confianza", max: 55 },
] as const;

export function FacebookCoverForm() {
  const [data, setData] = useState<FacebookCoverInput>({ ...DEFAULT_COVER });
  const [preview, setPreview] = useState("/api/facebook-cover");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState("");
  const objectUrl = useRef<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => () => {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
  }, []);

  async function selectImage(file?: File) {
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/") || file.size > 15_000_000) {
      setError("Seleccioná una imagen de hasta 15 MB.");
      return;
    }
    setImageLoading(true);
    const url = URL.createObjectURL(file);
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      const scale = Math.min(1, 2000 / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("No se pudo procesar la imagen.");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      setData((current) => ({ ...current, imageDataUrl: canvas.toDataURL("image/jpeg", 0.9) }));
    } catch {
      setError("No se pudo abrir la imagen.");
    } finally {
      URL.revokeObjectURL(url);
      setImageLoading(false);
    }
  }

  async function generate(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/facebook-cover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(await response.text());
      const url = URL.createObjectURL(await response.blob());
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
      objectUrl.current = url;
      setPreview(url);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo generar la portada.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid w-full gap-8 p-4 sm:p-8 lg:grid-cols-[320px_minmax(0,1fr)]">
      <form onSubmit={generate} className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-[#0d0f2b]">Portada Facebook</h2>
        {FIELDS.map(({ key, label, max }) => (
          <label key={key} className="flex flex-col gap-1 text-sm font-medium text-[#0d0f2b]">
            {label}
            <input value={data[key]} maxLength={max} onChange={(event) => setData({ ...data, [key]: event.target.value })}
              className="w-full rounded-md border border-[#c7d3ea] bg-white px-3 py-2 focus:outline-2 focus:outline-[#15649f]" />
          </label>
        ))}
        <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={(event) => {
          void selectImage(event.target.files?.[0]);
          event.target.value = "";
        }} />
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={imageLoading || loading} onClick={() => fileInput.current?.click()}
            className="flex items-center gap-2 rounded-md border border-[#c7d3ea] px-3 py-2 text-sm disabled:opacity-50">
            <ImagePlus size={16} />{imageLoading ? "Procesando…" : "Cambiar foto"}
          </button>
          {data.imageDataUrl && <button type="button" onClick={() => setData({ ...data, imageDataUrl: "" })}
            className="flex items-center gap-2 rounded-md border border-[#c7d3ea] px-3 py-2 text-sm">
            <X size={16} />Foto original
          </button>}
        </div>
        {data.imageDataUrl && <div className="aspect-video overflow-hidden rounded-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.imageDataUrl} alt="Foto seleccionada" className="h-full w-full object-cover" />
        </div>}
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={loading || imageLoading} className="flex items-center justify-center gap-2 rounded-md bg-[#15649f] px-4 py-3 font-semibold text-white disabled:opacity-50">
          <RefreshCw size={17} className={loading ? "animate-spin" : ""} />{loading ? "Generando…" : "Generar portada"}
        </button>
      </form>
      <section className="min-w-0" aria-label="Vista previa de portada">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-[#475569]">1640 × 624 · PNG</h2>
          <a href={preview} download="taller-don-ronald-portada-facebook.png" className="flex items-center gap-2 rounded-md bg-[#0d0f2b] px-4 py-2 text-sm font-semibold text-white">
            <Download size={16} />Descargar PNG
          </a>
        </div>
        <div className="aspect-[1640/624] overflow-hidden rounded-md border border-[#c7d3ea] bg-[#f3f6fb]" aria-busy={loading}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Portada de Taller Don Ronald" className="h-full w-full object-contain" />
        </div>
      </section>
    </div>
  );
}