"use client";

import { Plus, Trash2 } from "lucide-react";
import { CurrencyInput } from "./CurrencyInput";
import type { PriceRow } from "@/lib/types";

export function PriceRowsEditor({
  rows,
  onChange,
}: {
  rows: PriceRow[];
  onChange: (rows: PriceRow[]) => void;
}) {
  function update(index: number, field: keyof PriceRow, value: string) {
    onChange(rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  }

  function remove(index: number) {
    onChange(rows.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...rows, { label: "", before: "", after: "" }]);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-[#0d0f2b]">Precios</span>
      <div className="flex flex-col gap-2">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-2">
            <input
              className="rounded-lg border border-[#c7d3ea] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4aa8e8]"
              placeholder="Etiqueta (ej. Liviano)"
              value={row.label}
              onChange={(e) => update(i, "label", e.target.value)}
            />
            <CurrencyInput value={row.before} onChange={(v) => update(i, "before", v)} placeholder="Antes" />
            <CurrencyInput value={row.after} onChange={(v) => update(i, "after", v)} placeholder="Ahora" />
            <button
              type="button"
              onClick={() => remove(i)}
              disabled={rows.length <= 1}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[#9399b3] hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Quitar precio"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="flex cursor-pointer items-center gap-1.5 self-start rounded-lg px-2 py-1.5 text-sm font-semibold text-[#15649f] hover:bg-[#eaf4fd]"
      >
        <Plus size={16} /> Agregar precio
      </button>
    </div>
  );
}
