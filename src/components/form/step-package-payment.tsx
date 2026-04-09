"use client";

import { useContractStore } from "@/stores/contract-store";
import { Input } from "@/components/ui/input";
import type { PackagePaymentType } from "@/types/contract";
import { CircleDollarSign } from "lucide-react";

const PAYMENT_OPTIONS: { id: PackagePaymentType; label: string; description: string }[] = [
  { id: "split", label: "50% + 50%", description: "Metade no início, metade na entrega" },
  { id: "upfront", label: "100% no início", description: "Pagamento integral antes de começar" },
  { id: "onDelivery", label: "100% na entrega", description: "Pagamento integral ao receber os arquivos" },
];

export default function StepPackagePayment() {
  const { data, setField } = useContractStore();
  const price = data.packagePrice ?? 0;
  const paymentType = data.packagePaymentType ?? "split";
  const pixKey = data.packagePixKey ?? null;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: "rgba(5,11,24,0.07)" }}
        >
          <CircleDollarSign className="h-5 w-5" style={{ color: "#050b18" }} />
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "#050b18" }}>Pagamento</h2>
          <p className="text-sm" style={{ color: "rgba(5,11,24,0.5)" }}>
            Valor total do pacote e condições de pagamento.
          </p>
        </div>
      </div>

      {/* Price */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium" style={{ color: "#050b18" }}>
          Valor total do pacote
        </label>
        <div className="relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold"
            style={{ color: "rgba(5,11,24,0.4)" }}
          >
            R$
          </span>
          <Input
            type="number"
            min={0}
            step={50}
            placeholder="300"
            value={price || ""}
            onChange={(e) => setField("packagePrice", Number(e.target.value))}
            className="pl-9"
          />
        </div>
      </div>

      {/* Payment type */}
      <div className="space-y-2">
        <p className="text-sm font-medium" style={{ color: "#050b18" }}>Forma de pagamento</p>
        <div className="flex flex-col gap-2">
          {PAYMENT_OPTIONS.map((opt) => {
            const active = paymentType === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setField("packagePaymentType", opt.id)}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-left transition-all duration-200 hover:scale-[1.01]"
                style={
                  active
                    ? { background: "#050b18", border: "1px solid #050b18" }
                    : { background: "transparent", border: "1px solid rgba(5,11,24,0.15)" }
                }
              >
                <div>
                  <p className="text-sm font-semibold" style={{ color: active ? "#ffffff" : "#050b18" }}>
                    {opt.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: active ? "rgba(255,255,255,0.55)" : "rgba(5,11,24,0.45)" }}>
                    {opt.description}
                  </p>
                </div>
                <div
                  className="h-4 w-4 rounded-full border-2 flex-shrink-0"
                  style={{
                    borderColor: active ? "#d4ff00" : "rgba(5,11,24,0.25)",
                    background: active ? "#d4ff00" : "transparent",
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* PIX key */}
      <div className="space-y-2">
        <p className="text-sm font-medium" style={{ color: "#050b18" }}>Chave PIX (opcional)</p>
        <div className="flex gap-2">
          {[true, false].map((usePix) => (
            <button
              key={String(usePix)}
              type="button"
              onClick={() => setField("packagePixKey", usePix ? "" : null)}
              className="flex-1 rounded-2xl py-2 text-sm font-medium transition-all duration-200"
              style={
                (usePix ? pixKey !== null : pixKey === null)
                  ? { background: "#050b18", color: "#ffffff", border: "1px solid #050b18" }
                  : { background: "transparent", color: "rgba(5,11,24,0.6)", border: "1px solid rgba(5,11,24,0.15)" }
              }
            >
              {usePix ? "Pix" : "Outra forma"}
            </button>
          ))}
        </div>
        {pixKey !== null && (
          <Input
            placeholder="CPF, CNPJ, e-mail ou telefone"
            value={pixKey}
            onChange={(e) => setField("packagePixKey", e.target.value)}
          />
        )}
      </div>
    </div>
  );
}
