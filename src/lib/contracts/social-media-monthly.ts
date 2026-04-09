import type { GenericContractTypeConfig } from "@/types/contract-engine";
import type { DocType } from "@/types/contract";
import { PLATFORMS, CONTENT_TYPES, AUXILIARY_SERVICES } from "@/lib/constants";
import { numExt, formatBRLPdf } from "@/lib/pdf-utils";

function isDocValid(docType: DocType | null, doc: string): boolean {
  if (docType === null) return false;
  if (docType === "nao-fornecer") return true;
  return doc.trim().length > 0;
}

export const socialMediaMonthlyConfig: GenericContractTypeConfig = {
  id: "social-media-monthly",
  name: "Serviço Mensal de Social Media",
  description: "Contrato de prestação de serviços recorrentes de social media para pessoas físicas ou jurídicas.",
  icon: "LayoutDashboard",

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
      key: "platforms",
      title: "Plataformas",
      heading: "Quais plataformas você vai atender?",
      subheading: "Selecione todas que se aplicam.",
      validate: (d) => d.platforms.length > 0,
      fields: [
        {
          type: "multiselect",
          field: "platforms",
          label: "Plataformas",
          options: PLATFORMS.map((p) => ({ id: p, label: p })),
          emptyHint: "Selecione ao menos uma plataforma.",
        },
      ],
    },
    {
      key: "scope",
      title: "Escopo dos serviços",
      heading: "Escopo dos serviços",
      subheading: (d) => `O que você vai produzir para ${d.clientName || "o cliente"}?`,
      validate: () => true,
      fields: [
        {
          type: "multiselect",
          field: "contentTypes",
          label: "Tipos de conteúdo",
          options: CONTENT_TYPES.map((ct) => ({ id: ct.id, label: ct.label })),
        },
        {
          type: "number",
          field: "totalPieces",
          label: "Quantidade total de peças por mês",
          min: 1,
          suffix: "peças / mês",
        },
        {
          type: "multiselect",
          field: "auxiliaryServices",
          label: "Serviços complementares",
          options: AUXILIARY_SERVICES.map((s) => ({ id: s.id, label: s.label })),
        },
      ],
    },
    {
      key: "payment",
      title: "Pagamento",
      heading: "Pagamento",
      subheading: "Valor mensal e condições de pagamento.",
      validate: (d) => d.monthlyPrice > 0 && d.paymentDueDay >= 1 && d.paymentDueDay <= 31,
      fields: [
        { type: "money", field: "monthlyPrice", label: "Valor mensal", placeholder: "1500", step: 50 },
        {
          type: "number",
          field: "paymentDueDay",
          label: "Dia de vencimento",
          min: 1,
          suffix: "de cada mês",
        },
        {
          type: "select",
          field: "pixKey",
          label: "Forma de pagamento",
          options: [
            { value: "", label: "Pix" },
            { value: "__null__", label: "Outra forma" },
          ],
        },
        {
          type: "text",
          field: "pixKey",
          label: "Chave PIX",
          placeholder: "CPF, e-mail, telefone ou chave aleatória",
          renderWhen: (d) => d.pixKey !== null,
        },
      ],
    },
    {
      key: "clause-revision",
      title: "Cláusula: Revisões",
      validate: () => true,
      fields: [
        {
          type: "clause",
          clausePath: "clauses.revision",
          title: "Limite de revisões",
          description: "Quantas vezes o cliente pode pedir alterações em cada peça?",
          insight: "Sem esse limite, o cliente pode pedir infinitas revisões sem pagar nada a mais. Na prática você raramente vai cobrar — mas ter no contrato já faz o cliente pensar duas vezes antes de pedir a décima mudança.",
          subFields: [
            { type: "number", field: "maxRevisions", label: "Máximo de revisões por peça", min: 1, suffix: (v) => v === 1 ? "revisão" : "revisões" },
            { type: "number", field: "adjustmentDays", label: "Prazo para o cliente enviar o pedido de ajuste", min: 1, suffix: (v) => v === 1 ? "dia útil" : "dias úteis" },
            { type: "select", field: "chargeExtra", label: "Cobrar por revisão extra?", options: [{ value: true, label: "Sim" }, { value: false, label: "Não" }] },
            { type: "money", field: "extraValue", label: "Valor por revisão extra", placeholder: "100", step: 10, showWhen: { field: "chargeExtra", equals: true } },
          ],
        },
      ],
    },
    {
      key: "clause-approval",
      title: "Cláusula: Aprovação",
      validate: () => true,
      fields: [
        {
          type: "clause",
          clausePath: "clauses.approval",
          title: "Prazo de aprovação",
          description: "Tempo que o cliente tem para aprovar ou pedir alterações no material.",
          insight: "Sem essa cláusula, o cliente pode ficar semanas sem responder e depois dizer que não aprovou. Com ela, o silêncio vira aprovação automática — o que evita atrasos no seu cronograma de publicação.",
          subFields: [
            { type: "number", field: "deadlineDays", label: "Prazo para aprovação ou solicitação de revisão", min: 1, suffix: (v) => v === 1 ? "dia útil" : "dias úteis" },
          ],
        },
      ],
    },
    {
      key: "clause-scope-extras",
      title: "Cláusula: Extras",
      validate: () => true,
      fields: [
        {
          type: "clause",
          clausePath: "clauses.scopeExtras",
          title: "Extras fora do escopo",
          description: "Demandas que vão além do que foi combinado no contrato.",
          insight: "O cliente que fecha um pacote de Instagram muitas vezes começa a pedir arte para flyer, vídeo para TV, post para LinkedIn... Essa cláusula deixa claro que qualquer coisa além do combinado tem um preço — e precisa de aprovação antes de você executar.",
          subFields: [],
        },
      ],
    },
    {
      key: "clause-cancellation",
      title: "Cláusula: Cancelamento",
      validate: () => true,
      fields: [
        {
          type: "clause",
          clausePath: "clauses.cancellation",
          title: "Multa por cancelamento",
          description: "Penalidade caso o cliente encerre o contrato sem aviso prévio suficiente.",
          insight: "Quando o cliente cancela do nada, você perde uma renda fixa que já estava no seu planejamento. A multa não é para punir — é para garantir tempo mínimo de reposição dessa receita. Na maioria dos casos o cliente dá o aviso só por causa dela.",
          subFields: [
            { type: "number", field: "noticeDays", label: "Aviso prévio mínimo para cancelamento", min: 1, suffix: (v) => v === 1 ? "dia" : "dias" },
            { type: "number", field: "penaltyPercent", label: "Percentual da multa sobre o valor mensal", min: 1, suffix: "%" },
          ],
        },
      ],
    },
    {
      key: "clause-files",
      title: "Cláusula: Arquivos",
      validate: () => true,
      fields: [
        {
          type: "clause",
          clausePath: "clauses.filesPayment",
          title: "Arquivos editáveis após pagamento",
          description: "Os arquivos em formato aberto (PSD, AI, Figma...) só são entregues após quitação.",
          insight: "Entregar os editáveis antes do pagamento é como entregar o produto antes de receber. Com essa cláusula o cliente sabe desde o início que os arquivos finais só vêm com a conta paga — isso elimina quase completamente os calotes no último mês.",
          subFields: [],
        },
      ],
    },
    {
      key: "duration",
      title: "Duração",
      heading: "Duração do contrato",
      subheading: "Por quantos meses o contrato terá vigência?",
      validate: (d) => d.durationMonths > 0,
      fields: [
        {
          type: "select",
          field: "durationMonths",
          label: "Duração",
          options: [
            { value: 3, label: "3 meses" },
            { value: 6, label: "6 meses" },
            { value: 12, label: "12 meses" },
          ],
        },
      ],
    },
    { key: "review", title: "Resumo", validate: () => true, fields: [], builtIn: "review" },
    { key: "download", title: "Seu contrato", validate: () => true, fields: [], builtIn: "download" },
  ],

  pdf: {
    title: "Contrato de Prestação de Serviços\nde Social Media",
    sections: [
      { type: "parties", sectionTitle: "Das Partes" },
      {
        type: "static-text",
        sectionTitle: "Do Objeto",
        textFn: (d) => {
          const contentLabels = d.contentTypes
            .map((id) => CONTENT_TYPES.find((c) => c.id === id)?.label ?? "")
            .filter(Boolean);
          const platformList = d.platforms.join(", ");
          const contentPart =
            contentLabels.length > 0
              ? `Criação de ${contentLabels.join(", ").toLowerCase()}`
              : "Criação de conteúdo";
          return `${contentPart} para as plataformas ${platformList}, com um total de ${d.totalPieces} peças por mês, divididas de acordo com a necessidade da marca.`;
        },
        additionalParagraphsFn: (d) => {
          if (d.auxiliaryServices.length === 0) return [];
          const labels = d.auxiliaryServices
            .map((id) => AUXILIARY_SERVICES.find((s) => s.id === id)?.label ?? "")
            .filter(Boolean);
          return [`Serviços complementares inclusos: ${labels.join(", ")}.`];
        },
      },
      {
        type: "static-text",
        sectionTitle: "Do Valor e Pagamento",
        textFn: (d) =>
          `Pelos serviços prestados, o CONTRATANTE pagará a CONTRATADA o valor mensal de ${formatBRLPdf(d.monthlyPrice)}, com vencimento todo dia ${d.paymentDueDay} de cada mês.`,
        additionalParagraphsFn: (d) => {
          if (d.pixKey !== null && d.pixKey!.trim().length > 0) {
            return [`O pagamento será realizado via PIX, utilizando a chave: ${d.pixKey}.`];
          }
          return ["A forma de pagamento será definida em comum acordo entre as partes."];
        },
      },
      {
        type: "clauses-section",
        sectionTitle: "Das Cláusulas Especiais",
        clausesPath: "clauses",
        clauses: [
          {
            key: "revision",
            title: "Limite de Revisões",
            textFn: (d) => {
              const c = d.clauses.revision;
              let text = `Cada peça criativa terá direito a até ${numExt(c.maxRevisions)} revisão(ões) sem custo adicional, com prazo de ${numExt(c.adjustmentDays)} dia(s) útil(eis) para o CONTRATANTE enviar o pedido de ajuste após a entrega.`;
              if (c.chargeExtra) {
                text += c.extraValue > 0
                  ? ` Revisões excedentes serão cobradas no valor de ${formatBRLPdf(c.extraValue)} por revisão, mediante aprovação prévia do CONTRATANTE.`
                  : ` Revisões excedentes serão orçadas e cobradas separadamente, mediante aprovação prévia do CONTRATANTE.`;
              }
              return text;
            },
          },
          {
            key: "approval",
            title: "Prazo de Aprovação",
            textFn: (d) => {
              const { deadlineDays } = d.clauses.approval;
              return `O CONTRATANTE terá o prazo de ${numExt(deadlineDays)} dia(s) útil(eis) para aprovar ou solicitar revisões do material entregue. Decorrido o prazo sem manifestação, o material será considerado automaticamente aprovado e a CONTRATADA estará autorizada a realizar a publicação.`;
            },
          },
          {
            key: "scopeExtras",
            title: "Extras Fora do Escopo",
            textFn: () =>
              "Demandas que extrapolem o escopo definido neste contrato serão orçadas separadamente e executadas somente após aprovação formal e por escrito do CONTRATANTE. A ausência de aprovação prévia desobriga a CONTRATADA de executar a demanda.",
          },
          {
            key: "cancellation",
            title: "Multa por Cancelamento",
            textFn: (d) => {
              const { noticeDays, penaltyPercent } = d.clauses.cancellation;
              return `Em caso de rescisão antecipada por qualquer das partes com aviso prévio inferior a ${numExt(noticeDays)} dia(s), será devida multa equivalente a ${penaltyPercent}% (${numExt(penaltyPercent)} por cento) do valor mensal vigente, a ser paga pela parte que descumpriu o prazo.`;
            },
          },
          {
            key: "filesPayment",
            title: "Arquivos Editáveis Após Pagamento",
            textFn: () =>
              "Os arquivos editáveis (fontes abertas, arquivos-fonte) das peças produzidas serão entregues ao CONTRATANTE somente após a quitação integral de todos os valores devidos. A CONTRATADA poderá reter os arquivos enquanto houver pendência financeira.",
          },
        ],
      },
      {
        type: "static-text",
        sectionTitle: "Da Vigência",
        textFn: (d) => {
          const months = d.durationMonths;
          const monthsExt = months === 3 ? "três" : months === 6 ? "seis" : "doze";
          return `O presente contrato terá vigência de ${months} (${monthsExt}) meses, contados a partir da data de assinatura, podendo ser renovado mediante acordo entre as partes.`;
        },
      },
      {
        type: "static-text",
        sectionTitle: "Do Foro",
        text: "As partes elegem o foro da comarca do domicílio do CONTRATANTE para dirimir quaisquer dúvidas ou controvérsias oriundas deste contrato.",
      },
    ],
  },
};
