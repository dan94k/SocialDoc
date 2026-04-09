"use client";

interface Props {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  suffix?: string;
  prefix?: string;
}

export default function ClauseNumberField({ label, value, onChange, min = 1, suffix, prefix }: Props) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium" style={{ color: "#050b18" }}>{label}</label>
      <div className="flex items-center gap-2">
        {prefix && <span className="text-sm" style={{ color: "rgba(5,11,24,0.5)" }}>{prefix}</span>}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onChange(Math.max(min, value - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-lg font-medium transition-all duration-200 hover:scale-[1.05]"
            style={{ border: "1px solid rgba(5,11,24,0.15)", background: "transparent", color: "#050b18" }}
          >
            −
          </button>
          <span className="min-w-[2.5rem] text-center text-lg font-semibold" style={{ color: "#050b18" }}>{value}</span>
          <button
            type="button"
            onClick={() => onChange(value + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-lg font-medium transition-all duration-200 hover:scale-[1.05]"
            style={{ border: "1px solid rgba(5,11,24,0.15)", background: "transparent", color: "#050b18" }}
          >
            +
          </button>
        </div>
        {suffix && <span className="text-sm" style={{ color: "rgba(5,11,24,0.5)" }}>{suffix}</span>}
      </div>
    </div>
  );
}
