# RFS — v2 design contract: "The Crossing" (scrollytelling rebuild)

Fable design session, 2026-07-13. Contract for a Sonnet implementation session.
Reference (verified by flying through it headless): https://50-jahre-hitparade.ch/ — one
continuous 3D constellation; scroll pilots the camera; labels pass in parallax; a giant
ghosted marker sits center-screen; the background hue drifts as you travel. No sections.

Living-motion pass, 2026-07-13: Deepsee Commerce informed the interaction qualities only —
a cinematic entry, continuous ambient motion, pointer depth and distinct visual worlds.
Its ocean imagery, copy, sound gate and visual identity are not adopted.

v2 replaces the v1 sectioned page. **First step: `mkdir -p versions && cp index.html
versions/v1-sections.html`** (rollback point). PRODUCT.md, tokens, logo, i18n copy and
dictionary from v1 all carry over — reuse them verbatim unless stated below.

## The concept

The RFS site is one fixed-viewport scene: a gold constellation floating in black space.
The page body is a tall empty scroll track (~900vh); scrolling flies the camera forward
through the group's universe. Chapters are waypoints in the flight, not stacked sections.
DOM text overlays fade in/out synced to scroll progress. A giant ghosted watermark
(the reference's "1968" move) names where you are.

## Technology — deliberately NOT WebGL

Canvas 2D with a hand-rolled 3D projection (perspective divide), driven by one
requestAnimationFrame loop reading `scrollY` with lerp smoothing (factor ~0.08). No
Three.js, no GSAP required. ~30 lines of math:

- World: particles at (x, y, z), camera travels +z. Screen pos = `cx + x * f / (z - camZ)`,
  `cy + y * f / (z - camZ)` with `f ≈ 420` (focal). Cull behind-camera and far particles.
- Size & alpha scale with 1/(z - camZ). Nearby particles get a soft glow (radial gradient
  fill, cheap).
- **Field**: ~450 gold particles (`--gold` at varied alpha .15–.9, radius .5–2.5 world
  units), spread x ∈ [-600,600], y ∈ [-340,340], z ∈ [0, 9000]. Each particle has its own
  slow drift and twinkle phase. Connect up to two neighbors within ~170 world units with
  hairlines (precompute neighbor pairs once; don't O(n²) every frame).
- **Persistent life**: particles wrap through the depth field, solar-current lines flow
  across the viewport, and pointer position eases into a restrained parallax offset. Large
  faceted solar planes frame and transform the physical scene across chapters. The hero
  gets a breathing solar halo, the group chapter gets orbiting structures, unit leader
  lines carry a moving pulse, and the arrival chapter redraws the horizon.
- **Entry**: a focused black curtain introduces the RFS mark, horizon line and an
  `ENTER THE ECOSYSTEM` / `ENTRAR NO ECOSSISTEMA` action. Activating it reveals the living
  scene and enables the experience controls. Keyboard entry moves focus into the chapter
  rail; reduced-motion users bypass the cinematic layer entirely.
- **Named nodes** (RFS, SUNERGIES GROUP, the 10 units) are special particles at scripted
  positions along the flight path; their DOM labels are positioned by projecting the node
  each frame (`transform: translate`), exactly like the reference's song labels.
- devicePixelRatio-aware canvas; mobile (<880px): ~220 particles, same math.
- Performance gate: steady 60fps desktop, no long tasks > 50ms after load.

## The flight plan (scroll ranges = % of total scroll track)

Background is a slow vertical gradient crossfade between chapter palettes (two stacked
full-screen divs, opacity-crossfaded — never `mix-blend-mode`).

| # | Range | Chapter | Scene | Watermark (center, ghosted ~7.5% alpha, Archivo 900 expanded, ~11vw max 160px) | DOM overlay |
|---|---|---|---|---|---|
| 0 | 0–8% | Night | Camera still; particles drift idle; the logo dome + horizon + "RFS / HOLDING GROUP" wordmark center (v1 hero entrance choreography reused); scroll cue | — | hero.h1 + hero.sub fade out by 8% |
| 1 | 8–22% | Ignition | Camera accelerates forward; particles streak slightly (motion trails via translucent clear) | RFS | man.l1–l3 lines appear sequentially (each pinned ~4% of scroll), man.p |
| 2 | 22–34% | The group | The SUNERGIES GROUP node approaches from depth, grows, connects by a drawn gold line back toward the viewer | SUNERGIES | eco.h2 + eco.intro |
| 3 | 34–74% | The ten units | The core stretch: the 10 unit nodes are stationed every ~4% of scroll along alternating sides (desktop ±112 world x; mobile ±40, varied y). As each node passes mid-depth, its label card fades in beside it, holds, then fades as it passes behind | the passing unit's name (e.g. SUNDEX) swaps per station | unit label cards (see below) |
| 4 | 74–88% | Gold burst | Background crossfades to `--gold`; particles invert to `--ink-on-gold`; camera slows | 2014 → then 500+ MW (two sub-beats) | flag.h2, flag.p, stats row, flag.cta (all `--ink-on-gold`, reuse v1 styles adapted) |
| 5 | 88–100% | Arrival | Background returns to black-deep; camera settles; horizon line redraws; dome sets half-below the horizon (dusk) | RFS | con.h2, con.p, con.cta, footer line + EN\|PT toggle. This final overlay is position: static-feeling (fully opaque, interactive) |

Chapter palettes (background gradient top→bottom): ch0/1 `oklch(6% .01 270)`→`--black-deep`
(cold night into warm black); ch2/3 `--black-deep`→`--black`; ch4 `--gold-hot`→`--gold`;
ch5 `--black`→`oklch(5% .008 60)`.

**Unit label cards** (chapter 3): max-width 300px, positioned by their node's projection
(clamped 24px from viewport edges); unit name Archivo 700 15px tracked caps `--text`, tag
12px `--muted`, and the refined one-line company description from the `desc.*` i18n keys.
A 1px gold leader line connects card to node and carries a small traveling pulse. On
mobile the card is centered above its visible node so the connection never crosses the
copy or begins offscreen.

## Chrome (fixed UI)

- Header: brand (mark + RFS) left, EN|PT right. **No section nav** — the flight is the
  nav. Header visible from chapter 1 on.
- **Progress rail**, right edge, vertically centered: 6 small gold dots (ch0 merged into
  1): current chapter dot filled + ringed, others hollow at 35% alpha. Click = smooth-jump
  to that chapter's scroll position. Labels on hover (chapter names, i18n).
- Scroll cue in ch0: v1 pulse + the word hero.cue ("Scroll"/"Role").

## i18n

v1 dictionary + mechanics carry over unchanged. New keys: chapter names for the rail
(`rail.0`="Start/Início", `rail.1`="Manifesto", `rail.2`="The group/O grupo",
`rail.3`="The units/As unidades", `rail.4`="Sunergies", `rail.5`="Contact/Contato").
Language flip crossfades the overlay layer only (canvas untouched).

## Fallback = accessibility = SEO (do better than the reference's punt)

`prefers-reduced-motion: reduce`, no-JS, and print all get the same fallback: the full v1
sectioned DOM lives in the document as the real content (semantic, all copy, both
languages via the same dictionary), and the canvas experience is layered on top when
(a) JS runs, (b) motion is allowed, (c) viewport ≥ 360px. In experience mode the fallback
DOM uses an sr-only clip treatment rather than `visibility:hidden`, so it remains in the
accessibility tree and is still readable by screen readers. Reduced-motion users get v1's
static-but-complete page.

## VPS QA quirks (obey; from verified memory)

Headless freezes CSS *transitions* (keyframes, rAF, canvas run fine) · cache-bust `?v=N` ·
no `mix-blend-mode` on section-sized elements · wait 2–4s after scroll before
screenshots · QA at 1327×660 and 390px.

## QA gates

1. Screenshot the flight at scroll positions 0%, 15%, 28%, 40% (a left unit card), 55%
   (a right unit card), 80% (gold burst), 100% — desktop EN; plus 0%, 50%, 80% mobile;
   plus 40% in PT. Save the living-motion pass to `screenshots/living-experience/`.
2. Scrubbing: jumping scroll position by wheel/drag never leaves stale overlays (each
   overlay's opacity is a pure function of scroll progress, not toggled state).
3. All 10 units appear, in canonical order, copy verbatim from the v1 dictionary; every
   card readable ≥4.5:1 against its background at its hold position.
4. Gold-burst chapter: all text `--ink-on-gold` on gold, ≥4.5:1.
5. Progress rail: 6 dots, click-jumps land on the right chapter (±3%).
6. Reduced-motion pass renders the complete v1-style static page, both languages.
7. 60fps steady on desktop during chapter 3 (performance trace or visual smoothness
   check); no console errors.
8. No horizontal overflow at 390px; labels clamped inside viewport.
9. Only numbers on the page: 2014, 500+ MW. Contact CTA links the official group contact channel.
