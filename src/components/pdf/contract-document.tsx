import {
  Document,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import type { ContractData } from "@/types/contract";
import { CLAUSES } from "@/lib/constants";
import { styles } from "./pdf-styles";

interface Props {
  data: ContractData;
  showWatermark: boolean;
}

function formatBRLPdf(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDatePdf(): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export default function ContractDocument({ data, showWatermark }: Props) {
  const activeClauses = CLAUSES.filter((c) => data.clauses[c.id]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        {showWatermark && (
          <View style={styles.watermark} fixed>
            <Text>SocialDoc — Versao Gratuita</Text>
          </View>
        )}

        {/* Title */}
        <Text style={styles.title}>
          Contrato de Prestacao de Servicos{"\n"}de Social Media
        </Text>

        {/* DAS PARTES */}
        <Text style={styles.sectionTitle}>1. Das Partes</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>CONTRATANTE: </Text>
          {data.clientName}
          {data.clientDocType && data.clientDocType !== "nao-fornecer" && data.clientDoc
            ? `, ${data.clientDocType} ${data.clientDoc}`
            : ""}
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>CONTRATADA: </Text>
          {data.freelancerName}
          {data.freelancerDocType && data.freelancerDocType !== "nao-fornecer" && data.freelancerDoc
            ? `, ${data.freelancerDocType} ${data.freelancerDoc}`
            : ""}
        </Text>

        {/* DO OBJETO */}
        <Text style={styles.sectionTitle}>2. Do Objeto</Text>
        <Text style={styles.paragraph}>
          O presente contrato tem como objeto a prestacao de servicos de gestao
          de redes sociais, incluindo criacao de conteudo, planejamento e
          publicacao nas seguintes plataformas:
        </Text>
        {data.platforms.map((platform) => (
          <Text key={platform} style={styles.listItem}>
            • {platform}
          </Text>
        ))}

        {/* DO VALOR E PAGAMENTO */}
        <Text style={styles.sectionTitle}>3. Do Valor e Pagamento</Text>
        <Text style={styles.paragraph}>
          Pelos servicos prestados, o CONTRATANTE pagara a CONTRATADA o valor
          mensal de{" "}
          <Text style={styles.bold}>{formatBRLPdf(data.monthlyPrice)}</Text>,
          com vencimento todo dia{" "}
          <Text style={styles.bold}>{data.paymentDueDay}</Text> de cada mes.
        </Text>

        {/* DAS CLAUSULAS */}
        {activeClauses.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>4. Das Clausulas Especiais</Text>
            {activeClauses.map((clause, index) => (
              <View key={clause.id}>
                <Text style={styles.clauseNumber}>
                  4.{index + 1}. {clause.label}
                </Text>
                <Text style={styles.clauseText}>{clause.legalText}</Text>
              </View>
            ))}
          </>
        )}

        {/* DA VIGENCIA */}
        <Text style={styles.sectionTitle}>
          {activeClauses.length > 0 ? "5" : "4"}. Da Vigencia
        </Text>
        <Text style={styles.paragraph}>
          O presente contrato tera vigencia de{" "}
          <Text style={styles.bold}>{data.durationMonths} ({data.durationMonths === 3 ? "tres" : data.durationMonths === 6 ? "seis" : "doze"}) meses</Text>,
          contados a partir da data de assinatura, podendo ser
          renovado mediante acordo entre as partes.
        </Text>

        {/* DO FORO */}
        <Text style={styles.sectionTitle}>
          {activeClauses.length > 0 ? "6" : "5"}. Do Foro
        </Text>
        <Text style={styles.paragraph}>
          As partes elegem o foro da comarca do domicilio do CONTRATANTE para
          dirimir quaisquer duvidas ou controversias oriundas deste contrato.
        </Text>

        {/* Date and Location */}
        <Text style={styles.dateLocation}>{formatDatePdf()}</Text>

        {/* Signatures */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>{data.clientName}</Text>
            <Text style={styles.signatureLabel}>CONTRATANTE</Text>
          </View>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>{data.freelancerName}</Text>
            <Text style={styles.signatureLabel}>CONTRATADA</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
