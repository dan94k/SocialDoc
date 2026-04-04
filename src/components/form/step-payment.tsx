"use client";

import { useContractStore } from "@/stores/contract-store";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function StepPayment() {
  const { data, setField } = useContractStore();
  const hasPix = data.pixKey !== null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pagamento</h2>

      {/* Valor mensal */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Valor mensal</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
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
        <label className="text-sm font-medium">Dia de vencimento</label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Todo dia</span>
          <Input
            type="number"
            min={1}
            max={31}
            placeholder="5"
            value={data.paymentDueDay}
            onChange={(e) => setField("paymentDueDay", Number(e.target.value))}
            className="w-20 text-center"
          />
          <span className="text-sm text-muted-foreground whitespace-nowrap">de cada mes</span>
        </div>
      </div>

      {/* Chave PIX */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Forma de pagamento</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setField("pixKey", hasPix ? data.pixKey ?? "" : "")}
            className={cn(
              "flex-1 rounded-lg border py-2.5 text-sm font-medium transition-colors",
              hasPix
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-accent"
            )}
          >
            Pix
          </button>
          <button
            type="button"
            onClick={() => setField("pixKey", null)}
            className={cn(
              "flex-1 rounded-lg border py-2.5 text-sm font-medium transition-colors",
              !hasPix
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-accent"
            )}
          >
            Outra forma
          </button>
        </div>

        {hasPix && (
          <Input
            placeholder="CPF, e-mail, telefone ou chave aleatoria"
            value={data.pixKey ?? ""}
            onChange={(e) => setField("pixKey", e.target.value)}
            autoFocus
          />
        )}

        {!hasPix && (
          <p className="text-xs text-muted-foreground">
            O contrato dira que a forma de pagamento sera combinada entre as partes.
          </p>
        )}
      </div>
    </div>
  );
}
