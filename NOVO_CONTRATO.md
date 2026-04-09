# Como criar um novo tipo de contrato

Para adicionar um novo contrato ao SocialDoc você precisa de **1 arquivo de config** + **1 linha no index**.

---

## Passo 1 — Crie o arquivo de config

Crie `src/lib/contracts/meu-novo-contrato.ts` com a estrutura abaixo.

```typescript
import type { GenericContractTypeConfig } from "@/types/contract-engine";
import type { DocType } from "@/types/contract";

function isDocValid(docType: DocType | null, doc: string): boolean {
  if (docType === null) return false;
  if (docType === "nao-fornecer") return true;
  return doc.trim().length > 0;
}

export const meuContratoConfig: GenericContractTypeConfig = {
  id: "meu-contrato",           // único, usado em URLs e storage
  name: "Nome do Contrato",     // exibido no seletor
  description: "Descrição curta que aparece no card do seletor.",
  icon: "Package",              // "Package" ou "LayoutDashboard" (lucide-react)

  steps: [
    // ── Dados do prestador (padrão em todos os contratos) ──────────────────
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

    // ── Dados do cliente (padrão em todos os contratos) ────────────────────
    {
      key: "client",
      title: "Dados do cliente",
      heading: "Dados do seu cliente",
      subheading: "Nome completo ou razão social do cliente.",
      validate: (d) =>
        d.clientName.trim().length > 0 &&
        isDocValid(d.clientDocType, d.clientDoc),
      fields: [
        { type: "text", field: "clientName", label: "Nome completo ou razão social", placeholder: "Ex: Empresa XYZ LTDA", autoFocus: true },
        { type: "document", docTypeField: "clientDocType", docField: "clientDoc", label: "Documento" },
      ],
    },

    // ── Seus steps customizados aqui ───────────────────────────────────────
    // (ver referência de campos abaixo)

    // ── Steps finais obrigatórios ──────────────────────────────────────────
    { key: "review",   title: "Resumo",       validate: () => true, fields: [], builtIn: "review" },
    { key: "download", title: "Seu contrato", validate: () => true, fields: [], builtIn: "download" },
  ],

  pdf: {
    title: "Contrato de Prestação de Serviços\nde [Tipo]",
    sections: [
      { type: "parties", sectionTitle: "Das Partes" },

      // Suas seções customizadas aqui (ver referência abaixo)

      {
        type: "static-text",
        sectionTitle: "Do Foro",
        text: "As partes elegem o foro da comarca do domicílio do CONTRATANTE para dirimir quaisquer dúvidas ou controvérsias oriundas deste contrato.",
      },
    ],
  },
};
```

---

## Passo 2 — Registre no index

Abra `src/lib/contracts/index.ts` e adicione uma linha:

```typescript
import { meuContratoConfig } from "./meu-novo-contrato";

export const CONTRACT_TYPES: GenericContractTypeConfig[] = [
  socialMediaMonthlyConfig,
  packageArtsConfig,
  meuContratoConfig, // ← adicione aqui
];
```

Pronto. O seletor, formulário, resumo e PDF são gerados automaticamente.

---

## Referência: Tipos de campo (`FieldDef`)

### `text` — input de texto livre
```typescript
{
  type: "text",
  field: "freelancerName",
  label: "Nome completo",
  placeholder: "Ex: Maria Silva",
  autoFocus: true,                        // opcional
  renderWhen: (d) => d.pixKey !== null,   // opcional: exibe condicionalmente
}
```

### `number` — stepper com +/−
```typescript
{
  type: "number",
  field: "totalPieces",
  label: "Quantidade de peças",
  min: 1,
  suffix: (v) => v === 1 ? "peça" : "peças",  // string estática ou função
  prefix: "Até",                               // opcional
}
```

### `money` — input numérico com prefixo R$
```typescript
{
  type: "money",
  field: "monthlyPrice",
  label: "Valor mensal",
  placeholder: "1500",
  step: 50,
}
```

### `multiselect` — chips de seleção múltipla
```typescript
{
  type: "multiselect",
  field: "platforms",
  label: "Plataformas",
  options: [
    { id: "instagram", label: "Instagram" },
    { id: "tiktok",    label: "TikTok" },
  ],
  emptyHint: "Selecione ao menos uma plataforma.",  // opcional
}
```

