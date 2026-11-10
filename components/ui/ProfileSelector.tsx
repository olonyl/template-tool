"use client";

import { Wrench, Laptop } from "lucide-react";

export function ProfileSelector({
  value,
  onChange,
}: {
  value: "taller" | "chikitech";
  onChange: (value: "taller" | "chikitech") => void;
}) {
  const options: { id: "taller" | "chikitech"; label: string; icon: React.ReactNode }[] = [
    { id: "taller", label: "Taller Don Ronald", icon: <Wrench size={16} /> },
    { id: "chikitech", label: "Chiki Tech", icon: <Laptop size={16} /> },
  ];

  return (
    <div className="inline-flex rounded-full border border-white/15 bg-white/10 p-1">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            value === opt.id ? "bg-white text-[#0d0f2b]" : "text-white/70 hover:bg-white/10"
          }`}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  );
}
