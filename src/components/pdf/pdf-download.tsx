"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download, Loader2 } from "lucide-react";
import ContractDocument from "./contract-document";
import type { ContractData } from "@/types/contract";

interface Props {
  data: ContractData;
  showWatermark: boolean;
}

export default function PdfDownload({ data, showWatermark }: Props) {
  const filename = showWatermark
    ? `contrato-${data.clientName.toLowerCase().replace(/\s+/g, "-")}-avaliacao.pdf`
    : `contrato-${data.clientName.toLowerCase().replace(/\s+/g, "-")}.pdf`;

  return (
    <PDFDownloadLink
      document={<ContractDocument data={data} showWatermark={showWatermark} />}
      fileName={filename}
      className="block w-full"
    >
      {({ loading }) => (
        <button
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
          style={
            showWatermark
              ? {
                  background: "rgba(5,11,24,0.06)",
                  color: "rgba(5,11,24,0.65)",
                  border: "1px solid rgba(5,11,24,0.1)",
                }
              : {
                  background: "#050b18",
                  color: "#ffffff",
                }
          }
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Gerando PDF...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              {showWatermark ? "Baixar versão de avaliação" : "Baixar PDF"}
            </>
          )}
        </button>
      )}
    </PDFDownloadLink>
  );
}
