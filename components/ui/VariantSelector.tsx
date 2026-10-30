"use client";

import { Share2, MapPin } from "lucide-react";

export function VariantSelector({
  value,
  onChange,
}: {
  value: "meta" | "gbp";
  onChange: (value: "meta" | "gbp") => void;
}) {
  const options: { id: "meta" | "gbp"; label: string; icon: React.ReactNode }[] = [
    { id: "meta", label: "Facebook / Instagram", icon: <Share2 size={16} /> },
    { id: "gbp", label: "Google Business Profile", icon: <MapPin size={16} /> },
  ];

  return (
    <div className="inline-flex rounded-full border border-[#c7d3ea] bg-white p-1">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            value === opt.id
              ? "bg-gradient-to-br from-[#bfe3ff] via-[#4aa8e8] to-[#15649f] text-[#0d0f2b] shadow-sm"
              : "text-[#0d0f2b]/70 hover:bg-[#f4f6fb]"
          }`}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  );
}
