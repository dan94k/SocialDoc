"use client";

import { useContractStore } from "@/stores/contract-store";
import { Input } from "@/components/ui/input";

export default function StepPayment() {
  const { data, setField } = useContractStore();
  const hasPix = data.pixKey !== null;

  return (
    <div className="space-y-6">
      <h2
        className="text-2xl font-extrabold"
        style={{ fontFamily: "var(--font-display)", color: "#050b18" }}
      >
        Pagamento
      </h2>

      {/* Valor mensal */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium" style={{ color: "#050b18" }}>
          Valor mensal
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
            placeholder="1500"
            value={data.monthlyPrice || ""}
            onChange={(e) => setField("monthlyPrice", Number(e.target.value))}
            className="pl-10"
            autoFocus
          />
        </div>
      </div>

      {/* Dia de vencimento */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium" style={{ color: "#050b18" }}>
          Dia de vencimento
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm whitespace-nowrap" style={{ color: "rgba(5,11,24,0.5)" }}>
            Todo dia
          </span>
          <Input
            type="number"
            min={1}
            max={31}
            placeholder="5"
            value={data.paymentDueDay}
            onChange={(e) => setField("paymentDueDay", Number(e.target.value))}
            className="w-20 text-center"
          />
          <span className="text-sm whitespace-nowrap" style={{ color: "rgba(5,11,24,0.5)" }}>
            de cada mês
          </span>
        </div>
      </div>

      {/* Forma de pagamento */}
      <div className="space-y-2">
        <label className="text-sm font-medium" style={{ color: "#050b18" }}>
          Forma de pagamento
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setField("pixKey", hasPix ? data.pixKey ?? "" : "")}
            className="flex-1 rounded-2xl py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.01]"
            style={
              hasPix
                ? { background: "#050b18", color: "#ffffff", border: "1px solid #050b18" }
                : { background: "transparent", color: "rgba(5,11,24,0.6)", border: "1px solid rgba(5,11,24,0.15)" }
            }
          >
            Pix
          </button>
          <button
            type="button"
            onClick={() => setField("pixKey", null)}
            className="flex-1 rounded-2xl py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.01]"
            style={
              !hasPix
                ? { background: "#050b18", color: "#ffffff", border: "1px solid #050b18" }
                : { background: "transparent", color: "rgba(5,11,24,0.6)", border: "1px solid rgba(5,11,24,0.15)" }
            }
          >
            Outra forma
          </button>
        </div>

        {hasPix && (
          <Input
            placeholder="CPF, e-mail, telefone ou chave aleatória"
            value={data.pixKey ?? ""}
            onChange={(e) => setField("pixKey", e.target.value)}
            autoFocus
          />
        )}

        {!hasPix && (
          <p className="text-xs" style={{ color: "rgba(5,11,24,0.45)" }}>
            O contrato dirá que a forma de pagamento será combinada entre as partes.
          </p>
        )}
      </div>
    </div>
  );
}
