"use client";

import dynamic from "next/dynamic";
import { FileText, Calendar } from "lucide-react";
import type { ContractData } from "@/types/contract";
import Link from "next/link";

const PdfDownload = dynamic(() => import("@/components/pdf/pdf-download"), {
  ssr: false,
  loading: () => (
    <div className="h-9 w-full rounded-md bg-muted animate-pulse" />
  ),
});

interface Contract {
  id: string;
  created_at: string;
  client_name: string;
  data: ContractData;
}

interface Props {
  contracts: Contract[];
}

export default function ContractList({ contracts }: Props) {
  if (contracts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
        <FileText className="h-12 w-12 text-muted-foreground/40 mb-4" />
        <p className="font-medium text-muted-foreground">Nenhum contrato ainda</p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Clique em &quot;Novo contrato&quot; para gerar o primeiro.
        </p>
        <Link
          href="/contrato"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
        >
          Criar meu primeiro contrato
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {contracts.map((contract) => {
        const date = new Date(contract.created_at).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        return (
          <div
            key={contract.id}
            className="rounded-xl border bg-card p-5 space-y-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold leading-tight">{contract.client_name}</p>
                  <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {date}
                  </div>
                </div>
              </div>
            </div>

            <PdfDownload data={contract.data} showWatermark={false} />
          </div>
        );
      })}
    </div>
  );
}
