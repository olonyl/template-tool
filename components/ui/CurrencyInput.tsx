"use client";

/** Money input with a fixed currency prefix, right-aligned digits, and numeric input mode for mobile keyboards. */
export function CurrencyInput({
  value,
  onChange,
  currency = "C$",
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  currency?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex items-center rounded-lg border border-[#c7d3ea] bg-white focus-within:ring-2 focus-within:ring-[#4aa8e8] overflow-hidden">
      <span className="pl-3 pr-1 text-sm font-semibold text-[#9399b3] select-none">{currency}</span>
      <input
        inputMode="decimal"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
        className="w-full py-2 pr-3 text-right font-semibold text-[#0d0f2b] focus:outline-none"
      />
    </div>
  );
}
