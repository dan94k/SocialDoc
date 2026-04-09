"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useContractStore } from "@/stores/contract-store";

export default function NewContractButton() {
  const router = useRouter();
  const resetContract = useContractStore((s) => s.resetContract);

  const handleClick = () => {
    resetContract();
    router.push("/contrato");
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shrink-0"
      style={{
        background: "#d4ff00",
        color: "#050b18",
        boxShadow: "0 0 24px rgba(212,255,0,0.18)",
      }}
    >
      <Plus className="h-4 w-4" />
      Novo contrato
    </button>
  );
}
