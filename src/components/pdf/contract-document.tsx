import {
  Document,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import type { ContractData } from "@/types/contract";
import { CONTENT_TYPES, AUXILIARY_SERVICES } from "@/lib/constants";
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
  const { clauses } = data;

  if (clauses.revision.enabled) {
    const { maxRevisions, adjustmentDays, chargeExtra, extraValue } = clauses.revision;
    let text = `Cada peça criativa terá direito a até ${numExt(maxRevisions)} revisão(ões) sem custo adicional, com prazo de ${numExt(adjustmentDays)} dia(s) útil(eis) para o CONTRATANTE enviar o pedido de ajuste após a entrega.`;
    if (chargeExtra) {
      text += extraValue > 0
        ? ` Revisões excedentes serão cobradas no valor de ${formatBRLPdf(extraValue)} por revisão, mediante aprovação prévia do CONTRATANTE.`
        : ` Revisões excedentes serão orçadas e cobradas separadamente, mediante aprovação prévia do CONTRATANTE.`;
    }
    items.push({ title: "Limite de Revisões", text });
  }

  if (clauses.approval.enabled) {
    const { deadlineDays } = clauses.approval;
    items.push({
      title: "Prazo de Aprovação",
      text: `O CONTRATANTE terá o prazo de ${numExt(deadlineDays)} dia(s) útil(eis) para aprovar ou solicitar revisões do material entregue. Decorrido o prazo sem manifestação, o material será considerado automaticamente aprovado e a CONTRATADA estará autorizada a realizar a publicação.`,
    });
  }

  if (clauses.scopeExtras.enabled) {
    items.push({
      title: "Extras Fora do Escopo",
      text: "Demandas que extrapolem o escopo definido neste contrato serão orçadas separadamente e executadas somente após aprovação formal e por escrito do CONTRATANTE. A ausência de aprovação prévia desobriga a CONTRATADA de executar a demanda.",
    });
  }

  if (clauses.cancellation.enabled) {
    const { noticeDays, penaltyPercent } = clauses.cancellation;
    items.push({
      title: "Multa por Cancelamento",
      text: `Em caso de rescisão antecipada por qualquer das partes com aviso prévio inferior a ${numExt(noticeDays)} dia(s), será devida multa equivalente a ${penaltyPercent}% (${numExt(penaltyPercent)} por cento) do valor mensal vigente, a ser paga pela parte que descumpriu o prazo.`,
    });
  }

  if (clauses.filesPayment.enabled) {
    items.push({
      title: "Arquivos Editáveis Após Pagamento",
      text: "Os arquivos editáveis (fontes abertas, arquivos-fonte) das peças produzidas serão entregues ao CONTRATANTE somente após a quitação integral de todos os valores devidos. A CONTRATADA poderá reter os arquivos enquanto houver pendência financeira.",
    });
  }

  return items;
}

export default function ContractDocument({ data, showWatermark }: Props) {
  const clauseItems = buildClauses(data);
  const sectionOffset = clauseItems.length > 0 ? 1 : 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Free plan banners */}
        {showWatermark && (
          <>
            <View style={styles.freeBannerTop} fixed>
              <Text style={styles.freeBannerText}>
                Versão de avaliação gratuita — Gerada pelo plano free do SocialDoc. Este documento não possui validade jurídica.
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
          Contrato de Prestação de Serviços{"\n"}de Social Media
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
          {(() => {
            const contentLabels = data.contentTypes
              .map((id) => CONTENT_TYPES.find((c) => c.id === id)?.label ?? "")
              .filter(Boolean);
            const platformList = data.platforms.join(", ");
            const contentPart =
              contentLabels.length > 0
                ? `Criação de ${contentLabels.join(", ").toLowerCase()}`
                : "Criação de conteúdo";
            return `${contentPart} para as plataformas ${platformList}, com um total de ${data.totalPieces} peças por mês, divididas de acordo com a necessidade da marca.`;
          })()}
        </Text>
        {data.auxiliaryServices.length > 0 && (
          <Text style={styles.paragraph}>
            {"Serviços complementares inclusos: "}
            {data.auxiliaryServices
              .map((id) => AUXILIARY_SERVICES.find((s) => s.id === id)?.label ?? "")
              .filter(Boolean)
              .join(", ")}
            {"."}
          </Text>
        )}

        {/* 3. DO VALOR E PAGAMENTO */}
        <Text style={styles.sectionTitle}>3. Do Valor e Pagamento</Text>
        <Text style={styles.paragraph}>
          Pelos serviços prestados, o CONTRATANTE pagará a CONTRATADA o valor
          mensal de{" "}
          <Text style={styles.bold}>{formatBRLPdf(data.monthlyPrice)}</Text>,
          com vencimento todo dia{" "}
          <Text style={styles.bold}>{data.paymentDueDay}</Text> de cada mês.
        </Text>
        {data.pixKey !== null && data.pixKey.trim().length > 0 ? (
          <Text style={styles.paragraph}>
            O pagamento será realizado via PIX, utilizando a chave:{" "}
            <Text style={styles.bold}>{data.pixKey}</Text>.
          </Text>
        ) : (
          <Text style={styles.paragraph}>
            A forma de pagamento será definida em comum acordo entre as partes.
          </Text>
        )}

        {/* 4. DAS CLAUSULAS ESPECIAIS */}
        {clauseItems.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>4. Das Cláusulas Especiais</Text>
            {clauseItems.map((clause, index) => (
              <View key={clause.title}>
                <Text style={styles.clauseNumber}>
                  4.{index + 1}. {clause.title}
                </Text>
                <Text style={styles.clauseText}>{clause.text}</Text>
              </View>
            ))}
          </>
        )}

        {/* DA VIGENCIA */}
        <Text style={styles.sectionTitle}>
          {4 + sectionOffset}. Da Vigência
        </Text>
        <Text style={styles.paragraph}>
          O presente contrato terá vigência de{" "}
          <Text style={styles.bold}>
            {data.durationMonths} (
            {data.durationMonths === 3
              ? "três"
              : data.durationMonths === 6
                ? "seis"
                : "doze"}
            ) meses
          </Text>
          , contados a partir da data de assinatura, podendo ser renovado
          mediante acordo entre as partes.
        </Text>

        {/* DO FORO */}
        <Text style={styles.sectionTitle}>
          {5 + sectionOffset}. Do Foro
        </Text>
        <Text style={styles.paragraph}>
          As partes elegem o foro da comarca do domicílio do CONTRATANTE para
          dirimir quaisquer dúvidas ou controvérsias oriundas deste contrato.
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
