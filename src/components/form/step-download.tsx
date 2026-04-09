"use client";

import { useEffect, useState } from "react";
import { useContractStore } from "@/stores/contract-store";
import { getContractType } from "@/lib/contracts";
import { FileCheck, Crown, Loader2, LayoutList } from "lucide-react";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const PdfDownload = dynamic(() => import("@/components/pdf/pdf-download"), {
  ssr: false,
  loading: () => (
    <button
      disabled
      className="w-full rounded-2xl px-4 py-2.5 text-sm font-semibold opacity-60"
      style={{ background: "rgba(5,11,24,0.06)", border: "1px solid rgba(5,11,24,0.1)", color: "#050b18" }}
    >
      Carregando...
    </button>
  ),
});

async function saveContractToSupabase(
  data: ReturnType<typeof useContractStore.getState>["data"],
  contractTypeId: string | null
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("contracts").insert({
      user_id: user.id,
      client_name: data.clientName || "Cliente",
      data: { ...data, contractTypeId: contractTypeId ?? undefined },
    });
  } catch {
    // Silently fail — contract download proceeds regardless
  }
}

export default function StepDownload() {
  const { data, selectedContractTypeId, restoreFromSession } = useContractStore();
  const config = getContractType(selectedContractTypeId ?? "");
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
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("status")
          .eq("user_id", user.id)
          .eq("status", "active")
          .maybeSingle();

        if (sub) {
          setIsSubscribed(true);
        } else {
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
      {/* Header */}
      <div className="text-center space-y-3">
        <div
          className="mx-auto w-14 h-14 rounded-3xl flex items-center justify-center"
          style={{ background: "rgba(5,11,24,0.07)" }}
        >
          <FileCheck className="h-7 w-7" style={{ color: "#050b18" }} />
        </div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
          Seu contrato está pronto!
        </h2>
        <p className="text-sm" style={{ color: "rgba(5,11,24,0.5)" }}>
          Contrato para <strong style={{ color: "#050b18" }}>{data.clientName}</strong>.
        </p>
      </div>

      {/* Download options */}
      <div className="space-y-3">
        {isLoading ? (
          <button
            disabled
            className="w-full rounded-2xl px-4 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 opacity-60"
            style={{ background: "rgba(5,11,24,0.06)", border: "1px solid rgba(5,11,24,0.1)", color: "#050b18" }}
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Verificando acesso...
          </button>
        ) : (
          <>
            {/* Free download */}
            <div
              className="rounded-2xl p-4 space-y-3"
              style={{ border: "1px solid rgba(5,11,24,0.1)", background: "rgba(5,11,24,0.02)" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">Download gratuito</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(5,11,24,0.45)" }}>PDF com faixa de avaliação</p>
                </div>
                <span className="text-sm font-medium" style={{ color: "rgba(5,11,24,0.5)" }}>Grátis</span>
              </div>
              <div onClick={() => saveContractToSupabase(data, selectedContractTypeId)}>
                <PdfDownload data={data} showWatermark={true} config={config} />
              </div>
            </div>

            {/* Professional download */}
            <div
              className="rounded-2xl p-4 space-y-3"
              style={{
                border: "2px solid #050b18",
                background: "#050b18",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm" style={{ color: "#ffffff" }}>
                    Download profissional
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                    PDF limpo, sem faixa de avaliação
                  </p>
                </div>
                {isSubscribed && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold"
                    style={{ background: "rgba(212,255,0,0.15)", color: "#d4ff00" }}
                  >
                    <Crown className="h-3 w-3" />
                    Incluído
                  </span>
                )}
              </div>
              {isSubscribed ? (
                <div onClick={() => saveContractToSupabase(data, selectedContractTypeId)}>
                  <PdfDownload data={data} showWatermark={false} variant="lime" config={config} />
                </div>
              ) : (
                <Link
                  href="/assinar"
                  className="flex items-center justify-center gap-2 w-full rounded-2xl px-4 py-2.5 text-sm font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "#d4ff00", color: "#050b18" }}
                >
                  <Crown className="h-4 w-4" />
                  Assinar por R$ 10/mês (ilimitado)
                </Link>
              )}
            </div>
          </>
        )}
      </div>

      <Link
        href="/dashboard"
        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl py-2.5 text-sm font-medium transition-colors"
        style={{ color: "rgba(5,11,24,0.45)", background: "transparent" }}
      >
        <LayoutList className="h-4 w-4" />
        Ir para contratos
      </Link>
    </div>
  );
}
