---
name: Payflow Precision Fintech
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#484556'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#797588'
  outline-variant: '#c9c4d9'
  surface-tint: '#5d36ef'
  primary: '#5427e6'
  on-primary: '#ffffff'
  primary-container: '#6d4aff'
  on-primary-container: '#f4eeff'
  inverse-primary: '#c9bfff'
  secondary: '#006e2f'
  on-secondary: '#ffffff'
  secondary-container: '#6bff8f'
  on-secondary-container: '#007432'
  tertiary: '#794b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#9a6100'
  on-tertiary-container: '#ffeedf'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5deff'
  primary-fixed-dim: '#c9bfff'
  on-primary-fixed: '#1b0063'
  on-primary-fixed-variant: '#4500d8'
  secondary-fixed: '#6bff8f'
  secondary-fixed-dim: '#4ae176'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005321'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-default:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.005em
  body-medium:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.005em
  body-secondary:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-default:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-code:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.02em
  caption:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system embodies the calculated precision, clarity, and understated confidence required for high-velocity financial workflows. Designed strictly for a modern fintech SaaS dashboard, the aesthetic fuses the functional discipline of Linear with the typographic mastery and crisp boundary execution of Stripe.

The personality is authoritative, calm, and institutional yet distinctly contemporary. The interface strips away decorative noise—forgoing high-gloss skeuomorphism, neon glows, and dramatic gradient washes—in favor of structural clarity, impeccable micro-interactions, and instant data legibility. Target users are finance operators, founders, and billing engineers who require uncompromising reliability and zero cognitive friction while parsing transaction graphs, reconciliation queues, and real-time revenue streams.

## Colors

The system uses an uncompromising light-only palette configured for extended analytical focus and strict visual ergonomics.

- **Canvas & Surfaces**: The base application canvas is `#F8F9FC` (Secondary Background), giving structural distinction to surface cards, modal dialogues, and side navigation which reside on `#FFFFFF` (Primary Background).
- **Brand & Action**: `#6D4AFF` acts as the primary interactive anchor, reserved strictly for focal elements, active states, key interactive links, and primary CTA buttons.
- **Data & Sentiment**: Operational indicators follow rigid semantic guidelines:
  - **Success / Healthy Cash Flow**: `#22C55E` with its tinted surface companion `#F0FDF4`.
  - **Warning / Pending Invoices**: `#F59E0B` with its tinted companion `#FFFBEB`.
  - **Critical / Failed Payments**: `#EF4444` with its tinted companion `#FEF2F2`.
- **Text & Outlines**: Hierarchical contrast is driven by `#111827` (slate-900) for headers and core transactional values, step-down `#6B7280` (cool-gray-500) for descriptive metadata, and `#E5E7EB` (neutral border) forming the crisp 1px delineation across all views.

## Typography

Typographic scale is powered exclusively by `Inter` across all structural tiers, prioritizing uniform tabular alignment, neutral tone, and effortless vertical scanning.

- **Numerical Figures & Tables**: Always leverage `font-feature-settings: "cv02", "cv03", "cv04", "cv11", "tnum"` to enable tabular numbers, ensuring monetary amounts and account balances align across dense tabular columns without jitter.
- **Hierarchy Rules**: Primary page headers use 24px (`headline-lg`) at semi-bold (600), sub-headers and card titles use 16px (`headline-sm`) semi-bold, primary body copy operates at 14px (`body-default`) with a 20px line-height, supporting secondary context uses 13px (`body-secondary`), and badges, breadcrumbs, and table headers adopt 12px (`label-default`) medium (500).
- **Case Transformation**: Data column headers and system tags may employ uppercase 11px (`caption`) with a `letterSpacing: 0.05em` for instant label categorization.

## Layout & Spacing

The layout model is anchored on an 8pt modular grid with a 12-column fluid grid system on desktop environments, framed by fixed 240px or collapsible 64px left navigation sidebars.

- **Breakpoints & Adaptation**:
  - **Desktop (≥ 1280px)**: 12-column grid, `gutter: 1.5rem` (24px), page canvas `margin: 2rem` (32px).
  - **Tablet (768px – 1279px)**: 8-column layout, `gutter: 1rem` (16px), page canvas `margin: 1.5rem` (24px); complex split panels collapse into stacked blocks.
  - **Mobile (< 768px)**: 4-column layout, `gutter: 0.75rem` (12px), canvas `margin: 1rem` (16px); metrics widgets stack vertically with horizontal touch-scroll for large ledger tables.
