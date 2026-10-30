export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-[#0d0f2b]">{label}</span>
      {children}
      {hint && <span className="text-xs text-[#9399b3]">{hint}</span>}
    </label>
  );
}
