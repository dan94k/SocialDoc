import {
  Document,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import type { ContractData } from "@/types/contract";
import { PACKAGE_ART_TYPES } from "@/lib/constants";
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

function numExt(n: number): string {
  const map: Record<number, string> = {
    1: "um", 2: "dois", 3: "três", 4: "quatro", 5: "cinco",
    6: "seis", 7: "sete", 8: "oito", 9: "nove", 10: "dez",
    14: "quatorze", 15: "quinze", 20: "vinte", 30: "trinta",
    45: "quarenta e cinco", 60: "sessenta", 90: "noventa",
  };
  return map[n] ? `${n} (${map[n]})` : String(n);
}

interface ClauseItem {
  title: string;
  text: string;
}

function buildClauses(data: ContractData): ClauseItem[] {
  const items: ClauseItem[] = [];
  const clauses = data.packageClauses;
  if (!clauses) return items;

  if (clauses.revision.enabled) {
    const { maxRevisions, requestDays, chargeExtra, extraValue } = clauses.revision;
    let text = `Cada peça entregue terá direito a até ${numExt(maxRevisions)} rodada(s) de revisão sem custo adicional. O CONTRATANTE terá ${numExt(requestDays)} dia(s) útil(eis) após o recebimento de cada entrega para solicitar ajustes.`;
    if (chargeExtra) {
      text += extraValue > 0
        ? ` Revisões excedentes serão cobradas no valor de ${formatBRLPdf(extraValue)} por rodada, mediante aprovação prévia.`
        : ` Revisões excedentes serão orçadas e cobradas separadamente, mediante aprovação prévia.`;
    }
    items.push({ title: "Limite de Revisões", text });
  }

  if (clauses.cancellation.enabled) {
    const { penaltyPercent } = clauses.cancellation;
    items.push({
      title: "Cancelamento",
      text: `Em caso de cancelamento após o início da execução, será devida multa de ${penaltyPercent}% (${numExt(penaltyPercent)} por cento) sobre o valor total do pacote. O material já produzido até a data do cancelamento permanecerá com o CONTRATANTE.`,
    });
  }

  if (clauses.filesPayment.enabled) {
    items.push({
      title: "Arquivos Editáveis Após Pagamento",
      text: "Os arquivos editáveis (fontes abertas, arquivos-fonte) das peças produzidas serão entregues somente após a quitação integral dos valores devidos. A CONTRATADA poderá reter os arquivos enquanto houver pendência financeira.",
    });
  }

  return items;
}

function buildPaymentText(data: ContractData): string {
  const price = data.packagePrice ?? 0;
  const paymentType = data.packagePaymentType ?? "split";
  const pixKey = data.packagePixKey;
  const pixPart = pixKey && pixKey.trim().length > 0
    ? ` O pagamento será realizado via PIX, chave: ${pixKey}.`
    : " A forma de pagamento será definida em comum acordo entre as partes.";

  if (paymentType === "upfront") {
    return `O valor total do pacote é de ${formatBRLPdf(price)}, a ser pago integralmente antes do início da execução dos serviços.${pixPart}`;
  }
  if (paymentType === "onDelivery") {
    return `O valor total do pacote é de ${formatBRLPdf(price)}, a ser pago integralmente na entrega dos arquivos finais.${pixPart}`;
  }
  // split
  const half = price / 2;
  return `O valor total do pacote é de ${formatBRLPdf(price)}, dividido em duas parcelas: ${formatBRLPdf(half)} (50%) antes do início da execução e ${formatBRLPdf(half)} (50%) na entrega dos arquivos finais.${pixPart}`;
}

export default function ContractDocumentPackage({ data, showWatermark }: Props) {
  const clauseItems = buildClauses(data);
  const sectionOffset = clauseItems.length > 0 ? 1 : 0;

  const artTypeLabels = (data.packageArtTypes ?? [])
    .map((id) => PACKAGE_ART_TYPES.find((t) => t.id === id)?.label ?? "")
    .filter(Boolean);

  const totalItems = data.packageTotalItems ?? 10;
  const deliveryDays = data.packageDeliveryDays ?? 14;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Free plan banners */}
        {showWatermark && (
          <>
            <View style={styles.freeBannerTop} fixed>
              <Text style={styles.freeBannerText}>
                Versão de avaliação gratuita — Gerada pelo plano gratuito do SocialDoc.
              </Text>
            </View>
            <View style={styles.freeBannerBottom} fixed>
              <Text style={styles.freeBannerText}>
                Assine o plano ilimitado em socialdoc.com.br para gerar contratos sem esta faixa.
              </Text>
            </View>
          </>
        )}

        {/* Title */}
        <Text style={styles.title}>
          Contrato de Prestação de Serviços{"\n"}de Criação de Conteúdo
        </Text>

        {/* 1. DAS PARTES */}
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

        {/* 2. DO OBJETO */}
        <Text style={styles.sectionTitle}>2. Do Objeto</Text>
        <Text style={styles.paragraph}>
          {`A CONTRATADA compromete-se a produzir um pacote de ${numExt(totalItems)} (${totalItems}) peça(s)`}
          {artTypeLabels.length > 0
            ? `, sendo: ${artTypeLabels.join(", ").toLowerCase()},`
            : ","}{" "}
          {"conforme briefing e referências fornecidas pelo CONTRATANTE. O escopo de cada peça será detalhado no briefing acordado entre as partes."}
        </Text>

        {/* 3. DO PRAZO */}
        <Text style={styles.sectionTitle}>3. Do Prazo de Entrega</Text>
        <Text style={styles.paragraph}>
          {`Os serviços serão entregues em até ${numExt(deliveryDays)} dia(s) útil(eis), contados a partir da data de assinatura deste contrato e do recebimento do briefing completo pelo CONTRATANTE.`}
        </Text>

        {/* 4. DO VALOR E PAGAMENTO */}
        <Text style={styles.sectionTitle}>4. Do Valor e Pagamento</Text>
        <Text style={styles.paragraph}>{buildPaymentText(data)}</Text>

        {/* 5. DAS CLAUSULAS ESPECIAIS */}
        {clauseItems.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>5. Das Cláusulas Especiais</Text>
            {clauseItems.map((clause, index) => (
              <View key={clause.title}>
                <Text style={styles.clauseNumber}>
                  5.{index + 1}. {clause.title}
                </Text>
                <Text style={styles.clauseText}>{clause.text}</Text>
              </View>
            ))}
          </>
        )}

        {/* DO FORO */}
        <Text style={styles.sectionTitle}>
          {5 + sectionOffset}. Do Foro
        </Text>
        <Text style={styles.paragraph}>
          As partes elegem o foro da comarca do domicílio do CONTRATANTE para dirimir quaisquer dúvidas ou controvérsias oriundas deste contrato.
        </Text>

        {/* Date */}
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
