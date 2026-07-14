# RFS Grupo Holding — website design contract (v1)

Fable design session, 2026-07-13. This file is the contract for a Sonnet implementation
session. Scope: ONE production-grade static page + one SVG asset. Read PRODUCT.md first.

Deliverables:
- `/root/rfs/index.html` — self-contained (inline CSS/JS; GSAP + ScrollTrigger via CDN,
  with a `<!-- TODO(owner): vendor GSAP locally before production -->` note)
- `/root/rfs/assets/logo.svg` — the recreated brand mark (vector, per the identity board's
  own instruction "utilizar somente arquivos vetoriais para web")
- `/root/rfs/screenshots/` — QA renders (see gates at the bottom)

Nothing else. No deploy, no PM2, no Caddy.

---

## 1. Brand mark — Concept 1 "Horizonte Protegido" (chosen from the identity studies)

Why this one: it is the only concept that says *energy* (a sun), *horizon* (long-term
holding), and *protection* (the dome) in one silhouette; it scales to a favicon; and it
rhymes with Sunergies' solar identity without copying it. (Runner-up was Concept 6, the
continuous-line monogram — revisit only if the owner asks.)

Geometry (`assets/logo.svg`, `viewBox="0 0 200 120"`):
- **Dome/sun**: the upper half of a circle, r=58, center (100,74), flat chord at y=74 —
  path `M42,74 A58,58 0 0 1 158,74 Z`. Fill: vertical gradient `gold-hot` (top) →
  `gold` (60%) → `gold-deep` (bottom) — metallic, not flat.
- **Horizon swoosh**: a wider, shallow arc passing under the dome with a 6px air gap:
  path `M12,86 Q100,66 188,86`, stroke `gold`, stroke-width 5, round caps, no fill.
  It must extend past the dome on both sides (the horizon is larger than the sun).
- No text inside the SVG. The wordmark is live text next to/below the mark:
  **RFS** in Archivo, weight 900, `font-stretch:125%`, and beneath it
  **HOLDING GROUP** / **GRUPO HOLDING** (i18n-swapped), 11–12px, letter-spacing .3em,
  weight 600.
- Favicon: the mark alone on black (inline `<link rel="icon">` with an SVG data URI is fine).

QA: at 32px and at 240px the silhouette must read as Concept 1 — gold dome floating above
a swooshing horizon line.

## 2. Tokens

```css
:root{
  --black:      oklch(12% 0.008 90);   /* page bg — warm near-black, not #000 flat */
  --black-deep: oklch(8% 0.006 90);    /* hero bg + deepest bands */
  --surface:    oklch(16% 0.012 92);   /* raised rows/plates */
  --line:       oklch(30% 0.025 95);   /* hairlines on black */
  --text:       oklch(93% 0.012 95);   /* body on black */
  --muted:      oklch(70% 0.02 95);    /* secondary on black — verify ≥4.5:1 */
  --gold:       #D4AF37;               /* ≈ oklch(75% 0.118 96) — identity-locked */
  --gold-hot:   oklch(85% 0.115 98);   /* specular / shimmer peak */
  --gold-deep:  oklch(58% 0.10 92);    /* shadowed metal */
  --ink-on-gold:oklch(14% 0.01 90);    /* text on the drenched band */
  --ease: cubic-bezier(.16,1,.3,1);
  --z-header:40; --z-toggle:50;
}
```

Gold discipline: gold is light hitting metal — the mark, lines, taps, underlines, numbers,
one drenched band, focus rings. Never long gold paragraphs; body copy is `--text`.

## 3. Typography

One family: **Archivo variable** (same Google Fonts link as the Sunergies site — copy it:
`family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900`). The width axis IS
the group's typographic system: **the holding speaks expanded**.

- Display / H1 / section titles: `font-stretch:125%`, weight 850–900, tight-but-legal
  letter-spacing (≥ -0.02em). H1 `clamp(2.8rem, 7vw, 5.25rem)`, `text-wrap:balance`.
- Wordmark "RFS" in hero: same voice, `clamp(4.5rem, 11vw, 6rem)` — wait, ceiling: cap at
  `clamp(4rem, 10vw, 5.9rem)`.
- Body: normal width, weight 400–450, 16–17px, line-height 1.65 (light-on-dark needs air),
  max-width 62ch.
