"use client";

import { FileText, ArrowRight } from "lucide-react";
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
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    }
  };

  return (
    <section className="relative overflow-hidden px-4 py-24 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-primary/10" />

      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          Contrato profissional em 5 minutos
        </div>

        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
          Chega de trabalhar{" "}
          <span className="text-primary">sem contrato.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Gere um contrato profissional de social media em menos de 2 minutos.
          Proteja seu trabalho e pare de perder dinheiro com combinados que nao
          foram honrados.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={handleCriarContrato}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Criar meu contrato
            <ArrowRight className="h-4 w-4" />
          </button>
          <p className="text-sm text-muted-foreground">
            Gratis com marca d&apos;agua — login com Google
          </p>
        </div>
      </div>
    </section>
  );
}
