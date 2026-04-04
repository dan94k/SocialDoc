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
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2">
        {prefix && <span className="text-sm text-muted-foreground">{prefix}</span>}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onChange(Math.max(min, value - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border bg-background text-lg font-medium hover:bg-accent"
          >
            −
          </button>
          <span className="min-w-[2.5rem] text-center text-lg font-semibold">{value}</span>
          <button
            type="button"
            onClick={() => onChange(value + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border bg-background text-lg font-medium hover:bg-accent"
          >
            +
          </button>
        </div>
        {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}
