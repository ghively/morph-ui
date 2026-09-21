# Morph UI

Component library extracted from [ChatUIMorph](https://github.com/ghively/ChatUIMorph) — the component half of the repo, promoted to a standalone library usable by any project.

Philosophy: **available, not forced.** Components exist because they're good designs, not because a surface currently needs them. Every component ships with tests + provenance; nothing depends on ChatUIMorph app code.

## Components (13)

| Component | Concept provenance | Status |
|---|---|---|
| AgentPresence | Wensity "Voice Aurora Wave" (agentic-ai) | shipped, tested |
| AgentActivityCapsule | Wensity activity capsule concept | shipped, tested |
| GenerativePlaceholder | Wensity generative/skeleton states | shipped, tested |
| ContextSwitcher | Wensity model context switcher | shipped, tested |
| MultimodalComposer | Wensity "Liquid Multimodal Input" | shipped, tested |
| MetricSparkline | refadapt P6 — inline SVG sparkline | shipped, tested |
| TokenPills | refadapt P6 — LLM token usage pills | shipped, tested |
| CodeDiffViewer | refadapt P6 — unified diff renderer | shipped, tested |
| AgentActivityHeatmap | refadapt P6 — GitHub-style activity grid | shipped, tested |
| FluidWorkspaceBoard | refadapt P6 — drag-rearrangeable board | shipped, tested |
| AdaptiveBento | refadapt P7 — container-query bento grid | shipped, tested |
| ArchiveCollection | refadapt P7 — grouped archive list | shipped, tested |
| PanelDestinationTransition | refadapt P7 — FLIP anchor→panel animation | shipped, tested |

## Usage

```bash
npm install @ghively/morph-ui
```

```tsx
import { AgentPresence } from "@ghively/morph-ui";
import "@ghively/morph-ui/styles.css"; // component styles only — theme-neutral
```

Components read tokens as CSS custom properties (`--app-text`, `--app-blue`, `--ease-spring`, …). The library does **not** ship a token theme: hosts define their own (see `src/tokens.css` for the full list and ChatUIMorph-dark reference values, and `docs/extraction.md` for the contract).

## Development

pnpm. Gates: `pnpm build && pnpm test && pnpm lint && pnpm typecheck` — all four must pass before anything lands on main.

## Provenance rules (inherited from ChatUIMorph refadapt spec)

- External UI libraries (Wensity etc.) are **reference catalogs, not dependencies**. Never recreate a source implementation; convert the concept.
- One conceptual component ≈ one task / focused commit series.
- Never `feat: import 25 components` as one commit.

## Expansion

The catalog grows on demand — new component types and designs are genuinely good to have even if no surface needs them yet. Each lands with tests, provenance, and all gates green.
