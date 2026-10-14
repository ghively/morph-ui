import { HeatmapGrid } from './HeatmapGrid';

export default {
  title: 'HeatmapGrid',
  component: HeatmapGrid,
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = ['00', '04', '08', '12', '16', '20'];

/** Deterministic pseudo-random so the story stays screenshot-stable. */
function intensity(d: number, h: number): number {
  const workday = d < 5;
  const peak = h === 2 || h === 3;
  const base = workday ? 0.55 : 0.2;
  return Math.max(0, Math.min(1, base + (peak ? 0.4 : -0.15) + ((d * 7 + h * 3) % 5) * 0.04));
}

export const Default = () => (
  <HeatmapGrid
    label="Deploy frequency by day and hour (percent of weekly max)"
    rows={DAYS}
    columns={HOURS}
    cells={DAYS.map((_, d) => HOURS.map((_, h) => ({ value: intensity(d, h) })))}
    formatValue={(v) => `${Math.round(v * 100)}%`}
  />
);

export const SparseMatrix = () => (
  <HeatmapGrid
    label="Feature adoption by plan tier (share of accounts)"
    rows={['Free', 'Pro', 'Team', 'Enterprise']}
    columns={['Search', 'API', 'SSO', 'Audit log', 'BYOK']}
    formatValue={(v) => `${Math.round(v * 100)}%`}
    cells={[
      [{ value: 0.82 }, { value: 0.31 }, undefined, undefined, undefined],
      [{ value: 0.74 }, { value: 0.66 }, { value: 0.18 }, undefined, { value: 0.22 }],
      [{ value: 0.68 }, { value: 0.71 }, { value: 0.77 }, { value: 0.44 }, { value: 0.51 }],
      [{ value: 0.41 }, { value: 0.88 }, { value: 0.95 }, { value: 0.9 }, { value: 0.83 }],
    ]}
  />
);
