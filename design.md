# SocialDoc — Design System

Guia de referência para todas as páginas e componentes do SocialDoc.

---

## Paleta de Cores

| Token | Valor | Uso |
|---|---|---|
| `--color-dark` | `#050b18` | Background principal (hero, footer, seções dark) |
| `--color-dark-mid` | `#081020` | Gradient end, backgrounds secundários dark |
| `--color-dark-card` | `#0d1525` | Cards e dropdowns em contexto dark |
| `--color-accent` | `#d4ff00` | Cor de destaque principal — CTAs, badges, ícones em dark |
| `--color-cream` | `#f5f3ef` | Background de seções claras (alternância com dark) |
| `--color-white` | `#ffffff` | Texto primário em dark, cards em cream |

### Opacidades padrão (texto em dark)
- Texto primário: `#ffffff`
- Texto secundário: `rgba(255,255,255,0.55)`
- Texto terciário / muted: `rgba(255,255,255,0.35)`
- Bordas sutis: `rgba(255,255,255,0.07)` a `rgba(255,255,255,0.15)`

### Opacidades padrão (texto em cream/light)
- Texto primário: `#050b18`
- Texto secundário: `rgba(5,11,24,0.55)`
- Texto terciário / muted: `rgba(5,11,24,0.35)`
- Bordas sutis: `rgba(5,11,24,0.08)`

---

## Tipografia

### Fontes
```tsx
// layout.tsx — importação via next/font/google
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});
```

| Fonte | Variável CSS | Uso |
|---|---|---|
| Bricolage Grotesque | `var(--font-display)` | Headlines, títulos de seção, números grandes |
| DM Sans | `var(--font-sans)` | Corpo de texto, descrições, labels, UI |

### Escala tipográfica de headlines

```tsx
// Hero / página principal
className="text-5xl md:text-[5.5rem] font-extrabold leading-[0.92] tracking-tight"
style={{ fontFamily: "var(--font-display)" }}

// Títulos de seção
className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight"
style={{ fontFamily: "var(--font-display)" }}

// Sub-headlines / card titles
className="text-xl font-bold"
style={{ fontFamily: "var(--font-display)" }}
```

---

## Layout e Estrutura

### Alternância de seções
A página alterna entre seções dark e cream para criar ritmo visual:

```
Hero          → dark  (#050b18)
Como funciona → cream (#f5f3ef)
Contrato      → dark  (#050b18)
Pricing       → cream (#f5f3ef)
CTA final     → dark  (#050b18)
Footer bar    → #020810
```

### Container e padding
```tsx
// Container padrão
className="mx-auto max-w-5xl px-4"

// Container largo (hero, seções com grid)
className="mx-auto max-w-6xl px-4"

// Padding vertical de seção
className="py-24"  // padrão
className="py-28 md:py-40"  // hero
```

### Grid de duas colunas (texto + visual)
```tsx
className="grid md:grid-cols-2 gap-16 items-center"
// ou assimétrico:
className="grid md:grid-cols-[1.15fr,0.85fr] gap-12 lg:gap-20 items-center"
```

---

## Componentes

### Badge / pill de seção
Pequena tag que identifica a seção. Existe em dois estilos:

```tsx
// Em dark (acento lime)
<div
  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-6"
  style={{
    background: "rgba(212,255,0,0.1)",
    border: "1px solid rgba(212,255,0,0.22)",
    color: "#d4ff00",
  }}
>
  Label da seção
</div>

// Em cream (dark sólido)
<div
  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-5"
  style={{ background: "#050b18", color: "#d4ff00" }}
>
  Label da seção
</div>
```

### CTA Principal (botão primário)
```tsx
<button
  className="inline-flex items-center justify-center gap-2.5 rounded-2xl px-10 py-4 text-base font-bold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
  style={{
    background: "#d4ff00",
    color: "#050b18",
    boxShadow: "0 0 40px rgba(212,255,0,0.2)",
  }}
>
  Texto do botão
  <ArrowRight className="h-4 w-4" />
</button>
```

### CTA Secundário (outline)
```tsx
<div
  className="inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-medium"
  style={{
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.55)",
  }}
>
  <Clock className="h-4 w-4" />
  Texto
</div>
```

### Card em dark
```tsx
<div
  className="rounded-2xl p-4 transition-all duration-200 hover:border-white/20"
  style={{
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
  }}
>
  ...
</div>
```

### Card em cream (branco)
```tsx
<div
  className="rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1"
  style={{
    background: "#ffffff",
    border: "1px solid rgba(5,11,24,0.08)",
    boxShadow: "0 2px 20px rgba(5,11,24,0.05)",
  }}
>
  ...
</div>
```

