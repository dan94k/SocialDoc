"use client";

import { useEffect, useState } from "react";
import { useContractStore } from "@/stores/contract-store";
import { Button } from "@/components/ui/button";
import { formatBRL } from "@/lib/utils";
import { CheckCircle, Crown, Loader2, Zap } from "lucide-react";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

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
  const { data, saveToSession, restoreFromSession, prevStep } = useContractStore();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const params = new URLSearchParams(window.location.search);
      if (params.has("session_id")) {
        restoreFromSession();
        setIsPaid(true);
      }

      if (user) {
        // Fonte primária: tabela subscriptions
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("status")
          .eq("user_id", user.id)
          .eq("status", "active")
          .maybeSingle();

        if (sub) {
          setIsSubscribed(true);
        } else {
          // Fallback: tabela purchases (caso webhook não tenha chegado)
          const { data: purchase } = await supabase
            .from("purchases")
            .select("id")
            .eq("user_id", user.id)
            .eq("type", "subscription")
            .eq("status", "paid")
            .maybeSingle();
          setIsSubscribed(!!purchase);
        }
      }

      setIsLoading(false);
    }
    checkAccess();
  }, [restoreFromSession]);

  const handleSingleCheckout = async () => {
    setLoadingCheckout(true);
    try {
      saveToSession();
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: "price_1TJIlVGgPPRZ86mX8NBj3mL0",
          type: "single",
        }),
      });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch {
      alert("Erro ao iniciar pagamento. Tente novamente.");
      setLoadingCheckout(false);
    }
  };

  const canDownloadClean = isSubscribed || isPaid;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <CheckCircle className="mx-auto h-12 w-12 text-primary" />
        <h2 className="text-2xl font-bold">Seu contrato esta pronto!</h2>
        <p className="text-muted-foreground">
          Contrato para <strong>{data.clientName}</strong> no valor de{" "}
          <strong>{formatBRL(data.monthlyPrice)}</strong>/mes.
        </p>
        {isSubscribed && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            <Crown className="h-3 w-3" />
            Assinante Ilimitado
          </span>
        )}
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <Button disabled className="w-full">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verificando acesso...
          </Button>
        ) : isSubscribed ? (
          /* Assinante: apenas download profissional, imediato */
          <div className="rounded-lg border-2 border-primary p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Download profissional</p>
                <p className="text-sm text-muted-foreground">PDF limpo, sem marca d&apos;agua</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                <Crown className="h-3 w-3" />
                Incluído na assinatura
              </span>
            </div>
            <div onClick={() => saveContractToSupabase(data)}>
              <PdfDownload data={data} showWatermark={false} />
            </div>
          </div>
        ) : (
          /* Não assinante: free + opções de pagamento */
          <>
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

            {/* Professional download */}
            <div className="rounded-lg border-2 border-primary p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Download profissional</p>
                  <p className="text-sm text-muted-foreground">PDF limpo, sem marca d&apos;agua</p>
                </div>
                {!isPaid && (
                  <span className="text-sm font-bold text-primary">R$ 5,00</span>
                )}
              </div>

              {isPaid ? (
                <div onClick={() => saveContractToSupabase(data)}>
                  <PdfDownload data={data} showWatermark={false} />
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    onClick={handleSingleCheckout}
                    className="w-full"
                    disabled={loadingCheckout}
                  >
                    {loadingCheckout ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Pagar R$ 5,00 por este contrato
                      </>
                    )}
                  </Button>
                  <Link
                    href="/assinar"
                    className="flex items-center justify-center gap-2 w-full rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <Crown className="h-4 w-4 text-primary" />
                    Assinar por R$ 10/mes (ilimitado)
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Button variant="ghost" onClick={prevStep} className="w-full">
        Voltar e editar
      </Button>
    </div>
  );
}
