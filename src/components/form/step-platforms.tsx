"use client";

import { useContractStore } from "@/stores/contract-store";
import { PLATFORMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Quais plataformas você vai atender?</h2>
      <p className="text-muted-foreground">Selecione todas que se aplicam.</p>
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((platform) => {
          const selected = data.platforms.includes(platform);
          return (
            <button
              key={platform}
              onClick={() => toggle(platform)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-accent"
              )}
            >
              {platform}
            </button>
          );
        })}
      </div>
    </div>
  );
}
