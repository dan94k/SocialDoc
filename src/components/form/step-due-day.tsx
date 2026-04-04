"use client";

import { useContractStore } from "@/stores/contract-store";
import { Input } from "@/components/ui/input";

export default function StepDueDay() {
  const { data, setField } = useContractStore();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Dia de vencimento do pagamento</h2>
      <p className="text-muted-foreground">
        Em qual dia do mes o cliente deve efetuar o pagamento?
      </p>
      <Input
        type="number"
        min={1}
        max={31}
        placeholder="5"
        value={data.paymentDueDay}
        onChange={(e) => setField("paymentDueDay", Number(e.target.value))}
        autoFocus
      />
    </div>
  );
}
