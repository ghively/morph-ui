import { ProgressRing } from './ProgressRing';

export default {
  title: 'ProgressRing',
  component: ProgressRing,
};

export const Determinate = () => (
  <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
    <ProgressRing value={68} label="68%" sublabel="indexed" size="md" />
    <ProgressRing value={100} label="100%" tone="success" size="lg" sublabel="done" />
    <ProgressRing value={24} label="24%" tone="warn" size="md" />
    <ProgressRing value={82} label="82%" size="sm" />
  </div>
);

export const Indeterminate = () => (
  <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
    <ProgressRing size="sm" />
    <ProgressRing size="md" label="Syncing" />
    <ProgressRing size="lg" />
    <ProgressRing size="xl" label="…" sublabel="waiting" />
  </div>
);

export const SizeScale = () => (
  <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
    <ProgressRing value={45} label="45%" size="sm" />
    <ProgressRing value={45} label="45%" size="md" />
    <ProgressRing value={45} label="45%" size="lg" />
    <ProgressRing value={45} label="45%" size="xl" />
  </div>
);
