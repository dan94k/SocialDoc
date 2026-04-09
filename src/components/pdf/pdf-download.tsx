"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import ContractDocument from "./contract-document";
import type { ContractData } from "@/types/contract";

interface Props {
  data: ContractData;
  showWatermark: boolean;
}

export default function PdfDownload({ data, showWatermark }: Props) {
  const filename = showWatermark
    ? `contrato-${data.clientName.toLowerCase().replace(/\s+/g, "-")}-gratis.pdf`
    : `contrato-${data.clientName.toLowerCase().replace(/\s+/g, "-")}.pdf`;

  return (
    <PDFDownloadLink
      document={<ContractDocument data={data} showWatermark={showWatermark} />}
      fileName={filename}
      className="block w-full"
    >
      {({ loading }) => (
        <Button
          variant={showWatermark ? "outline" : "default"}
          className="w-full"
          disabled={loading}
        >
          <Download className="mr-2 h-4 w-4" />
          {loading
            ? "Gerando PDF..."
            : showWatermark
              ? "Baixar grátis (com marca d'água)"
              : "Baixar PDF profissional"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
