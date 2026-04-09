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
  { id: "staticPost", label: "Arte estática (feed)", unit: "por mês" },
  { id: "carousel", label: "Carrossel", unit: "por mês" },
  { id: "reels", label: "Reels / TikTok / Shorts", unit: "por mês" },
  { id: "stories", label: "Stories", unit: "por semana" },
  { id: "feedVideo", label: "Vídeo no feed", unit: "por mês" },
  { id: "live", label: "Live", unit: "por mês" },
];

export const AUXILIARY_SERVICES = [
  { id: "respondComments", label: "Responder comentários e DMs" },
  { id: "captions", label: "Criação de legendas e copies" },
  { id: "hashtags", label: "Pesquisa de hashtags" },
  { id: "scheduling", label: "Agendamento de publicações" },
  { id: "report", label: "Relatório mensal de desempenho" },
  { id: "visualIdentity", label: "Criação de identidade visual" },
];

export const PACKAGE_ART_TYPES = [
  { id: "staticArt", label: "Arte estática" },
  { id: "carousel", label: "Carrossel" },
  { id: "reels", label: "Reels / Edição curta" },
  { id: "longVideo", label: "Edição de vídeo longo" },
  { id: "stories", label: "Stories" },
  { id: "motion", label: "Motion / Animação" },
] as const;

export const STEP_TITLES = [
  "Seus dados",
  "Dados do cliente",
  "Plataformas",
  "Escopo dos serviços",
  "Pagamento",
  "Cláusula: Revisões",
  "Cláusula: Aprovação",
  "Cláusula: Extras",
  "Cláusula: Cancelamento",
  "Cláusula: Arquivos",
  "Duração",
  "Resumo",
  "Seu contrato",
] as const;

export const TOTAL_STEPS = STEP_TITLES.length;
