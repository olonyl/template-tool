"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const TIPS = [
  "Componiendo la cinta de descuento...",
  "Ajustando precios y tipografía...",
  "Aplicando la paleta de marca...",
  "Renderizando en alta resolución...",
];

export function GeneratingOverlay() {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTipIndex((i) => (i + 1) % TIPS.length), 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex aspect-square w-full flex-col items-center justify-center gap-4 rounded-xl border border-[#c7d3ea] bg-[#0d0f2b] overflow-hidden relative">
      <div className="absolute inset-0 animate-[shimmer_2.2s_ease-in-out_infinite] bg-[linear-gradient(110deg,transparent_35%,rgba(74,168,232,0.25)_50%,transparent_65%)] bg-[length:250%_100%]" />
      <Sparkles size={32} className="relative text-[#4aa8e8] animate-pulse" />
      <span className="relative text-sm font-semibold text-white">{TIPS[tipIndex]}</span>
    </div>
  );
}
