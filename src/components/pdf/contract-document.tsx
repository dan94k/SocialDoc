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
    1: "um", 2: "dois", 3: "tres", 4: "quatro", 5: "cinco",
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
    let text = `Cada peca criativa tera direito a ate ${numExt(maxRevisions)} revisao(es) sem custo adicional, com prazo de ${numExt(adjustmentDays)} dia(s) util(eis) para o CONTRATANTE enviar o pedido de ajuste apos a entrega.`;
    if (chargeExtra) {
      text += extraValue > 0
        ? ` Revisoes excedentes serao cobradas no valor de ${formatBRLPdf(extraValue)} por revisao, mediante aprovacao previa do CONTRATANTE.`
        : ` Revisoes excedentes serao orcadas e cobradas separadamente, mediante aprovacao previa do CONTRATANTE.`;
    }
    items.push({ title: "Limite de Revisoes", text });
  }

  if (clauses.approval.enabled) {
    const { deadlineDays } = clauses.approval;
    items.push({
      title: "Prazo de Aprovacao",
      text: `O CONTRATANTE tera o prazo de ${numExt(deadlineDays)} dia(s) util(eis) para aprovar ou solicitar revisoes do material entregue. Decorrido o prazo sem manifestacao, o material sera considerado automaticamente aprovado e a CONTRATADA estara autorizada a realizar a publicacao.`,
    });
  }

  if (clauses.scopeExtras.enabled) {
    items.push({
      title: "Extras Fora do Escopo",
      text: "Demandas que extrapolem o escopo definido neste contrato serao orcadas separadamente e executadas somente apos aprovacao formal e por escrito do CONTRATANTE. A ausencia de aprovacao previa desobriga a CONTRATADA de executar a demanda.",
    });
  }

  if (clauses.cancellation.enabled) {
    const { noticeDays, penaltyPercent } = clauses.cancellation;
    items.push({
      title: "Multa por Cancelamento",
      text: `Em caso de rescisao antecipada por qualquer das partes com aviso previo inferior a ${numExt(noticeDays)} dia(s), sera devida multa equivalente a ${penaltyPercent}% (${numExt(penaltyPercent)} por cento) do valor mensal vigente, a ser paga pela parte que descumpriu o prazo.`,
    });
  }

  if (clauses.filesPayment.enabled) {
    items.push({
      title: "Arquivos Editaveis Apos Pagamento",
      text: "Os arquivos editaveis (fontes abertas, arquivos-fonte) das pecas produzidas serao entregues ao CONTRATANTE somente apos a quitacao integral de todos os valores devidos. A CONTRATADA podera reter os arquivos enquanto houver pendencia financeira.",
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
                Versao de avaliacao gratuita — Gerado pelo plano free do SocialDoc. Este documento nao possui validade juridica.
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
          Contrato de Prestacao de Servicos{"\n"}de Social Media
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
                ? `Criacao de ${contentLabels.join(", ").toLowerCase()}`
                : "Criacao de conteudo";
            return `${contentPart} para as plataformas ${platformList}, com um total de ${data.totalPieces} pecas por mes, divididas de acordo com a necessidade da marca.`;
          })()}
        </Text>
        {data.auxiliaryServices.length > 0 && (
          <Text style={styles.paragraph}>
            {"Servicos complementares inclusos: "}
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
          Pelos servicos prestados, o CONTRATANTE pagara a CONTRATADA o valor
          mensal de{" "}
          <Text style={styles.bold}>{formatBRLPdf(data.monthlyPrice)}</Text>,
          com vencimento todo dia{" "}
          <Text style={styles.bold}>{data.paymentDueDay}</Text> de cada mes.
        </Text>
        {data.pixKey !== null && data.pixKey.trim().length > 0 ? (
          <Text style={styles.paragraph}>
            O pagamento sera realizado via PIX, utilizando a chave:{" "}
            <Text style={styles.bold}>{data.pixKey}</Text>.
          </Text>
        ) : (
          <Text style={styles.paragraph}>
            A forma de pagamento sera definida em comum acordo entre as partes.
          </Text>
        )}

        {/* 4. DAS CLAUSULAS ESPECIAIS */}
        {clauseItems.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>4. Das Clausulas Especiais</Text>
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
          {4 + sectionOffset}. Da Vigencia
        </Text>
        <Text style={styles.paragraph}>
          O presente contrato tera vigencia de{" "}
          <Text style={styles.bold}>
            {data.durationMonths} (
            {data.durationMonths === 3
              ? "tres"
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
          As partes elegem o foro da comarca do domicilio do CONTRATANTE para
          dirimir quaisquer duvidas ou controversias oriundas deste contrato.
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
