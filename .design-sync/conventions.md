# Building with @ghively/morph-ui

**Wrap the whole app in `<MorphRoot fill>`.** All library CSS is scoped under `.morph-frame`, which `MorphRoot` renders. Without it, components render unstyled on a white, browser-default surface. This is a **dark-frame** design system: the surface is `--app-bg` (deep navy) and the text is `--app-text`. `fill` = min-height 100vh; `padding` (px) defaults to 0.

**Theming:** pass base-token overrides to the frame instead of restyling components: `<MorphRoot fill tokens={{ '--app-blue': '#7c5cff' }}>`.

**Styling idiom: CSS custom properties.** When you need custom layout or surfaces, use `var(--*)` tokens. Never hard-code colours. Real tokens:
- Surface and text: `--app-bg`, `--app-panel`, `--app-surface-raised`, `--app-elev`, `--app-text`, `--app-dim`, `--app-faint`, `--app-line`, `--app-line-soft`, `--app-edge`, `--app-hover`
- Accents: `--app-blue`, `--app-blue-strong`, `--app-blue-soft`, `--app-cyan`, `--app-green`, `--app-gold`
- Type: `--font-sans`, `--app-mono`
- Spacing: `--s1` … `--s6`
- Radii: `--r-sm`, `--r-md`, `--r-lg`, `--r-card`, `--r-pill`, `--r-pane`
- Agent state colours: `--state-idle`, `--state-think`, `--state-tool`, `--state-wait`, `--state-live`, `--state-ok`, `--state-ready`, `--state-warn`, `--state-error`, `--state-delegate`
- Glass: `--glass-bg`, `--glass-blur`, `--glass-edge`, `--glass-shadow`
- Motion: `--ease-out`, `--ease-soft`, `--ease-spring`, `--ease-emph`

**Prefer the library components to raw HTML.** Native `<button>`/`<input>` elements inside the frame render as blank light boxes. Use the core set for app UI:
- `Button` (`variant` primary/secondary/ghost/danger, `size`, `loading`)
- `Badge` (`tone` success/info/warn/danger/neutral)
- `Card` (`title`, `subtitle`, `actions`)
- `KpiCard`, `DataTable` (`columns`, `rows`, `rowKey`)
- `TextField`, `Select`, `TextArea`, `FormField`, `ToggleSwitch`, `SegmentedControl`, `Tabs`
- `AlertBanner` (`tone` info/warn/danger), `EmptyState` (`title`), `PaneHeader`, `ModalSurface` (`label`, `onClose`, `placement`), `ConfirmDialog`

**Motion and effects components are for marketing and hero accents only**, never for core app chrome. Those are `AuroraGlowCard`, `LiquidNavMenu`, `LiquidRippleImage`, `PrismOrb`, `PulseOrb`, `MorphingBlobBackground` and the `Text*` effects (`TextShimmer`, `TextGlitch`, `TextScribble`, …).

**Prop quirks:**
- `ToggleSwitch` is controlled through `on` + `onChange(next)` + `label`. There is no `checked`.
- `TextField`, `Select` and `FormField` **require `id`**. `Select` takes `options: {value, label, disabled?}[]`.
- `Button`, `TextField` and `Select` forward native attributes (`onClick`, `type`, `value`, `onChange`, `placeholder`), even though their `.d.ts` lists only the custom props.
- A raw input inside `FormField` must carry `data-field`, or it renders unstyled. Prefer `TextField`.
- `ModalSurface`: pass `height="auto"` for content-sized dialogs.
- Checkbox and RadioGroup are not in this bundle yet. Use `ToggleSwitch` or `SegmentedControl` instead.

**Where the truth lives:** `styles.css` and its `@import` closure (`_ds_bundle.css` holds all tokens and component CSS). Each component has `components/<group>/<Name>/<Name>.d.ts` (props) and `<Name>.prompt.md` (usage).

```tsx
import { MorphRoot, PaneHeader, KpiCard, Card, Badge, Button } from '@ghively/morph-ui';

export function Dashboard() {
  return (
    <MorphRoot fill padding={24}>
      <PaneHeader title="Support overview" subtitle="Updated 4m ago" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--s3)' }}>
        <KpiCard label="Queries today" value="1,284" delta="12.4% vs yesterday" deltaDirection="up" spark={[8, 10, 9, 12, 14, 18, 22]} />
        <KpiCard label="Median latency" value="1.8s" delta="0.3s slower" deltaDirection="down" />
      </div>
      <Card title="Support backlog" subtitle="Last 24h" actions={<Badge tone="warn">312 open</Badge>}>
        <Button variant="primary" onClick={() => {}}>Triage queue</Button>
      </Card>
    </MorphRoot>
  );
}
```
