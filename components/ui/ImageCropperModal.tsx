"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Check, X } from "lucide-react";

/** Draws the cropped region onto an offscreen canvas and exports it at a fixed, safe output size. */
async function getCroppedDataUrl(imageSrc: string, cropPixels: Area, outputSize = 1080): Promise<string> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;
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
    outputSize,
    outputSize
  );

  // Re-encode as JPEG: keeps the payload small and in a format satori always decodes reliably.
  return canvas.toDataURL("image/jpeg", 0.9);
}

export function ImageCropperModal({
  imageSrc,
  onCancel,
  onConfirm,
}: {
  imageSrc: string;
  onCancel: () => void;
  onConfirm: (dataUrl: string) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [working, setWorking] = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => setCroppedArea(pixels), []);

  async function handleConfirm() {
    if (!croppedArea) return;
    setWorking(true);
    try {
      onConfirm(await getCroppedDataUrl(imageSrc, croppedArea));
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="flex w-full max-w-lg flex-col gap-4 rounded-2xl bg-white p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0d0f2b]">Recorta tu imagen (1:1)</h3>
          <button type="button" onClick={onCancel} className="text-[#9399b3] hover:text-[#0d0f2b]">
            <X size={18} />
          </button>
        </div>

        <div className="relative h-80 w-full overflow-hidden rounded-lg bg-[#0d0f2b]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
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
          />
        </label>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-4 py-2 text-sm font-semibold text-[#0d0f2b] hover:bg-[#f4f6fb]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={working}
            className="flex items-center gap-2 rounded-full bg-gradient-to-br from-[#bfe3ff] via-[#4aa8e8] to-[#15649f] px-5 py-2 text-sm font-bold text-[#0d0f2b] disabled:opacity-50"
          >
            <Check size={16} /> Usar recorte
          </button>
        </div>
      </div>
    </div>
  );
}