- Tracked caps (`.22–.3em`) are reserved for exactly three things: "HOLDING GROUP" under
  the wordmark, nav links, and unit names in the ecosystem. No eyebrow labels above
  section headings anywhere.

## 4. i18n — EN default, PT toggle

- Header right: `EN | PT` toggle. Active language in `--gold`, inactive `--muted`;
  a 1px gold underline slides between them (transform keyframe, not transition-gated
  content). Click swaps every `[data-i18n]` node from an inline JS dictionary
  (`I18N = { en: {...}, pt: {...} }`, keys per copy block below), sets
  `document.documentElement.lang`, swaps `<title>` + meta description, persists to
  `localStorage('rfs-lang')`, restores on load. Default: `en`.
- Swap animation: the `<main>` content crossfades via a 180ms CSS *keyframe*
  (fade to .0 → swap → fade in). User-triggered only.
- All copy below is final. Do not machine-translate anything; both columns are written.

## 5. Page structure & copy

Single long-scroll page: Hero → Manifesto → Ecosystem → Flagship (gold band) → Contact →
Footer. Header is fixed, transparent over the hero, gains a `--black-deep` backdrop after
scrolling past the hero (class toggled by ScrollTrigger).

Nav (anchors): EN `Manifesto · Ecosystem · Sunergies · Contact` /
PT `Manifesto · Ecossistema · Sunergies · Contato`. Left: mark (24px) + "RFS".

### 5.1 Hero — the mark, alive (100svh, bg --black-deep)

Composition, centered column: the logo mark large (dome ~180px wide) → wordmark **RFS** →
tracked "HOLDING GROUP"/"GRUPO HOLDING" → H1 → sub-line → scroll cue (thin gold vertical
line, 32px, pulsing keyframe).

| key | EN | PT |
|---|---|---|
| hero.h1 | Building the future of energy. | Construindo o futuro da energia. |
| hero.sub | Global vision, local operation. | Visão global, operação local. |
| hero.cue | Scroll | Role |

Behind the composition: a faint horizon glow — a radial gradient in `--gold-deep` at 8%
opacity rising from the bottom edge, plus a 1px horizon line at ~78% viewport height that
the entrance animation draws (see §6).

### 5.2 Manifesto (bg --black)

Large-type statement, one idea per line, revealed line by line. Max-width ~20ch per line
visually (break with `<br>` or spans), display width, weight 800, `--text`; the words
marked ⟨gold⟩ below get `--gold`.

| key | EN | PT |
|---|---|---|
| man.l1 | One holding. | Uma holding. |
| man.l2 | An ⟨ecosystem⟩ of energy. | Um ⟨ecossistema⟩ de energia. |
| man.l3 | Built to operate for ⟨decades⟩, not quarters. | Feito para operar por ⟨décadas⟩, não trimestres. |
| man.p | RFS is the holding company behind Sunergies Group — structuring, governing and growing businesses across the energy value chain in Brazil: generation, government and corporate deals, electric mobility, digital energy assets, media, health and R&D. | A RFS é a holding por trás do Sunergies Group — estruturando, governando e expandindo negócios em toda a cadeia da energia no Brasil: geração, contratos públicos e corporativos, mobilidade elétrica, ativos digitais de energia, mídia, saúde e P&D. |

### 5.3 Ecosystem (bg --black-deep) — the living constellation

This section must clearly outclass the earlier Sunergies unifilar mockup: same rigor,
plus depth, interactivity and motion.

| key | EN | PT |
|---|---|---|
| eco.h2 | The ecosystem | O ecossistema |
| eco.intro | RFS governs. Sunergies Group operates. Ten business units carry the energy to market. | A RFS governa. O Sunergies Group opera. Dez unidades de negócio levam a energia ao mercado. |

**Backdrop**: a dotted **Brazil map** in gold — implement as an inline SVG: a dot grid
(3px circles, 14px pitch) clipped by a simplified Brazil silhouette path, `--gold` at 10%
opacity, positioned right-of-center, ~55% section width, parallax-drifting slightly on
scroll (GSAP, ±20px). 6–8 randomly chosen dots pulse brighter on staggered infinite
keyframes (map "alive"). Use any accurate simplified Brazil path (draw it; do not hotlink).

