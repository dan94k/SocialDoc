import { FileCheck, Shield } from "lucide-react";

const clauses = [
  { emoji: "💰", title: "Condições de pagamento", desc: "Valor, forma e prazo definidos em contrato." },
  { emoji: "🔄", title: "Número de revisões", desc: "Limite de alterações sem custo extra." },
  { emoji: "🚫", title: "Cláusula de cancelamento", desc: "Proteção se o cliente desistir no meio." },
  { emoji: "©️", title: "Direitos autorais", desc: "Seu conteúdo é seu até o pagamento ser feito." },
  { emoji: "📆", title: "Prazos e entregas", desc: "Datas claras para evitar mal-entendidos." },
  { emoji: "⚖️", title: "Foro de eleição", desc: "Definição de jurisdição em caso de conflito." },
];

export default function PdfPreview() {
  return (
    <section
      className="px-4 py-24 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #050b18 0%, #081020 100%)" }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="mx-auto max-w-6xl relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Left: feature list */}
          <div>
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-6"
              style={{
                background: "rgba(212,255,0,0.1)",
                border: "1px solid rgba(212,255,0,0.22)",
                color: "#d4ff00",
              }}
            >
              O que está no contrato
            </div>

            <h2
              className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6"
              style={{ fontFamily: "var(--font-display)", color: "#ffffff" }}
            >
              Contrato profissional
              <br />
              <span style={{ color: "#d4ff00" }}>de verdade.</span>
            </h2>

            <p
              className="text-base mb-10 leading-relaxed"
              style={{ color: "rgba(255,255,255,0.45)", maxWidth: "420px" }}
            >
              Formatado, com cláusulas claras e pronto para imprimir ou enviar
              por WhatsApp. Sem juridiquês desnecessário.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {clauses.map((clause) => (
                <div
                  key={clause.title}
                  className="rounded-2xl p-4 transition-all duration-200 hover:border-white/20"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div className="text-2xl mb-2">{clause.emoji}</div>
                  <div
                    className="text-sm font-semibold mb-1"
                    style={{ color: "#ffffff" }}
                  >
                    {clause.title}
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {clause.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Document mockup */}
          <div className="flex justify-center items-center">
            <div className="relative">
              {/* Glow */}
              <div
                className="absolute inset-0 rounded-3xl animate-glow-pulse"
                style={{
                  background: "rgba(212,255,0,0.05)",
                  filter: "blur(60px)",
                  transform: "scale(1.5)",
                }}
              />

              {/* Document */}
              <div
                className="relative rounded-2xl p-9 w-[280px] md:w-[300px]"
                style={{
                  background: "#ffffff",
                  boxShadow: "0 60px 120px rgba(0,0,0,0.7), 0 0 60px rgba(212,255,0,0.06)",
                  transform: "rotate(-1.5deg)",
                }}
              >
                {/* Header */}
                <div
                  className="text-center mb-6 pb-5"
                  style={{ borderBottom: "2px solid #050b18" }}
                >
                  <div
                    className="text-[9px] font-black uppercase tracking-[0.2em] text-center"
                    style={{ color: "#050b18" }}
                  >
                    Contrato de Prestação
                    <br />
                    de Serviços
                  </div>
                  <div className="text-[8px] mt-1.5" style={{ color: "#9ca3af" }}>
                    Social Media · Instagram & TikTok
                  </div>
                </div>

                {/* Sections */}
                <div className="space-y-5">
                  {[
                    {
                      title: "1. Das Partes",
                      lines: [100, 82, 91],
                    },
                    {
                      title: "2. Do Objeto",
                      lines: [100, 75, 88, 60],
                    },
                    {
                      title: "3. Da Remuneração",
                      lines: [100, 85],
                    },
                    {
                      title: "4. Do Prazo",
                      lines: [100, 70, 80],
                    },
                  ].map((section) => (
                    <div key={section.title} className="space-y-1.5">
                      <div
                        className="h-[7px] rounded font-bold"
                        style={{ width: "55%", background: "#111827" }}
                      />
                      {section.lines.map((w, j) => (
                        <div
                          key={j}
                          className="h-[5px] rounded"
                          style={{ width: `${w}%`, background: "#e5e7eb" }}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {/* Signatures */}
                <div
                  className="flex justify-between mt-8 pt-5"
                  style={{ borderTop: "1px solid #e5e7eb" }}
                >
                  {["Contratante", "Prestador"].map((label) => (
                    <div key={label} className="text-center">
                      <div
                        className="h-px w-20 mb-2"
                        style={{ background: "#d1d5db" }}
                      />
                      <div className="text-[7px] uppercase tracking-wider" style={{ color: "#9ca3af" }}>
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shield badge */}
                <div
                  className="absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: "#d4ff00",
                    boxShadow: "0 0 20px rgba(212,255,0,0.45)",
                  }}
                >
                  <Shield className="h-4 w-4" style={{ color: "#050b18" }} />
                </div>

                {/* Watermark overlay */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none rounded-2xl overflow-hidden"
                  style={{ opacity: 0.03 }}
                >
                  <div
                    className="text-6xl font-black uppercase tracking-widest select-none"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#050b18",
                      transform: "rotate(-30deg)",
                    }}
                  >
                    SocialDoc
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
