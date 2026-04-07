"use client";

import { useEffect, useState } from "react";
import { useContractStore } from "@/stores/contract-store";
import { Button } from "@/components/ui/button";
import { formatBRL } from "@/lib/utils";
import { CheckCircle, Crown, Loader2 } from "lucide-react";
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
  const { data, restoreFromSession, prevStep } = useContractStore();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const params = new URLSearchParams(window.location.search);
      if (params.has("session_id")) {
        restoreFromSession();
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
        ) : (
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
                {isSubscribed && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    <Crown className="h-3 w-3" />
                    Incluído
                  </span>
                )}
              </div>
              {isSubscribed ? (
                <div onClick={() => saveContractToSupabase(data)}>
                  <PdfDownload data={data} showWatermark={false} />
                </div>
              ) : (
                <Link
                  href="/assinar"
                  className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
                >
                  <Crown className="h-4 w-4" />
                  Assinar por R$ 10/mes (ilimitado)
                </Link>
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
