import { KpiCard } from './KpiCard';

export default {
  title: 'KpiCard',
  component: KpiCard,
};

export const Default = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
    <KpiCard
      label="Queries today"
      value="1,284"
      delta="12.4% vs yesterday"
      deltaDirection="up"
      spark={[8, 10, 9, 12, 14, 13, 18, 22]}
      hint="Across 5 departments"
    />
    <KpiCard label="Median answer latency" value="1.8s" delta="0.3s slower" deltaDirection="down" hint="p50 over 24h" />
    <KpiCard
      label="Churn risk accounts"
      value="17"
      delta="4 more than last week"
      deltaDirection="up"
      deltaTone="bad"
      hint="Support + Sales signals"
    />
    <KpiCard label="Sources fresh" value="41 / 43" delta="No change" hint="Retry scheduled for 2" />
  </div>
);
