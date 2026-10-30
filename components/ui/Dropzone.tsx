"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

/** Drag-and-drop image picker with inline preview, matching the upload UX of modern SaaS dashboards. */
export function Dropzone({
  previewUrl,
  onFile,
  onClear,
}: {
  previewUrl: string;
  onFile: (file: File) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file && file.type.startsWith("image/")) onFile(file);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={`relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors cursor-pointer ${
        dragging ? "border-[#4aa8e8] bg-[#eaf4fd]" : "border-[#c7d3ea] bg-white hover:bg-[#f4f6fb]"
      }`}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {previewUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="" className="h-28 w-28 rounded-md object-cover" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#0d0f2b]/80 text-white hover:bg-[#0d0f2b]"
            aria-label="Quitar imagen"
          >
            <X size={14} />
          </button>
          <span className="text-xs font-medium text-[#4aa8e8]">Cambiar imagen</span>
        </>
      ) : (
        <>
          <ImagePlus size={28} className="text-[#4aa8e8]" />
          <span className="text-sm font-semibold text-[#0d0f2b]">Arrastra una imagen o haz clic</span>
          <span className="text-xs text-[#9399b3]">JPG o PNG, idealmente cuadrada</span>
        </>
      )}
    </div>
  );
}