**Structure** (three tiers, gold connectors, orthogonal elbows — no curves):
- Tier 1: small plate `RFS` (mark 20px + letters) top-center.
- Tier 2: plate `SUNERGIES GROUP` below it, joined by a vertical gold line.
- Tier 3, desktop (≥880px): the 10 units in two balanced columns of 5 flanking a central
  vertical bus that drops from the Sunergies plate; each unit connects with an elbow line
  (vertical drop → horizontal arm → 6px gold tap dot at the unit). All connector lines are
  SVG strokes drawn in by `stroke-dashoffset` scrubbed on scroll.
- Mobile (<880px): single-column riser — bus on the left at 10px, units stacked, same
  grammar as the approved Sunergies mobile mockup.

**Unit rows** (typographic index — NOT cards, no icons): unit name in tracked caps 15px
weight 700 `--text`; on the same line, right-aligned, a one-word domain tag in `--muted`
12px. Hover/focus/tap expands a sub-item list (grid-rows 0fr→1fr transition — fine here,
never QA'd headless) with the canonical items below; expanded items are 13.5px `--muted`,
each prefixed by a 10px gold tick. On touch, tap toggles. One open at a time.

Canonical units + sub-items (unit names never translate; sub-items do):

| Unit | tag EN/PT | sub-items EN | sub-items PT |
|---|---|---|---|
| Usinas de Investimento | Generation / Geração | Global investment funds | Fundos globais de investimento |
| SunGov Deals | Government / Governo | PPAs · Distributed generation · Own plants · Energy efficiency | PPAs · Geração distribuída · Usinas próprias · Eficiência energética |
| Sun News | Media / Mídia | News · Blog · Internal marketing · Podcast | Notícias · Blog · Endomarketing · Podcast |
| SunCashback | Benefits / Benefícios | Cashback & benefits · New-contract incentives · Conversion into discounts or new investments | Cashback e benefícios · Incentivo a novas contratações · Conversão em descontos ou novos investimentos |
| SunLife | Health / Saúde | Health plan · Telemedicine · Medical services · Sustainability & social responsibility | Plano de saúde · Telemedicina · Serviços médicos · Sustentabilidade e responsabilidade social |
| SunPower Deals | Corporate / Corporativo | PPAs · Distributed generation · Own plants | PPAs · Geração distribuída · Usinas próprias |
| SunSquad | Partners / Parceiros | Partner & ambassador network · Referral programs · Mentoring & specialized teams | Rede de parceiros e embaixadores · Programas de indicação · Mentoria e times especializados |
| SunChargers | Mobility / Mobilidade | EV-charging network · Convenience store (concept) · Clean-energy integration | Rede de eletropostos · Loja de conveniência (conceito) · Integração com energia limpa |
| Sundex | Digital / Digital | Tokenized solar plants · Fractional tokens · Blockchain · Liquidity & democratized investment | Usinas solares tokenizadas · Tokens fracionados · Blockchain · Liquidez e democratização do investimento |
| P&DI | Innovation / Inovação | Research & development · Energy innovation · In-person courses & efficiency · Carbon credits | Pesquisa e desenvolvimento · Inovação energética · Cursos presenciais e eficiência · Crédito de carbono |

### 5.4 Flagship — Sunergies (THE gold-drenched band; bg --gold, all text --ink-on-gold)

The one full-gold moment on the page. It enters with a wipe (see §6). Facts here are the
only numbers on the site — they are Sunergies', verified.

| key | EN | PT |
|---|---|---|
| flag.h2 | Flagship: Sunergies | Carro-chefe: Sunergies |
| flag.p | Since 2014, Sunergies has structured and executed solar projects end-to-end — modeling, execution, grid approval and operation — with more than 500 MW across Brazil. | Desde 2014, a Sunergies estrutura e executa projetos solares de ponta a ponta — modelagem, execução, homologação e operação — com mais de 500 MW pelo Brasil. |
| flag.s1n / s1l | 2014 / founded | 2014 / fundação |
| flag.s2n / s2l | 500+ MW / structured | 500+ MW / estruturados |
| flag.s3n / s3l | End-to-end / delivery | Ponta a ponta / entrega |
| flag.cta | Visit sunergies.com.br → | Visitar sunergies.com.br → |

The three stats sit on one hairline-separated row (numbers display-width 850, labels small
caps) — not the hero-metric card template; no boxes, just type on gold with 1px
`--ink-on-gold` hairlines between them. CTA is a black button (bg `--ink-on-gold`, text
`--gold`), linking to `https://sunergies.com.br`.

### 5.5 Contact (bg --black-deep) + footer

| key | EN | PT |
|---|---|---|
| con.h2 | Talk to the holding | Fale com a holding |
| con.p | Institutional matters, partnerships and investment. | Assuntos institucionais, parcerias e investimento. |
| con.cta | Get in touch | Entrar em contato |
| foot.line | RFS Grupo Holding — Brasil · © 2026 | RFS Grupo Holding — Brasil · © 2026 |

CTA is a gold-outline button wired to `href="#"` with
`<!-- TODO(owner): real contact email/WhatsApp — do not invent one -->`.
Footer also repeats the small mark and the EN|PT toggle.

## 6. Motion choreography (the "alive" requirement — implement all of it)

Library: GSAP + ScrollTrigger (CDN). **CSS keyframes or GSAP only — zero reliance on CSS
transitions for anything that must appear** (this VPS's headless QA freezes transitions;
hover-only transitions are exempt). Every effect below gets a
`prefers-reduced-motion: reduce` fallback: static, fully visible, infinite loops off.

1. **Entrance timeline** (once, on load, hero): black → horizon line draws across
   (scaleX 0→1, 0.9s, expo-out) → dome rises from behind the horizon (translateY 40px +
   clip-path reveal, 1.1s, overlapping −0.4s) → "RFS" letters rise with an 80ms stagger
   (clip-path inset bottom) → "HOLDING GROUP", H1, sub fade up (0.5s, stagger 120ms) →
   header + toggle fade in. Total ≤2.4s. First user scroll jumps the timeline to its end.
2. **Persistent life** (infinite, subtle): a specular shimmer sweeps across the dome every
   9s (a rotated white-to-transparent gradient strip, keyframed translateX, masked to the
   dome); the scroll cue pulses; the Brazil-map dots pulse (staggered `--i` delays); the
   drenched band's gold gets a barely-visible 12s luminance breathe (background-position
   on a large soft gradient). None of these move layout.
