---
version: alpha
name: MorphUI — Lively Sage
description: >-
  MorphUI is a dark-frame design system for Gene's dashboards and apps.
  Default theme Lively Sage: graphite-green surfaces, a lively spring-green
  accent, cyan secondary, and a violet AI accent. Built on @ghively/morph-ui.
colors:
  primary: "#A2D66E"
  bg: "#111513"
  panel: "#171E19"
  raised: "#222D26"
  text: "#EDF5EE"
  dim: "#A6B7AC"
  faint: "#839488"
  line: "rgba(174, 215, 168, 0.18)"
  accent: "#A2D66E"
  accent-strong: "#C0F27C"
  accent-soft: "rgba(162, 214, 110, 0.18)"
  secondary: "#4FE8EF"
  ai: "#A879FF"
  success: "#65D68A"
  warning: "#F0BF55"
  danger: "#FF786F"
  series-1: "#A2D66E"
  series-2: "#4FE8EF"
  series-3: "#A879FF"
  series-4: "#F0BF55"
  series-5: "#FF786F"
  series-6: "#65D68A"
typography:
  eyebrow:
    fontFamily: Arial, "Helvetica Neue", Helvetica, sans-serif
    fontSize: 10.5px
    fontWeight: 650
    letterSpacing: "0.12em"
  body:
    fontFamily: Arial, "Helvetica Neue", Helvetica, sans-serif
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
  lead:
    fontFamily: Arial, "Helvetica Neue", Helvetica, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  h4:
    fontFamily: Arial, "Helvetica Neue", Helvetica, sans-serif
    fontSize: 16px
    fontWeight: 650
    lineHeight: 1.3
  h3:
    fontFamily: Arial, "Helvetica Neue", Helvetica, sans-serif
    fontSize: 20px
    fontWeight: 650
    lineHeight: 1.25
  h2:
    fontFamily: Arial, "Helvetica Neue", Helvetica, sans-serif
    fontSize: 24px
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  h1:
    fontFamily: Arial, "Helvetica Neue", Helvetica, sans-serif
    fontSize: 30px
    fontWeight: 650
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  hero:
    fontFamily: Arial, "Helvetica Neue", Helvetica, sans-serif
    fontSize: 36px
    fontWeight: 650
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  mono:
    fontFamily: ui-monospace, SFMono-Regular, "SF Mono", Menlo, "Courier New", monospace
    fontSize: 12px
    lineHeight: 1.5
rounded:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 28px
  pill: 999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#111513"
    rounded: "{rounded.sm}"
    padding: 12px
  button-secondary:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: 12px
  card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: 16px
  kpi-card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: 16px
  badge-success:
    backgroundColor: "rgba(101, 214, 138, 0.16)"
    textColor: "#91EFAD"
    rounded: "{rounded.pill}"
    padding: 4px
  badge-warning:
    backgroundColor: "rgba(240, 191, 85, 0.16)"
    textColor: "{colors.warning}"
    rounded: "{rounded.pill}"
    padding: 4px
  badge-danger:
    backgroundColor: "rgba(255, 120, 111, 0.16)"
    textColor: "#FF9C94"
    rounded: "{rounded.pill}"
    padding: 4px
  panel-header:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.text}"
    rounded: "{rounded.xl}"
    padding: 24px
---

## Overview

MorphUI is the single visual source of truth for Gene's dashboards, tools, and
small apps. It ships as `@ghively/morph-ui` (React 19 + one CSS bundle) and is
consumed by wrapping the app in `<MorphRoot fill theme="lively-sage">`. All
library CSS is scoped under `.morph-frame`, so themes never leak into the host
page.

The default theme, **Lively Sage**, pairs graphite-green dark surfaces with a
lively spring-green accent, cyan for secondary data, and violet reserved for
AI/agent affordances. It replaced the original deep-navy work palette and is
the baseline for all new apps.

## Colors

- **accent (#A2D66E):** spring green. The single driver for primary actions,
  focus rings, active nav, and chart series 1. Derived tints (hover, soft
  fills, glows) come from `color-mix()` — never hard-coded rgba.
- **secondary (#4FE8EF):** cyan for second data series and info states.
- **ai (#A879FF):** violet. Reserved for AI/agent surfaces (state rings,
  agent cards, thinking indicators). Never used for core app chrome.
- **bg / panel / raised (#111513 / #171E19 / #222D26):** three-step
  graphite-green surface ladder; depth comes from stepping up this ladder, not
  from drop shadows.
- **text / dim / faint (#EDF5EE / #A6B7AC / #839488):** primary text, secondary
  text, and metadata/placeholder text respectively.
- **success / warning / danger (#65D68A / #F0BF55 / #FF786F):** the one tone
  vocabulary. Every `tone` prop takes `neutral | info | success | warn |
  danger` — aliases normalize, so never invent new tone names.
- **series-1 … series-6:** fixed chart ramp in the order green, cyan, violet,
  gold, coral, mint. Charts consume these in order, never ad-hoc colors.

## Typography

System sans stack (Arial/Helvetica Neue) everywhere; mono stack for code,
paths, IDs, and numeric readouts (with `tabular-nums`). Six heading steps
(16/20/24/30/36) with tight tracking at the large end, a 13px body, and an
all-caps 10.5px eyebrow with wide tracking for section labels. Sizes come from
the `--t-*` scale — never raw px.

## Layout

Grid-first: dashboards are CSS grid with `gap: var(--s5)` (16px) between
cards. KPI rows use `repeat(auto-fit, minmax(180px, 1fr))`. Spacing comes from
the `--s0…--s11` scale (2–64px); radii from `--r-2xs…--r-2xl` plus
`--r-pill`. Cards are 16px radius, panes 28px, controls 8–12px.

## Elevation

Dark-frame depth is layered surfaces (bg → panel → raised) plus 1px
`--app-line` borders and subtle inset pane shadows. Glass surfaces
(`--glass-*` tokens with backdrop blur) are for floating chrome only —
command palettes, capsules, switches.

## Components

Prefer library components over raw HTML — native `<button>`/`<input>` inside
the frame render unstyled. The core set: `Button` (primary/secondary/ghost/
danger), `Badge`, `Card`, `KpiCard`, `DataTable`, `TextField`, `Select`,
`ToggleSwitch`, `SegmentedControl`, `Tabs`, `AlertBanner`, `EmptyState`,
`PaneHeader`, `ModalSurface`. Charts: `LineChart`, `BarChart`, `DonutChart`,
`GaugeChart`, `FunnelChart`. Motion/effects components (Aurora, PrismOrb,
Text* effects) are for marketing hero accents only — never app chrome.

## Do's and Don'ts

- **Do** theme via `MorphRoot` token overrides or the built-in themes
  (`lively-sage`, `jade-citrus`, `genehively-terminal`); don't restyle
  components from outside.
- **Do** style custom surfaces with `var(--*)` tokens; never hard-code colors.
- **Do** keep every accent derivation in `color-mix()` from the local `--c`.
- **Don't** use the violet AI accent for non-agent UI.
- **Don't** invent tone names beyond the five-tone vocabulary.
- **Don't** put motion/effects components in core app chrome.
- **Don't** mix raw light-theme HTML into the frame.
