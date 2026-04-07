import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ContractList from "@/components/dashboard/contract-list";

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

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Olá, {name}!</h1>
        <p className="text-muted-foreground mt-1">
          {contracts?.length
            ? `Você tem ${contracts.length} contrato${contracts.length > 1 ? "s" : ""} gerado${contracts.length > 1 ? "s" : ""}.`
            : "Você ainda não gerou nenhum contrato."}
        </p>
      </div>

      <ContractList contracts={contracts ?? []} />
    </main>
  );
}
