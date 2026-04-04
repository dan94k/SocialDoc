export const PLATFORMS = [
  "Instagram",
  "TikTok",
  "Facebook",
  "LinkedIn",
  "YouTube",
  "Pinterest",
  "X (Twitter)",
] as const;

export interface ClauseConfig {
  id: keyof import("@/types/contract").ContractClauses;
  label: string;
  description: string;
  legalText: string;
}

export const CLAUSES: ClauseConfig[] = [
  {
    id: "revisionLimit",
    label: "Limite de revisoes",
    description: "2 revisoes por peca, extras cobradas a parte",
    legalText:
      "Cada peca criativa tera direito a ate 2 (duas) revisoes sem custo adicional. Revisoes excedentes serao cobradas a parte, mediante orcamento previo aprovado pelo CONTRATANTE.",
  },
  {
    id: "approvalDeadline",
    label: "Prazo de aprovacao",
    description: "2 dias uteis, sem resposta = aprovado",
    legalText:
      "O CONTRATANTE tera o prazo de 2 (dois) dias uteis para aprovar ou solicitar revisoes do material entregue. Decorrido o prazo sem manifestacao, o material sera considerado automaticamente aprovado.",
  },
  {
    id: "outOfScopeExtras",
    label: "Extras fora do escopo",
    description: "Orcados separadamente",
    legalText:
      "Demandas que extrapolem o escopo definido neste contrato serao orcadas separadamente e executadas somente apos aprovacao formal do CONTRATANTE.",
  },
  {
    id: "cancellationPenalty",
    label: "Multa por cancelamento",
    description: "Menos de 30 dias = multa de 20%",
    legalText:
      "Em caso de rescisao antecipada por qualquer das partes, com aviso previo inferior a 30 (trinta) dias, sera devida multa equivalente a 20% (vinte por cento) do valor mensal vigente.",
  },
  {
    id: "filesAfterPayment",
    label: "Arquivos apos pagamento",
    description: "Editaveis entregues apos quitacao",
    legalText:
      "Os arquivos editaveis (fontes abertas) das pecas produzidas serao entregues ao CONTRATANTE somente apos a quitacao integral de todos os valores devidos.",
  },
];

export const STEP_TITLES = [
  "Seu nome",
  "Nome do cliente",
  "Plataformas",
  "Valor mensal",
  "Dia de vencimento",
  "Clausulas",
  "Duracao do contrato",
  "Seu contrato",
] as const;

export const TOTAL_STEPS = STEP_TITLES.length;
