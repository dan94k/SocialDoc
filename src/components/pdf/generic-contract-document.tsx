import { Document, Page, Text, View } from "@react-pdf/renderer";
import type { ContractData } from "@/types/contract";
import type { GenericContractTypeConfig, PdfSectionDef } from "@/types/contract-engine";
import { styles } from "./pdf-styles";
import { formatDatePdf, resolvePath, interpolate } from "@/lib/pdf-utils";

interface Props {
  data: ContractData;
  config: GenericContractTypeConfig;
  showWatermark: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Section Renderers
// ─────────────────────────────────────────────────────────────────────────────

function PartiesSectionRenderer({
  section,
  data,
  num,
}: {
  section: Extract<PdfSectionDef, { type: "parties" }>;
  data: ContractData;
  num: number;
}) {
  const clientDoc =
    data.clientDocType && data.clientDocType !== "nao-fornecer" && data.clientDoc
      ? `, ${data.clientDocType} ${data.clientDoc}`
      : "";
  const freelancerDoc =
    data.freelancerDocType && data.freelancerDocType !== "nao-fornecer" && data.freelancerDoc
      ? `, ${data.freelancerDocType} ${data.freelancerDoc}`
      : "";

  return (
    <>
      <Text style={styles.sectionTitle}>
        {num}. {section.sectionTitle.toUpperCase()}
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>CONTRATANTE: </Text>
        {data.clientName}
        {clientDoc}
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>CONTRATADA: </Text>
        {data.freelancerName}
        {freelancerDoc}
      </Text>
    </>
  );
}

function StaticTextSectionRenderer({
  section,
  data,
  num,
}: {
  section: Extract<PdfSectionDef, { type: "static-text" }>;
  data: ContractData;
  num: number;
}) {
  const mainText = section.textFn
    ? section.textFn(data)
    : section.text
    ? interpolate(section.text, data as unknown as Record<string, unknown>)
    : "";

  const additionalParagraphs = section.additionalParagraphsFn
    ? section.additionalParagraphsFn(data)
    : [];

  return (
    <>
      <Text style={styles.sectionTitle}>
        {num}. {section.sectionTitle.toUpperCase()}
      </Text>
      {mainText ? <Text style={styles.paragraph}>{mainText}</Text> : null}
      {additionalParagraphs.map((p, i) => (
        <Text key={i} style={styles.paragraph}>
          {p}
        </Text>
      ))}
    </>
  );
}

function ClausesSectionRenderer({
  section,
  data,
  num,
}: {
  section: Extract<PdfSectionDef, { type: "clauses-section" }>;
  data: ContractData;
  num: number;
}) {
  const clausesObj = resolvePath(data, section.clausesPath) as Record<
    string,
    { enabled: boolean }
  > | undefined;

  if (!clausesObj) return null;

  const items = section.clauses
    .filter((c) => clausesObj[c.key]?.enabled)
    .map((c, i) => ({
      title: c.title,
      text: c.textFn(data),
      subNum: `${num}.${i + 1}`,
    }));

  if (items.length === 0) return null;

  return (
    <>
      <Text style={styles.sectionTitle}>
        {num}. {section.sectionTitle.toUpperCase()}
      </Text>
      {items.map((item) => (
        <View key={item.title}>
          <Text style={styles.clauseNumber}>
            {item.subNum}. {item.title}
          </Text>
          <Text style={styles.clauseText}>{item.text}</Text>
        </View>
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function GenericContractDocument({ data, config, showWatermark }: Props) {
  // Pre-calculate which sections are non-empty to get correct numbering
  let sectionNumber = 1;

  const renderedSections = config.pdf.sections.map((section) => {
    if (section.type === "clauses-section") {
      const clausesObj = resolvePath(data, section.clausesPath) as
        | Record<string, { enabled: boolean }>
        | undefined;
      const hasEnabled = section.clauses.some((c) => clausesObj?.[c.key]?.enabled);
      if (!hasEnabled) return null;
    }
    const num = sectionNumber++;
    return { section, num };
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark banners */}
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
        <Text style={styles.title}>{config.pdf.title}</Text>

        {/* Sections */}
        {renderedSections.map((item, i) => {
          if (!item) return null;
          const { section, num } = item;

          if (section.type === "parties") {
            return (
              <PartiesSectionRenderer
                key={i}
                section={section}
                data={data}
                num={num}
              />
            );
          }
          if (section.type === "static-text") {
            return (
              <StaticTextSectionRenderer
                key={i}
                section={section}
                data={data}
                num={num}
              />
            );
          }
          if (section.type === "clauses-section") {
            return (
              <ClausesSectionRenderer
                key={i}
                section={section}
                data={data}
                num={num}
              />
            );
          }
          return null;
        })}

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
