"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Check, Sparkles, Wand2, X } from "lucide-react";

/** Draws the cropped region onto an offscreen canvas and exports it at a fixed, safe output size. */
async function getCroppedDataUrl(
  imageSrc: string,
  cropPixels: Area,
  outputWidth: number,
  outputHeight: number
): Promise<string> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo preparar el recorte");

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    outputWidth,
    outputHeight
  );

  return canvas.toDataURL("image/png");
}

export function ImageCropperModal({
  imageSrc,
  aspect = 1,
  onCancel,
  onConfirm,
}: {
  imageSrc: string;
  /** width / height ratio of the crop area. Defaults to a square (1:1). */
  aspect?: number;
  onCancel: () => void;
  onConfirm: (dataUrl: string) => void;
}) {
  const [currentSrc, setCurrentSrc] = useState(imageSrc);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [working, setWorking] = useState(false);
  const [removingBg, setRemovingBg] = useState(false);
  const [error, setError] = useState("");

  const onCropComplete = useCallback((_: Area, pixels: Area) => setCroppedArea(pixels), []);

  async function handleRemoveBackground() {
    setError("");
    setRemovingBg(true);
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      const blob = await removeBackground(currentSrc);
      setCurrentSrc(URL.createObjectURL(blob));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo quitar el fondo");
    } finally {
      setRemovingBg(false);
    }
  }

  async function handleConfirm() {
    if (!croppedArea) return;
    setWorking(true);
    try {
      const outputWidth = 1080;
      const outputHeight = Math.round(outputWidth / aspect);
      onConfirm(await getCroppedDataUrl(currentSrc, croppedArea, outputWidth, outputHeight));
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="flex w-full max-w-3xl flex-col gap-4 rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#0d0f2b]">Ajusta tu imagen</h3>
          <button type="button" onClick={onCancel} className="cursor-pointer text-[#9399b3] hover:text-[#0d0f2b]">
            <X size={20} />
          </button>
        </div>

        <div className="relative h-[28rem] w-full overflow-hidden rounded-xl bg-[#0d0f2b]">
          <Cropper
            image={currentSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />

          {removingBg && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0d0f2b]/85">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-full bg-[#4aa8e8]/30" />
                <Wand2 size={30} className="relative text-[#4aa8e8]" />
              </div>
              <span className="text-sm font-semibold text-white">Quitando el fondo...</span>
              <div className="h-1 w-48 overflow-hidden rounded-full bg-white/15">
                <div className="h-full w-1/2 animate-[shimmer_1.4s_ease-in-out_infinite] bg-[linear-gradient(90deg,transparent,#4aa8e8,transparent)] bg-[length:250%_100%]" />
              </div>
            </div>
          )}
        </div>

        <label className="flex flex-col gap-1 text-xs font-semibold text-[#0d0f2b]">
          Zoom
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="cursor-pointer"
          />
        </label>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleRemoveBackground}
            disabled={removingBg}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-[#c7d3ea] px-4 py-2 text-sm font-semibold text-[#15649f] hover:bg-[#eaf4fd] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles size={16} />
            Quitar fondo
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full px-4 py-2 text-sm font-semibold text-[#0d0f2b] hover:bg-[#f4f6fb] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={working || removingBg}
              className="flex items-center gap-2 rounded-full bg-gradient-to-br from-[#bfe3ff] via-[#4aa8e8] to-[#15649f] px-5 py-2 text-sm font-bold text-[#0d0f2b] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              <Check size={16} /> Usar recorte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
