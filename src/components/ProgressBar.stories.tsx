import { ProgressBar } from './ProgressBar';

export default {
  title: 'ProgressBar',
  component: ProgressBar,
};

export const Determinate = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
    <ProgressBar value={68} label="Indexing support tickets · 68%" />
    <ProgressBar value={100} label="Sales CRM" tone="success" />
    <ProgressBar value={24} label="Finance filings" tone="warn" />
  </div>
);

export const Indeterminate = () => <ProgressBar label="Waiting for the indexer…" />;
