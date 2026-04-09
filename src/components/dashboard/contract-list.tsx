"use client";

import dynamic from "next/dynamic";
import { FileCheck, CalendarDays, ArrowRight, Plus } from "lucide-react";
import type { ContractData } from "@/types/contract";
import Link from "next/link";

const PdfDownload = dynamic(() => import("@/components/pdf/pdf-download"), {
  ssr: false,
  loading: () => (
    <div
      className="h-10 w-full rounded-2xl animate-pulse"
      style={{ background: "rgba(5,11,24,0.07)" }}
    />
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
      <div
        className="flex flex-col items-center justify-center rounded-3xl py-24 text-center"
        style={{
          background: "#ffffff",
          border: "2px dashed rgba(5,11,24,0.1)",
        }}
      >
        <div
          className="w-16 h-16 rounded-3xl flex items-center justify-center mb-5"
          style={{ background: "rgba(5,11,24,0.06)" }}
        >
          <FileCheck className="h-7 w-7" style={{ color: "rgba(5,11,24,0.28)" }} />
        </div>
        <p
          className="text-xl font-bold"
          style={{ fontFamily: "var(--font-display)", color: "#050b18" }}
        >
          Nenhum contrato ainda
        </p>
        <p
          className="text-sm mt-2 max-w-xs leading-relaxed"
          style={{ color: "rgba(5,11,24,0.45)" }}
        >
          Crie seu primeiro contrato profissional em menos de 5 minutos.
        </p>
        <Link
          href="/contrato"
          className="mt-8 inline-flex items-center gap-2 rounded-2xl px-7 py-3 text-sm font-bold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
          style={{ background: "#050b18", color: "#ffffff" }}
        >
          <Plus className="h-4 w-4" />
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
            className="rounded-3xl p-5 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(5,11,24,0.07)",
              boxShadow: "0 2px 16px rgba(5,11,24,0.05)",
            }}
          >
            {/* Card header */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#050b18" }}
              >
                <FileCheck className="h-4 w-4" style={{ color: "#d4ff00" }} />
              </div>
              <div className="min-w-0">
                <p
                  className="font-bold leading-tight truncate"
                  style={{ fontFamily: "var(--font-display)", color: "#050b18" }}
                >
                  {contract.client_name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <CalendarDays
                    className="h-3 w-3 flex-shrink-0"
                    style={{ color: "rgba(5,11,24,0.35)" }}
                  />
                  <span className="text-xs" style={{ color: "rgba(5,11,24,0.45)" }}>
                    {date}
                  </span>
                </div>
              </div>
            </div>

            {/* Download button */}
            <PdfDownload data={contract.data} showWatermark={false} />
          </div>
        );
      })}
    </div>
  );
}
