"use client";

import { useContractStore } from "@/stores/contract-store";

const OPTIONS = [3, 6, 12];

export default function StepDuration() {
  const { data, setField } = useContractStore();

  return (
    <div className="space-y-5">
      <div>
        <h2
          className="text-2xl font-extrabold"
          style={{ fontFamily: "var(--font-display)", color: "#050b18" }}
        >
          Duração do contrato
        </h2>
        <p className="text-sm mt-1.5" style={{ color: "rgba(5,11,24,0.5)" }}>
          Por quantos meses o contrato terá vigência?
        </p>
      </div>
      <div className="flex gap-3">
        {OPTIONS.map((months) => (
          <button
            key={months}
            onClick={() => setField("durationMonths", months)}
            className="flex-1 rounded-2xl p-4 text-center font-semibold transition-all duration-200 hover:scale-[1.02]"
            style={
              data.durationMonths === months
                ? { background: "#050b18", color: "#ffffff", border: "1px solid #050b18" }
                : { background: "transparent", color: "rgba(5,11,24,0.65)", border: "1px solid rgba(5,11,24,0.18)" }
            }
          >
            <span
              className="block text-2xl font-black mb-0.5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {months}
            </span>
            <span className="text-xs font-medium opacity-70">meses</span>
          </button>
        ))}
      </div>
    </div>
  );
}
