# Provenance & token contract

Extracted from ChatUIMorph @ b3ca082 (2026-09-20). Files moved verbatim from
`runtime/web/src/components/` and `runtime/web/test/`; the five components have
zero ChatUIMorph app imports (verified: only `react` + relative CSS imports).

## Token contract

The 17 custom properties the components read are defined in `src/tokens.css`
(dark-frame defaults, values identical to ChatUIMorph `src/app.css:root`):

--app-text --app-dim --app-faint --app-elev --app-hover --app-line
--app-blue --app-blue-strong --color-success --color-warning --color-error
--d-scale --d2 --d3 --ease-spring --ease-morph --ease-fx --ease-cycle

Hosts override any of these on `:root` or a wrapper element; components never
hard-code colors.

## Deferred to ChatUIMorph (not extracted)

`primitives.tsx` (Avatar etc.) — depends on matrix-js-sdk and app internals
(`../matrix/rooms`, `../matrix/media`). Migrating it requires a
dependency-injection redesign of its props; do it as its own task later, if ever.
