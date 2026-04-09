"use client";

import { ArrowRight, Shield, Clock, Zap } from "lucide-react";
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
      className="relative overflow-hidden px-4 py-28 md:py-40 flex items-center"
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

      {/* Glow orb center */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full pointer-events-none animate-glow-pulse"
        style={{
          background: "radial-gradient(ellipse, rgba(212,255,0,0.06) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />
      {/* Glow orb bottom-left */}
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[400px] rounded-full pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
          transform: "translate(-30%, 30%)",
        }}
      />

      <div className="mx-auto max-w-4xl w-full relative z-10 text-center">
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
          Proteção para social medias brasileiras
        </div>

        {/* Headline */}
        <h1
          className="text-5xl md:text-[5.5rem] font-extrabold leading-[0.92] tracking-tight mb-7"
          style={{ fontFamily: "var(--font-display)", color: "#ffffff" }}
        >
          Chega de trabalhar{" "}
          <span style={{ color: "#d4ff00" }}>sem contrato.</span>
        </h1>

        {/* Sub */}
        <p
          className="text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          Crie um contrato profissional de social media em menos de{" "}
          <strong style={{ color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>
            5 minutos
          </strong>
          . Proteja seu trabalho e pare de perder dinheiro com combinados
          que não foram honrados.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <button
            onClick={handleCriarContrato}
            className="inline-flex items-center justify-center gap-2.5 rounded-2xl px-10 py-4 text-base font-bold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background: "#d4ff00",
              color: "#050b18",
              boxShadow: "0 0 40px rgba(212,255,0,0.2)",
            }}
          >
            Criar meu contrato
            <ArrowRight className="h-4 w-4" />
          </button>
          <div
            className="inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-medium"
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            <Clock className="h-4 w-4" />
            Pronto em 5 minutos
          </div>
        </div>

        {/* Trust row */}
        <div className="flex flex-wrap gap-x-8 gap-y-2 justify-center">
          {[
            "Grátis para começar",
            "Login com Google",
            "Sem cartão de crédito",
          ].map((item) => (
            <span
              key={item}
              className="flex items-center gap-2 text-sm"
              style={{ color: "rgba(255,255,255,0.32)" }}
            >
              <span style={{ color: "#d4ff00" }}>✓</span>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