3. **Scroll reveals** (once each, ScrollTrigger at ~75% viewport): manifesto lines rise
   per-line (y 28px, 0.7s, stagger 110ms); ecosystem connectors draw (dashoffset, scrubbed
   over ~40% of the section's scroll); unit rows fade in staggered after their connector
   reaches them; gold band enters with a full-width wipe (::before scaleX 0→1 from left,
   0.8s, then content fades up); stats count up once (GSAP: 0→2014, 0→500).
4. **Micro**: nav links get a gold underline sweep on hover; unit rows highlight name →
   `--gold` on hover; buttons scale 0.98 on press. (Hover/press may use transitions.)
5. **Language flip**: 180ms crossfade keyframe on `<main>` around the dictionary swap.

No bounce. No elastic. Ease `--ease` or GSAP `expo.out` everywhere.

## 7. Known VPS QA quirks (from verified project memory — obey)

- Headless Playwright freezes CSS *transitions*; keyframes and GSAP run.
- Always cache-bust reloads with `?v=N`.
- Never `mix-blend-mode` on section-sized elements (paints white headless).
- Wait ~2–4s after load/scroll before screenshots (let entrance + reveals finish).
- QA at **1327×660** (owner's real window) and **390px** width.

## 8. QA gates (implementer must pass all before reporting done)

1. Screenshots: hero, manifesto, ecosystem, gold band, contact — at 1327×660 and 390px,
   in EN; hero + ecosystem again in PT (toggle works; PT copy renders exactly as §5).
   Save to `screenshots/`.
2. Language toggle: persists across reload (localStorage), swaps `<html lang>`, `<title>`,
   and every visible string; no mixed-language state.
3. Contrast: every text/background pair ≥4.5:1 — including `--muted` on `--black-deep`
   and everything on the gold band.
4. Reduced-motion pass (`emulateMedia`): page fully visible, no infinite animations.
5. No horizontal overflow at 390px; H1 and PT strings (longer) don't overflow at any width.
6. Logo silhouette check at 32px (favicon-size) and in the hero.
7. Ecosystem: all 10 units + sub-items verbatim from §5.3; connectors touch their taps;
   one-open-at-a-time expansion works by click.
8. No invented facts anywhere: the only numbers on the page are 2014 and 500+ MW.
