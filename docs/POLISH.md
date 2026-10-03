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

## AGENT_OPS (shipped, one batch of 15)

Shared logic for all 15 lives in `src/components/agentOps.shared.tsx` (hooks + helpers, not exported from the index). Every component keeps its original props and `data-*` hooks, and re-exports its prop types. Each stylesheet opens with a small `:where(.root)` reset so the host primitives for `[data-status]`, `[data-state]` and `[data-empty]` don't bleed in.

| Component | Picked | Changes |
|---|---|---|
| CommandPalette | 1a · Glass spotlight | + `className`; match highlighting, wrap-around ↑↓, combobox aria, focus with preventScroll |
| ToolCallCard | 2a · Glass status | + `expanded`/`onExpandedChange`, `className`; human durations, tinted JSON, aria-expanded |
| StreamingMessage | 3b · Document | + `label`, `className`. **Fix:** caret trails the last line; open fences render as code mid-stream |
| ModelSelector | 4b · Spec sheet | + `defaultOpen`, `className`; arrows skip disabled + wrap, Tab closes, list scroll doesn't move the page |
| ContextMeter | 5a · Glow bar | + `breakdown`, `className`; thresholds unchanged |
| ApprovalGate | 6a · Glass gate | + `className`. **Fix:** resolved outcome is shown |
| RunTimeline | 7a · Glow rail | + `now`, `title`, `className`; per-step + total durations |
| DiffStatPill | 8a · Glass pill | + `className`; dir/basename split |
| AgentCard | 9a · Glass card | + `className`; initials fallback avatar |
| ApprovalInbox | 10b · Dense table | + `title`, `className`; exit animation before callbacks; risk counts |
| PlanChecklist | 11b · Segmented | segmented progress header, state tags |
| CostMeter | 12b · Readout | + `warnAt` (default 0.8) |
| EvalScoreCard | 13b · Delta table | target met/missed, ±delta, verdict |
| HandoffCard | 14a · Glass handoff | + `from` |
| AuditLogViewer | 15a · Glass timeline | level chips, styled empty state |

Files to push: `src/components/agentOps.shared.tsx`, `src/components/{CommandPalette,ToolCallCard,StreamingMessage,ModelSelector,ContextMeter,ApprovalGate,RunTimeline,DiffStatPill,AgentCard,ApprovalInbox,PlanChecklist,CostMeter,EvalScoreCard,HandoffCard,AuditLogViewer}.{tsx,css}`, `test/agent-ops-polish.test.tsx`. Candidates stay in `explore/agent-ops/`.

## RAG_ANSWER (shipped, lane B across the board)

Shared logic lives in `src/components/ragAnswer.shared.tsx` (hooks + helpers, not exported from the index). Same rules as AGENT_OPS: original props and `data-*` hooks kept, prop types re-exported, `:where(.root)` host-primitive reset in every stylesheet. All nine use the structured lane: rules, rows and tables instead of cards, with mono/terminal accents only.

| Component | Picked | Changes |
|---|---|---|
| CitationPills | 1b · Bracket refs | + `Citation.title` (tooltip + aria-label); arrow-key roving |
| SourceCardList | 2b · Ruled index | **Fix:** Open link no longer nested in the row button; url host shown; arrow-key roving |
| RetrievalInspector | 3b · Ranked table | + `title`, `defaultExpanded`; buttons with aria-expanded replace `<details>`; threshold cut line; dept column hides in narrow hosts |
| GroundingBadge | 4b · Tag + ticks | + `cited` / `total` (detail derived when omitted) |
| StreamingStageIndicator | 5b · Ruled stepper | + `doneLabel` (settled receipt; omit to keep render-nothing); aria-live polite |
| ContextAttributionList | 6b · Ledger table | + `title`; rows sorted by tokens, share %, warn ≥80% / danger ≥95% of budget |
| AnswerFeedback | 7b · Ruled form | + `prompt`; re-click clears rating; reason count on send; receipt echoes submission |
| FollowUpChips | 8b · Prompt rows | arrow / Home / End roving |
| VariablePromptInput | 9b · Ruled form | Run disabled until all slots filled; filled vs missing marks in preview |

Files to push: `src/components/ragAnswer.shared.tsx`, `src/components/{CitationPills,SourceCardList,RetrievalInspector,GroundingBadge,StreamingStageIndicator,ContextAttributionList,AnswerFeedback,FollowUpChips,VariablePromptInput}.{tsx,css}`, `src/components/{GroundingBadge,StreamingStageIndicator}.stories.tsx`, `test/rag-answer-polish.test.tsx`. Candidates stay in `explore/rag-answer/`.
