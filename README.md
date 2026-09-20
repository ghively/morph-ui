# Morph UI

Component library extracted from [ChatUIMorph](https://github.com/ghively/ChatUIMorph) — the component half of the repo, promoted to a standalone library usable by any project.

Philosophy: **available, not forced.** Components exist because they're good designs, not because a surface currently needs them. Every component ships with tests + provenance; nothing depends on ChatUIMorph app code.

## Components

| Component | Concept provenance | Status |
|---|---|---|
| AgentPresence | Wensity "Voice Aurora Wave" (agentic-ai) | shipped, tested |
| AgentActivityCapsule | Wensity activity capsule concept | shipped, tested |
| GenerativePlaceholder | Wensity generative/skeleton states | shipped, tested |
| ContextSwitcher | Wensity model context switcher | shipped, tested |
| MultimodalComposer | Wensity "Liquid Multimodal Input" | shipped, tested |

Phase 6 (workspace) and Phase 7 (artifact/info) components from the ChatUIMorph refadapt spec land here as they're built: FluidWorkspaceBoard, AgentActivityHeatmap, MetricSparkline, TokenPills, CodeDiffViewer, AdaptiveBento, ArchiveCollection, PanelDestinationTransition.

## Usage

```bash
npm install @ghively/morph-ui
```

```tsx
import { AgentPresence } from "@ghively/morph-ui";
import "@ghively/morph-ui/styles.css"; // default dark tokens; override on :root
```

Components read tokens as CSS custom properties (`--app-text`, `--app-blue`, `--ease-spring`, …). The shipped tokens are the ChatUIMorph dark-frame defaults; any host can override them for its own theme without touching component code.

## Development

pnpm. Gates: `pnpm build && pnpm test && pnpm lint && pnpm typecheck` — all four must pass before anything lands on main.

## Provenance rules (inherited from ChatUIMorph refadapt spec)

- External UI libraries (Wensity etc.) are **reference catalogs, not dependencies**. Never recreate a source implementation; convert the concept.
- One conceptual component ≈ one task / focused commit series.
- Never `feat: import 25 components` as one commit.
