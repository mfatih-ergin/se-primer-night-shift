---
name: Night Shift Zero Hour
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e18'
  surface-container-low: '#171b26'
  surface-container: '#1c1f2a'
  surface-container-high: '#262a35'
  surface-container-highest: '#313540'
  on-surface: '#dfe2f1'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dfe2f1'
  inverse-on-surface: '#2c303b'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#00a572'
  on-tertiary-container: '#00311f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0f131d'
  on-background: '#dfe2f1'
  surface-variant: '#313540'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  telemetry-lg:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.03em
  telemetry-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0em
  telemetry-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 0.75rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style
The design system establishes a high-stakes, tactical cyber-operations command center aesthetic tailored for engineering students diagnosing distributed systems failures under time pressure. The visual identity balances mission-critical clarity with atmospheric immersion: deep midnight infrastructure backdrops, illuminated HUD panels, crisp micro-borders, and luminescent status indicators. 

The emotional tone evokes disciplined urgency, intellectual rigor, and systemic agency—transforming complex software architecture triage into a controlled, tactical operations room. Interfaces prioritize instant readability, glanceable telemetry, and precise fingertip manipulation under high cognitive load.

## Colors
The color architecture relies strictly on an ultra-dark infrastructure model.

- **Background Canvas:** `#0B0F19` serves as the primary canvas, representing the deep terminal floor.
- **Surfaces & Cards:** `#151D2F` provides elevation for panels, triage cards, and metrics grids, enclosed by `#24324F` borders.
- **Primary Interactive (Electric Blue):** `#3B82F6` represents active operations, selection states, and primary tactical decisions, accented with a `rgba(59, 130, 246, 0.20)` ambient glow.
- **AI Tutor (Socratic Mode):** `#8B5CF6` signals Socratic pedagogical interventions, root-cause guidance, and hint vectors, backed by `rgba(139, 92, 246, 0.15)`.
- **System States & Telemetry:**
  - **Critical / Outage (Danger):** `#EF4444` with `rgba(239, 68, 68, 0.15)` container fills.
  - **Stabilized / Nominal:** `#10B981` with `rgba(16, 185, 129, 0.15)` container fills.
  - **Degraded / Latency Warning:** `#F59E0B` with `rgba(245, 158, 11, 0.15)` container fills.
- **Typography Colors:**
  - Primary Labels & Titles: `#F9FAFB`
  - Secondary Explanations & Descriptions: `#94A3B8`
  - Telemetry Data, Timestamps, Logs, and Technical Metrics: `#64748B`

## Typography
Typographic rhythm combines human-centric triage readability with high-density system telemetry.
- **Inter** handles narrative descriptions, disaster postmortems, diagnostic prompts, and tactical questions. All copy is localized in Turkish (e.g., "Sistem Çöküşü", "Kök Neden Analizi", "Tetikle").
- **JetBrains Mono** is reserved exclusively for time-critical metrics: countdown clocks, CPU/Memory telemetry, HTTP response codes (e.g., `504 Gateway Timeout`), stack traces, and system resource indicators.
- Numeric characters must enable tabular figures (`tnum`) to eliminate micro-jittering in active countdown timers and live metric tickers.

## Layout & Spacing
The layout targets a mobile-first 360x800 portrait viewport structured as an operations viewport with fixed top telemetry HUD and persistent bottom command action zones:

- **Canvas Matrix:** 4-column layout with 12px (`0.75rem`) gutters and 16px (`1rem`) screen-edge margins to ensure thumb ergonomics.
- **Vertical Hierarchy:**
  1. **Incident Header HUD (Top 72px):** Non-scrolling ticker with global system health, countdown clock (`00:14:59`), and live incident severity level.
  2. **Scenario & Architecture Workspace (Scrollable Middle):** Incident briefing cards, server architecture topology, and metric graphs.
  3. **Triage Action Dock (Bottom 120px):** Persistent decision-matrix container providing immediate tactical response triggers.
- **Target Ergonomics:** Every interactive component strictly honors a minimum touch envelope of 48px height and width, padded internally to maintain visual compactness without sacrificing mobile input accuracy.

## Elevation & Depth
Depth is created using tactical surface layering, low-contrast structural strokes, and targeted emission glows rather than standard blurry drop shadows:

