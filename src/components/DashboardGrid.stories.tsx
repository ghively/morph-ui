import { DashboardGrid } from './DashboardGrid';

const BASE_TILES = [
  {
    id: 'kpi',
    title: 'Queries today',
    colSpan: 3,
    node: (
      <div>
        <div style={{ fontSize: 28, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>48,210</div>
        <div style={{ fontSize: 11, color: 'var(--app-faint)' }}>+12% vs yesterday</div>
      </div>
    ),
  },
  {
    id: 'latency',
    title: 'p95 latency',
    colSpan: 3,
    node: (
      <div>
        <div style={{ fontSize: 28, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>312ms</div>
        <div style={{ fontSize: 11, color: 'var(--state-ok)' }}>healthy</div>
      </div>
    ),
  },
  {
    id: 'spend',
    title: 'Spend this week',
    colSpan: 3,
    node: (
      <div>
        <div style={{ fontSize: 28, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>$612</div>
        <div style={{ fontSize: 11, color: 'var(--app-faint)' }}>budget $800</div>
      </div>
    ),
  },
  {
    id: 'queue',
    title: 'Triage queue',
    colSpan: 3,
    rowSpan: 2,
    node: (
      <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: 'var(--app-dim)' }}>
        <li>Grant outbound email</li>
        <li>Approve corpus deletion</li>
        <li>Review eval regression</li>
      </ul>
    ),
  },
  {
    id: 'activity',
    title: 'Recent activity',
    colSpan: 9,
    node: (
      <div style={{ fontSize: 12, color: 'var(--app-dim)', display: 'grid', gap: 4 }}>
        <span>09:41 · corpus re-index finished</span>
        <span>09:38 · eval sweep started</span>
        <span>09:31 · rate limit hit (429)</span>
      </div>
    ),
  },
];

const PALETTE = [
  { id: 'errors', title: 'Error rate', colSpan: 4, node: <div style={{ fontSize: 12, color: 'var(--app-dim)' }}>Add to track 5xx %.</div> },
  { id: 'cache', title: 'Cache hit', colSpan: 4, node: <div style={{ fontSize: 12, color: 'var(--app-dim)' }}>Add to track warm hits.</div> },
];

export default {
  title: 'DashboardGrid',
  component: DashboardGrid,
};

export const Default = () => (
  <div style={{ maxWidth: 960 }}>
    <DashboardGrid tiles={BASE_TILES} title="Ops overview" />
  </div>
);

export const Editable = () => (
  <div style={{ maxWidth: 960 }}>
    <DashboardGrid tiles={BASE_TILES.slice(0, 3)} title="Ops overview" editable addableTiles={PALETTE} />
  </div>
);
