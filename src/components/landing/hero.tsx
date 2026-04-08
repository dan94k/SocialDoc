"use client";

import { ArrowRight, Shield, FileCheck, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  const handleCriarContrato = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      router.push("/contrato");
    } else {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
    }
  };

  return (
    <section
      className="relative overflow-hidden px-4 py-20 md:py-32 min-h-[92vh] flex items-center"
      style={{ background: "linear-gradient(135deg, #050b18 0%, #081020 100%)" }}
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Glow orb top-right */}
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full animate-glow-pulse pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(212,255,0,0.07) 0%, transparent 65%)",
          filter: "blur(40px)",
          transform: "translate(20%, -20%)",
        }}
      />

      {/* Glow orb bottom-left */}
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
          transform: "translate(-30%, 30%)",
        }}
      />

      <div className="mx-auto max-w-6xl w-full relative z-10">
        <div className="grid md:grid-cols-[1.15fr,0.85fr] gap-12 lg:gap-20 items-center">

          {/* ── Left: Text Content ── */}
          <div>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold mb-8"
              style={{
                background: "rgba(212,255,0,0.1)",
                border: "1px solid rgba(212,255,0,0.22)",
                color: "#d4ff00",
              }}
            >
              <Shield className="h-3.5 w-3.5" />
              Proteção para social medias brasileiros
            </div>

            {/* Headline */}
            <h1
              className="text-5xl md:text-[5rem] font-extrabold leading-[0.93] tracking-tight mb-7"
              style={{ fontFamily: "var(--font-display)", color: "#ffffff" }}
            >
              Chega de
              <br />
              trabalhar{" "}
              <span
                style={{
                  color: "#d4ff00",
                  WebkitTextStroke: "0px",
                }}
              >
                sem
              </span>
              <br />
              <span style={{ color: "#d4ff00" }}>contrato.</span>
            </h1>

            {/* Sub */}
            <p
              className="text-lg md:text-xl max-w-[460px] mb-10 leading-relaxed"
              style={{ color: "rgba(255,255,255,0.52)" }}
            >
              Crie um contrato profissional de social media em menos de{" "}
              <strong style={{ color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>
                5 minutos
              </strong>
              . Proteja seu trabalho e pare de perder dinheiro com combinados
              que não foram honrados.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <button
                onClick={handleCriarContrato}
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl px-8 py-4 text-base font-bold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                style={{
                  background: "#d4ff00",
                  color: "#050b18",
                  boxShadow: "0 0 32px rgba(212,255,0,0.25)",
                }}
              >
                Criar meu contrato
                <ArrowRight className="h-4 w-4" />
              </button>
              <div
                className="inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-medium"
                style={{
                  border: "1px solid rgba(255,255,255,0.14)",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                <Clock className="h-4 w-4" />
                Pronto em 5 minutos
              </div>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                "Grátis para começar",
                "Login com Google",
                "Sem cartão de crédito",
              ].map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-2 text-sm"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  <span style={{ color: "#d4ff00" }}>✓</span>
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: Document Mockup ── */}
          <div className="hidden md:flex justify-center items-center relative py-12">
            <div className="relative">
              {/* Shadow glow behind document */}
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: "rgba(212,255,0,0.06)",
                  filter: "blur(40px)",
                  transform: "scale(1.3)",
                }}
              />

              {/* Main document */}
              <div
                className="relative animate-hero-float rounded-2xl p-8 w-[290px]"
                style={{
                  background: "#ffffff",
                  boxShadow:
                    "0 60px 120px rgba(0,0,0,0.7), 0 0 80px rgba(212,255,0,0.06)",
                }}
              >
                {/* Document header */}
                <div
                  className="text-center mb-5 pb-4"
                  style={{ borderBottom: "1px solid #e5e7eb" }}
                >
                  <div className="flex justify-center mb-2.5">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: "#050b18" }}
                    >
                      <FileCheck className="h-4 w-4" style={{ color: "#d4ff00" }} />
                    </div>
                  </div>
                  <div
                    className="text-[9px] font-bold uppercase tracking-[0.18em] leading-tight"
                    style={{ color: "#111827" }}
                  >
                    Contrato de Prestação
                    <br />
                    de Serviços
                  </div>
                  <div className="text-[8px] mt-1" style={{ color: "#9ca3af" }}>
                    Social Media Marketing · 2026
                  </div>
                </div>

                {/* Document body simulation */}
                <div className="space-y-4">
                  {[
                    { headingW: 55, lines: [100, 85, 92] },
                    { headingW: 62, lines: [100, 78, 88, 65] },
                    { headingW: 48, lines: [100, 90] },
                  ].map((block, i) => (
                    <div key={i} className="space-y-1.5">
                      <div
                        className="h-2 rounded"
                        style={{
                          width: `${block.headingW}%`,
                          background: "#111827",
                        }}
                      />
                      {block.lines.map((w, j) => (
                        <div
                          key={j}
                          className="h-1.5 rounded"
                          style={{ width: `${w}%`, background: "#e5e7eb" }}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {/* Signature area */}
                <div
                  className="flex justify-between mt-7 pt-4"
                  style={{ borderTop: "1px solid #e5e7eb" }}
                >
                  {["Contratante", "Prestador"].map((label) => (
                    <div key={label} className="text-center">
                      <div
                        className="h-px w-20 mb-1.5"
                        style={{ background: "#d1d5db" }}
                      />
                      <div className="text-[8px]" style={{ color: "#9ca3af" }}>
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shield badge */}
                <div
                  className="absolute -top-3 -right-3 w-11 h-11 rounded-full flex items-center justify-center"
                  style={{
                    background: "#d4ff00",
                    boxShadow: "0 0 24px rgba(212,255,0,0.5)",
                  }}
                >
                  <Shield className="h-5 w-5" style={{ color: "#050b18" }} />
                </div>
              </div>

              {/* Floating chip: Protected */}
              <div
                className="absolute -left-16 top-1/4 animate-chip-float rounded-2xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap"
                style={{
                  background: "rgba(212,255,0,0.14)",
                  border: "1px solid rgba(212,255,0,0.28)",
                  color: "#d4ff00",
                  backdropFilter: "blur(12px)",
                }}
              >
                ✓ Protegido
              </div>

              {/* Floating chip: PDF ready */}
              <div
                className="absolute -right-14 bottom-1/3 animate-chip-float-delayed rounded-2xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  color: "rgba(255,255,255,0.75)",
                  backdropFilter: "blur(12px)",
                }}
              >
                📄 PDF gerado
              </div>

              {/* Floating chip: Time */}
              <div
                className="absolute left-1/2 -bottom-8 -translate-x-1/2 animate-chip-float rounded-2xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.5)",
                  backdropFilter: "blur(12px)",
                  animationDelay: "0.5s",
                }}
              >
                ⏱ 5 minutos
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