### `select` — botões de seleção única
```typescript
{
  type: "select",
  field: "durationMonths",
  label: "Duração",
  options: [
    { value: 3,  label: "3 meses" },
    { value: 6,  label: "6 meses" },
    { value: 12, label: "12 meses" },
  ],
}
// Use "__null__" como value para representar null:
{ value: "__null__", label: "Outra forma" }
```

### `select-described` — select com descrição abaixo do label
```typescript
{
  type: "select-described",
  field: "packagePaymentType",
  label: "Forma de pagamento",
  options: [
    { value: "split",      label: "50% + 50%",        description: "Metade no início, metade na entrega" },
    { value: "upfront",    label: "100% no início",    description: "Pagamento integral antes de começar" },
    { value: "onDelivery", label: "100% na entrega",   description: "Pagamento integral ao receber os arquivos" },
  ],
}
```

### `document` — seletor CPF / CNPJ / Não fornecer
```typescript
{
  type: "document",
  docTypeField: "freelancerDocType",
  docField: "freelancerDoc",
  label: "Documento",
}
```

### `clause` — bloco de cláusula com toggle e subcampos
```typescript
{
  type: "clause",
  clausePath: "clauses.revision",   // dot-notation dentro de ContractData
  title: "Limite de revisões",
  description: "Quantas vezes o cliente pode pedir alterações?",
  insight: "Texto explicativo exibido em destaque para o usuário.",
  subFields: [
    {
      type: "number",
      field: "maxRevisions",
      label: "Máximo de revisões por peça",
      min: 1,
      suffix: (v) => v === 1 ? "revisão" : "revisões",
    },
    {
      type: "select",
      field: "chargeExtra",
      label: "Cobrar por revisão extra?",
      options: [{ value: true, label: "Sim" }, { value: false, label: "Não" }],
    },
    {
      type: "money",
      field: "extraValue",
      label: "Valor por revisão extra",
      showWhen: { field: "chargeExtra", equals: true },  // exibe condicionalmente
    },
  ],
}
```

**`clausePath` aponta para um objeto em `ContractData` com `{ enabled: boolean, ...subcampos }`.**
Use `"clauses.nomeClausula"` para cláusulas do contrato mensal ou crie um novo objeto no tipo (ex: `"meuContratoClauses.nomeClausula"`).

---

## Referência: Tipos de seção PDF (`PdfSectionDef`)

### `parties` — bloco CONTRATANTE / CONTRATADA
```typescript
{ type: "parties", sectionTitle: "Das Partes" }
```

### `static-text` — parágrafo de texto
```typescript
// Texto estático:
{
  type: "static-text",
  sectionTitle: "Do Foro",
  text: "As partes elegem o foro da comarca...",
}

// Texto dinâmico:
{
  type: "static-text",
  sectionTitle: "Do Objeto",
  textFn: (d) => `A CONTRATADA produzirá ${d.totalPieces} peças por mês.`,
  additionalParagraphsFn: (d) => {           // parágrafos extras opcionais
    if (!d.auxiliaryServices?.length) return [];
    return [`Serviços complementares: ${d.auxiliaryServices.join(", ")}.`];
  },
}
```

### `clauses-section` — seção de cláusulas (renderiza só as habilitadas)
```typescript
{
  type: "clauses-section",
  sectionTitle: "Das Cláusulas Especiais",
  clausesPath: "clauses",         // dot-notation para o objeto de cláusulas em ContractData
  clauses: [
    {
      key: "revision",            // deve bater com a chave dentro do objeto
      title: "Limite de Revisões",
      textFn: (d) => {
        const c = d.clauses.revision;
        return `Cada peça terá direito a ${c.maxRevisions} revisão(ões)...`;
      },
    },
  ],
}
```

---

## Precisa de campos novos em ContractData?

Se o novo contrato precisar de dados que ainda não existem (ex: `serviceDays`, `scopeItems`), adicione como campos **opcionais** em `src/types/contract.ts`:

```typescript
export interface ContractData {
  // ... campos existentes ...

  // Meu novo contrato
  meuCampo?: string;
  meuNumero?: number;
  meuContratoClauses?: MeuContratoClauses;
}
```

E inicialize os defaults no `contract-store.ts` dentro de `DEFAULT_DATA`.

---

## Exemplos de referência

Veja os contratos já implementados para se inspirar:

- `src/lib/contracts/social-media-monthly.ts` — contrato recorrente com 5 cláusulas
- `src/lib/contracts/package-arts.ts` — contrato pontual com seletor de tipo de pagamento
