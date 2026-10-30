"use client";

import { Plus, Trash2 } from "lucide-react";

export function SpecListEditor({ specs, onChange }: { specs: string[]; onChange: (specs: string[]) => void }) {
  function update(index: number, value: string) {
    onChange(specs.map((s, i) => (i === index ? value : s)));
  }

  function remove(index: number) {
    onChange(specs.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-[#0d0f2b]">Especificaciones</span>
      {specs.map((spec, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            className="flex-1 rounded-lg border border-[#c7d3ea] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4aa8e8]"
            placeholder="Ej. 15.6'' Full HD"
            value={spec}
            onChange={(e) => update(i, e.target.value)}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            disabled={specs.length <= 1}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[#9399b3] hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Quitar especificación"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...specs, ""])}
        className="flex cursor-pointer items-center gap-1.5 self-start rounded-lg px-2 py-1.5 text-sm font-semibold text-[#15649f] hover:bg-[#eaf4fd]"
      >
        <Plus size={16} /> Agregar especificación
      </button>
    </div>
  );
}
