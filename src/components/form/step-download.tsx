"use client";

import { useContractStore } from "@/stores/contract-store";
import { Button } from "@/components/ui/button";
import { getHotmartCheckoutUrl } from "@/lib/hotmart";
import { formatBRL } from "@/lib/utils";
import { CreditCard, CheckCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";

const PdfDownload = dynamic(() => import("@/components/pdf/pdf-download"), {
  ssr: false,
  loading: () => (
    <Button disabled className="w-full">
      Carregando...
    </Button>
  ),
});

async function saveContractToSupabase(data: ReturnType<typeof useContractStore.getState>["data"]) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("contracts").insert({
      user_id: user.id,
      client_name: data.clientName || "Cliente",
      data: data,
    });
  } catch {
    // Silently fail — contract download proceeds regardless
  }
}

export default function StepDownload() {
  const { data, saveToSession, prevStep } = useContractStore();
  const isPaid =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("paid");

  const handlePaidDownload = () => {
    saveToSession();
    window.location.href = getHotmartCheckoutUrl();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <CheckCircle className="mx-auto h-12 w-12 text-primary" />
        <h2 className="text-2xl font-bold">Seu contrato esta pronto!</h2>
        <p className="text-muted-foreground">
          Contrato para <strong>{data.clientName}</strong> no valor de{" "}
          <strong>{formatBRL(data.monthlyPrice)}</strong>/mes.
        </p>
      </div>

      <div className="space-y-3">
        {/* Free download with watermark */}
        <div className="rounded-lg border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Download gratuito</p>
              <p className="text-sm text-muted-foreground">PDF com marca d&apos;agua</p>
            </div>
            <span className="text-sm font-medium text-muted-foreground">Gratis</span>
          </div>
          <div onClick={() => saveContractToSupabase(data)}>
            <PdfDownload data={data} showWatermark={true} />
          </div>
        </div>

        {/* Paid download without watermark */}
        <div className="rounded-lg border-2 border-primary p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Download profissional</p>
              <p className="text-sm text-muted-foreground">
                PDF limpo, sem marca d&apos;agua
              </p>
            </div>
            <span className="text-sm font-bold text-primary">R$ 5,00</span>
          </div>
          {isPaid ? (
            <div onClick={() => saveContractToSupabase(data)}>
              <PdfDownload data={data} showWatermark={false} />
            </div>
          ) : (
            <Button onClick={handlePaidDownload} className="w-full">
              <CreditCard className="mr-2 h-4 w-4" />
              Comprar e baixar — R$ 5,00
            </Button>
          )}
        </div>
      </div>

      <Button variant="ghost" onClick={prevStep} className="w-full">
        Voltar e editar
      </Button>
    </div>
  );
}
