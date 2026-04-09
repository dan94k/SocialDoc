import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ContractList from "@/components/dashboard/contract-list";
import NewContractButton from "@/components/dashboard/new-contract-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: contracts } = await supabase
    .from("contracts")
    .select("id, created_at, client_name, data")
    .order("created_at", { ascending: false });

  const name = user.user_metadata?.full_name?.split(" ")[0] ?? "você";
  const count = contracts?.length ?? 0;

  return (
    <main style={{ background: "#f5f3ef", minHeight: "100vh" }}>
      {/* Dark header band — continuação visual do navbar */}
      <div
        style={{
          background: "linear-gradient(135deg, #050b18 0%, #081020 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Grid pattern sutil */}
        <div
          className="relative overflow-hidden"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        >
          <div className="mx-auto max-w-5xl px-4 py-10 w-full">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: "#d4ff00" }}
                >
                  Seus contratos
                </p>
                <h1
                  className="text-3xl md:text-4xl font-extrabold"
                  style={{ fontFamily: "var(--font-display)", color: "#ffffff" }}
                >
                  Olá, {name}!
                </h1>
                <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.42)" }}>
                  {count > 0
                    ? `${count} contrato${count > 1 ? "s" : ""} gerado${count > 1 ? "s" : ""}.`
                    : "Você ainda não gerou nenhum contrato."}
                </p>
              </div>

              <NewContractButton />
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="mx-auto max-w-5xl px-4 py-10 w-full">
        <ContractList contracts={contracts ?? []} />
      </div>
    </main>
  );
}
