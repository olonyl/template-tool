"use client";

import { Download, X } from "lucide-react";

export function ImageLightbox({
  src,
  downloadName,
  onClose,
}: {
  src: string;
  downloadName: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
      onClick={onClose}
    >
      <div className="flex max-h-full max-w-2xl flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="Vista previa completa" className="max-h-[80vh] rounded-xl border border-white/20" />
        <div className="flex gap-3">
          <a
            href={src}
            download={downloadName}
            className="flex items-center gap-2 rounded-full bg-gradient-to-br from-[#bfe3ff] via-[#4aa8e8] to-[#15649f] px-5 py-2 text-sm font-bold text-[#0d0f2b]"
          >
            <Download size={16} /> Descargar PNG
          </a>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-bold text-white hover:bg-white/20"
          >
            <X size={16} /> Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
