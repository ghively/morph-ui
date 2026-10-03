# AGENT_DATA polish log

Shared rules extracted so far (in `src/tokens.css`, "agent state + glass surface layer"):

- `--state-*`: one token per agent meaning (ready, live, think, tool, delegate, wait, ok, warn, error, idle). Every agent surface colours a state the same way.
- `--glass-bg / --glass-blur / --glass-edge / --glass-shadow`: the glass panel recipe used by the capsule and the switcher.
- Every component sets its accent through a local `--c` and derives tints from it with `color-mix()`. The glow is `0 0 Npx color-mix(--c …)`, never a hard-coded rgba.
- Motion uses the theme ease tokens (`--ease-emph`, `--ease-morph`, `--ease-fx`). Open/close is `grid-template-rows: 0fr → 1fr`. Each component honours reduced motion.
- Components must guard against host `p, li` font rules (the DS sets `li { font-size }`), e.g. `.agent-activity li { font-size: inherit }`.

## Batch 1 (shipped)

| Component | Picked | API changes |
|---|---|---|
| AgentPresence | 1b · Ring dial | + `showLabel`, `AGENT_PRESENCE_LABEL`, `data-state` |
| AgentActivityCapsule | 1e · Ring card | + `status`, `expanded`/`defaultExpanded`/`onExpandedChange`, `steps` ({label,status,meta}), `elapsed`, `onApprove/onInspect/onCancel`; progress 0–1. Legacy `state`/`details` still mapped. |
| GenerativePlaceholder | 1i · Construct | all 7 variants implemented; + `label` |
| ContextSwitcher | 1j · Glass dropdown | options accept `{value,label,description,meta}`; + `label`; keyboard nav |

Files to push: `src/tokens.css`, `src/components/{AgentPresence,AgentActivityCapsule,GenerativePlaceholder,ContextSwitcher}.{tsx,css,stories.tsx}`, `test/agent-data-polish.test.tsx`.

The candidate options live in `explore/agent-data/` (not part of the package).

## Batch 2 (shipped)

| Component | Picked | API changes |
|---|---|---|
| MultimodalComposer | 2a · Glass capsule | + `defaultAttachments`, `defaultVoiceMode`; attachment chips with type tiles; voice mode uses AgentPresence |
| MetricSparkline | 2e · Inline row | + `invert`, `period`; computed delta; hover scrub. Single-point path is now a flat line at the padded width (test updated). |
| TokenPills | 2g · Glass chips | options + `count`, `disabled`; roving tab stop on first selected; dropped `data-chip`/`data-solid` (kept `data-on`) |
| CodeDiffViewer | 2k · Split view | + `view` (default **split**), `hideViewToggle`, `className`; hunk context text; +/− stats. Legacy `cdv-row-*`, `cdv-line-num`, `cdv-error` hooks kept (tests updated to pass `view="unified"`). |

Files to push: `src/components/{MultimodalComposer,MetricSparkline,TokenPills,CodeDiffViewer}.{tsx,css,stories.tsx}`, `test/CodeDiffViewer-component.test.tsx`, `test/MetricSparkline-component.test.tsx`, `test/agent-data-polish-batch2.test.tsx`.

Shared rules added: dark scrollbars (`scrollbar-width: thin; scrollbar-color: color-mix(--app-text 20%) transparent`) on every scroll area; numeric text uses `tabular-nums`.

## Batch 1 compatibility fix (2026-10-03)
Checked against the repo's existing tests and restored their contracts: AgentPresence aria-label is `label ?? "Agent is {state}"`; capsule tool count renders as plain `"{n} tools"` text.

## Batch 3 (shipped) — AGENT_DATA complete

| Component | Picked | Changes |
|---|---|---|
| AgentActivityHeatmap | 3b · Dot matrix | + `title`; true weekday-aligned calendar (gaps respected), headline follows hover, weekly-total bars, Enter selects, ←/→ jump a week. Cell/aria/button contract unchanged. |
| FluidWorkspaceBoard | 3e · Accent tiles | Styling. **Bug fix:** drag no longer teleports inside transformed/scrolled hosts (fixed-position origin corrected) and keeps its width. |
| AdaptiveBento | 3h · Hero aurora + 3g hover | Styling; every tile lifts with an edge-light + accent glow on hover. |
| ArchiveCollection | 3j · Timeline | + `selectedId`, `className`; per-month counts. data-archive-* hooks + order unchanged. |
| PanelDestinationTransition | 3o · Wireframe trace | + `className`; default duration d3. **Bug fix:** ghost positioned inside the slot (was position:fixed), so it lands correctly in transformed/scrolled hosts. |

Files to push: `src/components/{AgentActivityHeatmap,FluidWorkspaceBoard,AdaptiveBento,ArchiveCollection,PanelDestinationTransition}.{tsx,css}` (+ Heatmap/Archive/Panel stories), `test/agent-data-polish-batch3.test.tsx`.