- **Surface Tiers:**
  - `Level 0 (Base Canvas):` `#0B0F19` — The infrastructure darkness.
  - `Level 1 (Card/Container):` `#151D2F` — Encased with a crisp `1px solid #24324F`.
  - `Level 2 (Active/Floating Panel):` `#1B253B` — Used for active drill-downs, drawer overlays, and modal dialogues, bounded by `1px solid #3B82F6` or `1px solid #384C74`.
- **Luminescent Emissions:** Tactical alert states use ambient outer halos:
  - Critical breach elements cast `0 0 16px rgba(239, 68, 68, 0.25)`.
  - Primary interactive triggers cast `0 0 14px rgba(59, 130, 246, 0.20)`.
  - Stabilized systems project `0 0 12px rgba(16, 185, 129, 0.20)`.
- **Tactical Dividers:** Section separators use 1px horizontal lines rendered in `rgba(36, 50, 79, 0.6)`.

## Shapes
Geometry conveys precise computational engineering.

- **Standard Containers:** Cards, modal bottom sheets, incident containers, and log viewports use a standardized outer radius of `14px` (`border-radius: 14px`).
- **Interactive Buttons:** Action levers, decision response choices, and primary confirmation buttons use `8px` (`0.5rem`) to maintain an authoritative, technical profile.
- **Data Badges & Pill Chips:** System tags, HTTP codes, and telemetry pills use an internal `4px` or `6px` radius to reinforce dense technical data representation.

## Components

### Buttons & Tactical Levers
- **Primary Action (Kritik Müdahale / Onayla):** Minimum height 48px. Solid `#3B82F6` background, `#F9FAFB` label (Inter SemiBold, 15px), subtle outer aura `0 0 12px rgba(59, 130, 246, 0.3)`. Pressed state scales to `0.98` with `#2563EB`.
- **Secondary Action (İncele / Günlükleri Gör):** Minimum height 48px. Background `rgba(21, 29, 47, 0.8)`, border `1px solid #24324F`, text `#94A3B8`. Hover/active border flashes `#3B82F6`.
- **Destructive Action (Sistemi Yeniden Başlat / İzolasyon):** Minimum height 48px. Background `rgba(239, 68, 68, 0.15)`, border `1px solid #EF4444`, text `#EF4444`.

### Triage Decision Cards
- Background `#151D2F`, border `1px solid #24324F`, radius `14px`, inner padding 16px (`1rem`).
- Holds problem statements, system state diffs, and trade-off selections.
- Active/selected state shifts border to `1px solid #3B82F6` with an inner glow `inset 0 0 0 1px #3B82F6`.

### Telemetry Badges & Chips
- Status indicators for node health, replica sets, and network traffic.
- Contain a 6px pulsating dot indicator and JetBrains Mono text (e.g., `ERR: 504`, `GECİKME: 840ms`).
- Danger state: `#EF4444` font, `rgba(239, 68, 68, 0.15)` fill, `1px solid rgba(239, 68, 68, 0.4)`.
- Stabilized state: `#10B981` font, `rgba(16, 185, 129, 0.15)` fill, `1px solid rgba(16, 185, 129, 0.4)`.

### AI Tutor (Sokratik Rehber) Panel
- Dedicated pedagogical coaching card highlighting software engineering concepts.
- Background `#151D2F` accented with an upper border segment of `2px solid #8B5CF6`.
- Tagged with `SOKRATİK DANIŞMAN` in JetBrains Mono `10px` caps, text `#8B5CF6`. Body text explains trade-offs (e.g., "Önbelleği temizlemek veritabanı yükünü nasıl etkiler?").

### Input & Query Fields
- Minimum touch target 48px. Background `#0B0F19`, border `1px solid #24324F`, text `#F9FAFB`, placeholder `#64748B`.
- Focus state triggers `1px solid #3B82F6` and removes native browser outlines.

### Metric Timers & Scrubbers
- Incident countdown element styled in JetBrains Mono 18px (`telemetry-lg`), centered with tabular digits.
- Bar meters use 4px height tracks with background `#24324F` and fills in `#3B82F6`, `#EF4444`, or `#10B981`.