### Ícone com fundo (em dark)
```tsx
<div
  className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center"
  style={{ background: "rgba(212,255,0,0.12)" }}
>
  <IconName className="h-4 w-4" style={{ color: "#d4ff00" }} />
</div>
```

### Ícone com fundo (em cream → dark sólido)
```tsx
<div
  className="w-12 h-12 rounded-2xl flex items-center justify-center"
  style={{ background: "#050b18" }}
>
  <IconName className="h-5 w-5" style={{ color: "#d4ff00" }} />
</div>
```

---

## Efeitos visuais

### Grid pattern (background sutil)
Aplicar nas seções dark para dar textura:
```tsx
<div
  className="absolute inset-0 opacity-[0.035] pointer-events-none"
  style={{
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
    backgroundSize: "64px 64px",
  }}
/>
```

### Glow orb (brilho ambiente)
```tsx
<div
  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full pointer-events-none animate-glow-pulse"
  style={{
    background: "radial-gradient(ellipse, rgba(212,255,0,0.06) 0%, transparent 65%)",
    filter: "blur(40px)",
  }}
/>
```

### Animações CSS disponíveis (globals.css)
| Classe | Efeito |
|---|---|
| `animate-hero-float` | Flutua suavemente com leve rotação (documentos, mockups) |
| `animate-chip-float` | Flutua suavemente sem rotação (chips, badges) |
| `animate-chip-float-delayed` | Idem, com delay de 1.2s |
| `animate-glow-pulse` | Pulsa a opacidade (glow orbs) |
| `animate-slide-up` | Entra de baixo com fade (one-shot) |

---

## Ícones

Usar exclusivamente **Lucide React** (`lucide-react`). Ícones devem ser **flat** — sem emojis em contextos de UI.

```tsx
import { Shield, ArrowRight, Clock, FileCheck, Banknote, RefreshCw, XCircle, Copyright, CalendarDays, Scale } from "lucide-react";
```

Tamanhos padrão:
- Em badges/pills: `h-3.5 w-3.5`
- Em botões: `h-4 w-4`
- Em cards de feature (fundo pequeno): `h-4 w-4`
- Em cards de step (fundo grande): `h-5 w-5`
- Em navbar/logo: `h-5 w-5`

---

## Navbar

- Background: `rgba(5,11,24,0.85)` com `backdrop-blur-md`
- Border bottom: `1px solid rgba(255,255,255,0.07)`
- Logo: branco com ícone em `#d4ff00`
- Links: `rgba(255,255,255,0.45)` → `#ffffff` no ativo
- CTA: `background: #d4ff00`, `color: #050b18`, `rounded-xl`
- Dropdown: `background: #0d1525`, bordas em `rgba(255,255,255,0.1)`

---

## PDF (plano gratuito)

Em vez de marca d'água diagonal, o contrato gratuito exibe duas faixas amarelas fixas em todas as páginas:

- **Cor:** `#FFD600`
- **Topo:** "Versão de avaliação gratuita — Gerada pelo plano gratuito do SocialDoc."
- **Rodapé:** "Assine o plano ilimitado em socialdoc.com.br para gerar contratos sem esta faixa."
- Texto em `Helvetica-Bold`, `fontSize: 7`, uppercase, centralizado
- Ambas com `fixed: true` para aparecer em todas as páginas

---

## Border radius

| Contexto | Valor |
|---|---|
| Botões principais | `rounded-2xl` (16px) |
| Cards grandes | `rounded-3xl` (24px) |
| Cards médios / chips | `rounded-2xl` (16px) |
| Ícones fundos pequenos | `rounded-xl` (12px) |
| Badges / pills | `rounded-full` |
| Dropdown / popover | `rounded-2xl` (16px) |

---

## Princípios gerais

1. **Escuro como base** — hero e seções de destaque são dark. Cream é usado para "respirar" e contrastar.
2. **Um único acento** — `#d4ff00` é a única cor de destaque. Não adicionar secundárias sem motivo.
3. **Tipografia como hierarquia** — Bricolage Grotesque só para títulos. DM Sans para todo o resto.
4. **Ícones flat** — Lucide React em todos os contextos de UI. Sem emojis em cards ou botões.
5. **Hover sutil** — `hover:scale-[1.03]` em botões, `hover:-translate-y-1` em cards. Sem efeitos exagerados.
6. **Grid pattern + glow** — Toda seção dark leva o grid pattern de fundo e pelo menos um glow orb para dar profundidade.
7. **CTA em toda seção** — Cada seção deve levar o usuário para a próxima ação, mesmo que sutilmente.
