export const PLATFORMS = [
  "Instagram",
  "TikTok",
  "Facebook",
  "LinkedIn",
  "YouTube",
  "Pinterest",
  "X (Twitter)",
] as const;

export interface ContentType {
  id: string;
  label: string;
  unit: string; // "por mes" | "por semana"
}

export const CONTENT_TYPES: ContentType[] = [
  { id: "staticPost", label: "Arte estatica (feed)", unit: "por mes" },
  { id: "carousel", label: "Carrossel", unit: "por mes" },
  { id: "reels", label: "Reels / TikTok / Shorts", unit: "por mes" },
  { id: "stories", label: "Stories", unit: "por semana" },
  { id: "feedVideo", label: "Video no feed", unit: "por mes" },
  { id: "live", label: "Live", unit: "por mes" },
];

export const AUXILIARY_SERVICES = [
  { id: "respondComments", label: "Responder comentarios e DMs" },
  { id: "captions", label: "Criacao de legendas e copies" },
  { id: "hashtags", label: "Pesquisa de hashtags" },
  { id: "scheduling", label: "Agendamento de publicacoes" },
  { id: "report", label: "Relatorio mensal de desempenho" },
  { id: "visualIdentity", label: "Criacao de identidade visual" },
];

export const STEP_TITLES = [
  "Seus dados",
  "Dados do cliente",
  "Plataformas",
  "Escopo dos servicos",
  "Pagamento",
  "Clausula: Revisoes",
  "Clausula: Aprovacao",
  "Clausula: Extras",
  "Clausula: Cancelamento",
  "Clausula: Arquivos",
  "Duracao",
  "Seu contrato",
] as const;

export const TOTAL_STEPS = STEP_TITLES.length;
