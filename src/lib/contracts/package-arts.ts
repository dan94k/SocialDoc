import type { GenericContractTypeConfig } from "@/types/contract-engine";
import type { DocType } from "@/types/contract";
import { PACKAGE_ART_TYPES } from "@/lib/constants";
import { numExt, formatBRLPdf } from "@/lib/pdf-utils";

function isDocValid(docType: DocType | null, doc: string): boolean {
  if (docType === null) return false;
  if (docType === "nao-fornecer") return true;
  return doc.trim().length > 0;
}

export const packageArtsConfig: GenericContractTypeConfig = {
  id: "package-arts",
  name: "Pacote de Artes Avulsas",
  description: "Contrato para projetos pontuais: um pacote fechado de peças com prazo, valor e condições definidos.",
  icon: "Package",

  steps: [
    {
      key: "freelancer",
      title: "Seus dados",
      heading: "Seus dados",
      subheading: "Informações que aparecerão no contrato como prestador de serviços.",
      validate: (d) =>
        d.freelancerName.trim().length > 0 &&
        isDocValid(d.freelancerDocType, d.freelancerDoc),
      fields: [
        { type: "text", field: "freelancerName", label: "Nome completo", placeholder: "Ex: Maria Silva", autoFocus: true },
        { type: "document", docTypeField: "freelancerDocType", docField: "freelancerDoc", label: "Documento" },
      ],
    },
    {
      key: "client",
      title: "Dados do cliente",
      heading: "Dados do seu cliente",
      subheading: "Nome completo ou razão social do cliente.",
      validate: (d) =>
        d.clientName.trim().length > 0 &&
        isDocValid(d.clientDocType, d.clientDoc),
      fields: [
        { type: "text", field: "clientName", label: "Nome completo ou razão social", placeholder: "Ex: Padaria do João LTDA", autoFocus: true },
        { type: "document", docTypeField: "clientDocType", docField: "clientDoc", label: "Documento" },
      ],
    },
    {
      key: "package-scope",
      title: "Pacote de serviços",
      heading: "Pacote de serviços",
      subheading: "Que tipo de conteúdo está incluso neste pacote?",
      validate: (d) => (d.packageArtTypes?.length ?? 0) > 0 && (d.packageTotalItems ?? 0) > 0,
      fields: [
        {
          type: "multiselect",
          field: "packageArtTypes",
          label: "Tipos de arte / entregáveis",
          options: PACKAGE_ART_TYPES.map((t) => ({ id: t.id, label: t.label })),
          emptyHint: "Selecione ao menos um tipo de entregável.",
        },
        {
          type: "number",
          field: "packageTotalItems",
          label: "Quantidade total de peças no pacote",
          min: 1,
          suffix: (v) => v === 1 ? "peça" : "peças",
        },
      ],
    },
    {
      key: "package-payment",
      title: "Pagamento",
      heading: "Pagamento",
      subheading: "Valor total do pacote e condições de pagamento.",
      validate: (d) => (d.packagePrice ?? 0) > 0,
      fields: [
        { type: "money", field: "packagePrice", label: "Valor total do pacote", placeholder: "300", step: 50 },
        {
          type: "select-described",
          field: "packagePaymentType",
          label: "Forma de pagamento",
          options: [
            { value: "split", label: "50% + 50%", description: "Metade no início, metade na entrega" },
            { value: "upfront", label: "100% no início", description: "Pagamento integral antes de começar" },
            { value: "onDelivery", label: "100% na entrega", description: "Pagamento integral ao receber os arquivos" },
          ],
        },
        {
          type: "select",
          field: "packagePixKey",
          label: "Chave PIX (opcional)",
          options: [
            { value: "", label: "Pix" },
            { value: "__null__", label: "Outra forma" },
          ],
        },
        {
          type: "text",
          field: "packagePixKey",
          label: "Chave PIX",
          placeholder: "CPF, CNPJ, e-mail ou telefone",
          renderWhen: (d) => d.packagePixKey !== null,
        },
      ],
    },
    {
      key: "package-deadline",
      title: "Prazo de entrega",
      heading: "Prazo de entrega",
      subheading: "Em quantos dias úteis o pacote será entregue?",
      validate: (d) => (d.packageDeliveryDays ?? 0) > 0,
      fields: [
        {
          type: "number",
          field: "packageDeliveryDays",
          label: "Prazo contado a partir do recebimento do briefing",
          min: 1,
          suffix: (v) => v === 1 ? "dia útil" : "dias úteis",
        },
      ],
    },
    {
      key: "clause-package-revision",
      title: "Cláusula: Revisões",
      validate: () => true,
      fields: [
        {
          type: "clause",
          clausePath: "packageClauses.revision",
          title: "Limite de revisões",
          description: "Quantas vezes o cliente pode pedir alterações após a entrega?",
          insight: "Em pacotes pontuais revisões ilimitadas podem consumir muito tempo. Deixar claro o número de rodadas de ajuste protege você e alinha a expectativa do cliente desde o início.",
          subFields: [
            { type: "number", field: "maxRevisions", label: "Máximo de revisões por peça", min: 1, suffix: (v) => v === 1 ? "revisão" : "revisões" },
            { type: "number", field: "requestDays", label: "Prazo para o cliente enviar o pedido de ajuste", min: 1, suffix: (v) => v === 1 ? "dia útil após entrega" : "dias úteis após entrega" },
            { type: "select", field: "chargeExtra", label: "Cobrar por revisão extra?", options: [{ value: true, label: "Sim" }, { value: false, label: "Não" }] },
            { type: "money", field: "extraValue", label: "Valor por revisão extra", placeholder: "50", step: 10, showWhen: { field: "chargeExtra", equals: true } },
          ],
        },
      ],
    },
    {
      key: "clause-package-cancellation",
      title: "Cláusula: Cancelamento",
      validate: () => true,
      fields: [
        {
          type: "clause",
          clausePath: "packageClauses.cancellation",
          title: "Cancelamento",
          description: "O que acontece se o projeto for cancelado após o início?",
          insight: "Em pacotes pontuais, parte do trabalho já pode estar feita quando o cliente cancela. Definir uma multa protege o seu tempo investido e desencoraja cancelamentos de última hora.",
          subFields: [
            { type: "number", field: "penaltyPercent", label: "Multa por cancelamento após início", min: 1, suffix: "% do valor total" },
          ],
        },
      ],
    },
    {
      key: "clause-package-files",
      title: "Cláusula: Arquivos",
      validate: () => true,
      fields: [
        {
          type: "clause",
          clausePath: "packageClauses.filesPayment",
          title: "Arquivos editáveis após pagamento",
          description: "Os arquivos-fonte só são entregues após quitação do pagamento.",
          insight: "Manter os arquivos editáveis retidos até o pagamento completo é uma proteção comum e legítima. Evita que o cliente fique com o material sem pagar a segunda parcela.",
          subFields: [],
        },
      ],
    },
    { key: "review", title: "Resumo", validate: () => true, fields: [], builtIn: "review" },
    { key: "download", title: "Seu contrato", validate: () => true, fields: [], builtIn: "download" },
  ],

  pdf: {
    title: "Contrato de Prestação de Serviços\nde Criação de Conteúdo",
    sections: [
      { type: "parties", sectionTitle: "Das Partes" },
      {
        type: "static-text",
        sectionTitle: "Do Objeto",
        textFn: (d) => {
          const artTypeLabels = (d.packageArtTypes ?? [])
            .map((id) => PACKAGE_ART_TYPES.find((t) => t.id === id)?.label ?? "")
            .filter(Boolean);
          const totalItems = d.packageTotalItems ?? 10;
          return `A CONTRATADA compromete-se a produzir um pacote de ${numExt(totalItems)} peça(s)${artTypeLabels.length > 0 ? `, sendo: ${artTypeLabels.join(", ").toLowerCase()},` : ","} conforme briefing e referências fornecidas pelo CONTRATANTE. O escopo de cada peça será detalhado no briefing acordado entre as partes.`;
        },
      },
      {
        type: "static-text",
        sectionTitle: "Do Prazo de Entrega",
        textFn: (d) => {
          const days = d.packageDeliveryDays ?? 14;
          return `Os serviços serão entregues em até ${numExt(days)} dia(s) útil(eis), contados a partir da data de assinatura deste contrato e do recebimento do briefing completo pelo CONTRATANTE.`;
        },
      },
      {
        type: "static-text",
        sectionTitle: "Do Valor e Pagamento",
        textFn: (d) => {
          const price = d.packagePrice ?? 0;
          const pixPart =
            d.packagePixKey && d.packagePixKey.trim().length > 0
              ? ` O pagamento será realizado via PIX, chave: ${d.packagePixKey}.`
              : " A forma de pagamento será definida em comum acordo entre as partes.";
          const half = price / 2;
          if (d.packagePaymentType === "upfront") {
            return `O valor total do pacote é de ${formatBRLPdf(price)}, a ser pago integralmente antes do início da execução dos serviços.${pixPart}`;
          }
          if (d.packagePaymentType === "onDelivery") {
            return `O valor total do pacote é de ${formatBRLPdf(price)}, a ser pago integralmente na entrega dos arquivos finais.${pixPart}`;
          }
          return `O valor total do pacote é de ${formatBRLPdf(price)}, dividido em duas parcelas: ${formatBRLPdf(half)} (50%) antes do início da execução e ${formatBRLPdf(half)} (50%) na entrega dos arquivos finais.${pixPart}`;
        },
      },
      {
        type: "clauses-section",
        sectionTitle: "Das Cláusulas Especiais",
        clausesPath: "packageClauses",
        clauses: [
          {
            key: "revision",
            title: "Limite de Revisões",
            textFn: (d) => {
              const c = d.packageClauses!.revision;
              let text = `Cada peça entregue terá direito a até ${numExt(c.maxRevisions)} rodada(s) de revisão sem custo adicional. O CONTRATANTE terá ${numExt(c.requestDays)} dia(s) útil(eis) após o recebimento de cada entrega para solicitar ajustes.`;
              if (c.chargeExtra) {
                text += c.extraValue > 0
                  ? ` Revisões excedentes serão cobradas no valor de ${formatBRLPdf(c.extraValue)} por rodada, mediante aprovação prévia.`
                  : ` Revisões excedentes serão orçadas e cobradas separadamente, mediante aprovação prévia.`;
              }
              return text;
            },
          },
          {
            key: "cancellation",
            title: "Cancelamento",
            textFn: (d) => {
              const { penaltyPercent } = d.packageClauses!.cancellation;
              return `Em caso de cancelamento após o início da execução, será devida multa de ${penaltyPercent}% (${numExt(penaltyPercent)} por cento) sobre o valor total do pacote. O material já produzido até a data do cancelamento permanecerá com o CONTRATANTE.`;
            },
          },
          {
            key: "filesPayment",
            title: "Arquivos Editáveis Após Pagamento",
            textFn: () =>
              "Os arquivos editáveis das peças produzidas serão entregues somente após a quitação integral dos valores devidos. A CONTRATADA poderá reter os arquivos enquanto houver pendência financeira.",
          },
        ],
      },
      {
        type: "static-text",
        sectionTitle: "Do Foro",
        text: "As partes elegem o foro da comarca do domicílio do CONTRATANTE para dirimir quaisquer dúvidas ou controvérsias oriundas deste contrato.",
      },
    ],
  },
};
