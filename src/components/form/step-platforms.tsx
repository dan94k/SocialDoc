"use client";

import { useContractStore } from "@/stores/contract-store";
import { PLATFORMS } from "@/lib/constants";

export default function StepPlatforms() {
  const { data, setField } = useContractStore();

  const toggle = (platform: string) => {
    const current = data.platforms;
    const next = current.includes(platform)
      ? current.filter((p) => p !== platform)
      : [...current, platform];
    setField("platforms", next);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2
          className="text-2xl font-extrabold"
          style={{ fontFamily: "var(--font-display)", color: "#050b18" }}
        >
          Quais plataformas você vai atender?
        </h2>
        <p className="text-sm mt-1.5" style={{ color: "rgba(5,11,24,0.5)" }}>
          Selecione todas que se aplicam.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((platform) => {
          const selected = data.platforms.includes(platform);
          return (
            <button
              key={platform}
              onClick={() => toggle(platform)}
              className="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
              style={
                selected
                  ? { background: "#050b18", color: "#ffffff", border: "1px solid #050b18" }
                  : { background: "transparent", color: "rgba(5,11,24,0.65)", border: "1px solid rgba(5,11,24,0.18)" }
              }
            >
              {platform}
            </button>
          );
        })}
      </div>
    </div>
  );
}
