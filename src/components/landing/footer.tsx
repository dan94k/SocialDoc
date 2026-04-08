import { FileCheck } from "lucide-react";

export default function Footer() {
  return (
    <>
      {/* Final CTA band */}
      <section
        className="px-4 py-20 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #050b18 0%, #081020 100%)" }}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(212,255,0,0.06) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-4"
            style={{ color: "rgba(212,255,0,0.6)" }}
          >
            Pronto para começar?
          </p>
          <h2
            className="text-4xl md:text-5xl font-extrabold text-white mb-5"
            style={{ fontFamily: "var(--font-display)", lineHeight: 1.05 }}
          >
            Seu próximo contrato
            <br />
            está a{" "}
            <span style={{ color: "#d4ff00" }}>5 minutos</span>.
          </h2>
          <p
            className="text-base mb-9"
            style={{ color: "rgba(255,255,255,0.42)" }}
          >
            Grátis para começar. Sem cartão de crédito.
          </p>
          <a
            href="/contrato"
            className="inline-flex items-center gap-2.5 rounded-2xl px-10 py-4 text-base font-bold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background: "#d4ff00",
              color: "#050b18",
              boxShadow: "0 0 40px rgba(212,255,0,0.2)",
            }}
          >
            <FileCheck className="h-4 w-4" />
            Criar meu contrato agora
          </a>
        </div>
      </section>

      {/* Footer bar */}
      <footer
        className="px-4 py-6"
        style={{ background: "#020810", borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2" style={{ color: "#ffffff" }}>
            <FileCheck className="h-4 w-4" style={{ color: "#d4ff00" }} />
            <span className="font-bold">SocialDoc</span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.25)" }}>
            Feito para social medias brasileiros.
          </p>
          <p style={{ color: "rgba(255,255,255,0.25)" }}>
            &copy; {new Date().getFullYear()} SocialDoc
          </p>
        </div>
      </footer>
    </>
  );
}