- **Rhythm Discipline**: Component-level spacing uses `space-xs` (4px) for micro-gaps within badges and buttons, `space-sm` (8px) for icon-to-label offsets and field inputs, `space-md` (16px) for interior card padding, and `space-xl` (32px) between major operational dashboard sections.

## Elevation & Depth

Depth is articulated through structural 1px borders and razor-thin ambient occlusion rather than heavy drop shadows.

- **Surface Layering**: The primary interface is near-flat. The `#F8F9FC` canvas serves as Level 0. Level 1 surfaces (cards, tables, chart backgrounds) rest at pure `#FFFFFF` bounded by a strict `1px solid #E5E7EB` border.
- **Micro-Shadows**: Level 1 surfaces employ an almost imperceptible shadow: `0 1px 2px 0 rgba(0, 0, 0, 0.03)`. 
- **Floating Overlays & Menus (Level 2)**: Popovers, date-pickers, and dropdowns use `box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)` with a `1px solid #E5E7EB` perimeter.
- **Modals (Level 3)**: Center stage dialogs utilize `box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.03)`, backed by a semi-opaque backdrop blur overlay `rgba(17, 24, 39, 0.3)` with `backdrop-filter: blur(2px)`.

## Shapes

The geometric architecture pairs precise functional containment with ergonomic softening:

- **Cards & Data Modules**: Strictly 12px border radius (`rounded-lg` level token equivalent), balancing modern softness with maximum internal data real estate.
- **Interactive Controls**: Buttons, text input boxes, dropdown selectors, and search fields employ an 8px radius (`rounded-md`).
- **Badges & Status Tags**: Use an intentional 6px or 8px soft-cornered radius rather than fully circular pill forms to preserve the clinical enterprise aesthetic.
- **Avatars & Floating Indicators**: Monogram badges and indicator dots are fully circular (`rounded-full`).

## Components

### Buttons
- **Primary**: Background `#6D4AFF`, text `#FFFFFF`, border `none`, corner radius `8px`, height `36px` (compact) or `40px` (standard), padding `0 16px`. Hover state: `#5B3CE6`. Active state: `#4F32CC`.
- **Secondary / Outline**: Background `#FFFFFF`, text `#111827`, border `1px solid #E5E7EB`, corner radius `8px`. Hover: background `#F8F9FC`, border `#D1D5DB`.
- **Destructive**: Background `#FEF2F2`, text `#EF4444`, border `1px solid #FCA5A5`. Hover: background `#EF4444`, text `#FFFFFF`.

### Input Fields & Controls
- **Text Inputs**: Height `38px`, background `#FFFFFF`, border `1px solid #E5E7EB`, radius `8px`, text `#111827`, placeholder `#9CA3AF`. Focus state: border `#6D4AFF`, box-shadow `0 0 0 3px rgba(109, 74, 255, 0.12)`.
- **Checkboxes & Radios**: Size `16px`, corner radius `4px` (checkboxes) and full circle (radios). Default border `1px solid #D1D5DB`. Checked: background `#6D4AFF`, checkmark `#FFFFFF`.

### Cards & Metrics Blocks
- **Card Container**: Background `#FFFFFF`, border `1px solid #E5E7EB`, border-radius `12px`, padding `20px` or `24px`.
- **Metric Card**: Upper row contains label (13px, `#6B7280`) and optional contextual badge; center block houses large value (24px, `#111827`, tabular digits); bottom block contains delta trend indicator (12px, green `#22C55E` or red `#EF4444`) accompanied by historical comparison copy.

### Status Badges & Chips
- **Design Structure**: Height `22px`, font size `12px`, font weight `500`, border-radius `6px`, padding `2px 8px`, border `1px solid transparent`.
- **Success**: Background `#F0FDF4`, text `#15803D`, border `#DCFCE7`.
- **Warning / Review**: Background `#FFFBEB`, text `#B45309`, border `#FEF3C7`.
- **Failed / Error**: Background `#FEF2F2`, text `#B91C1C`, border `#FEE2E2`.
- **Neutral / Draft**: Background `#F3F4F6`, text `#374151`, border `#E5E7EB`.

### Data Tables
- **Header Row**: Height `36px`, background `#F8F9FC`, border-bottom `1px solid #E5E7EB`, text `12px`, weight `500`, color `#6B7280`.
- **Data Rows**: Height `48px`, background `#FFFFFF`, border-bottom `1px solid #E5E7EB`, text `13px` / `14px`, text color `#111827`. Hover row state: background `#F9FAFB`. Numeric cell values right-aligned with tabular numerals.