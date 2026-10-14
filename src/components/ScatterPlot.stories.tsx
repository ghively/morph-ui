import { ScatterPlot } from './ScatterPlot';

export default {
  title: 'ScatterPlot',
  component: ScatterPlot,
};

export const Default = () => (
  <ScatterPlot
    label="Latency vs cost per model"
    height={260}
    formatValue={(v) => (v >= 100 ? `${v}ms` : `$${v.toFixed(2)}`)}
    quadrantLabels={['Fast / cheap', 'Fast / costly', 'Slow / cheap', 'Slow / costly']}
    points={[
      { label: 'mini', x: 120, y: 0.4, weight: 2 },
      { label: 'flash', x: 210, y: 0.9, weight: 1.4 },
      { label: 'pro', x: 420, y: 2.1, weight: 1 },
      { label: 'opus', x: 680, y: 4.2, weight: 0.6, series: 4 },
      { label: 'local-70b', x: 340, y: 1.2, weight: 1.6, series: 1 },
      { label: 'rerank', x: 90, y: 0.2, weight: 1, series: 2 },
    ]}
  />
);

export const QuadrantStudy = () => (
  <ScatterPlot
    label="Adoption vs churn by feature"
    quadrantX={50}
    quadrantY={12}
    quadrantLabels={['Niche / sticky', 'Core / sticky', 'Niche / churning', 'Core / churning']}
    formatValue={(v) => `${v}%`}
    points={[
      { label: 'Search', x: 78, y: 4 },
      { label: 'Uploads', x: 64, y: 7 },
      { label: 'API keys', x: 22, y: 3 },
      { label: 'Mobile push', x: 18, y: 19, series: 4 },
      { label: 'Webhooks', x: 41, y: 15, series: 3 },
      { label: 'SSO', x: 30, y: 9, weight: 0.8 },
    ]}
  />
);

export const SingleBubble = () => (
  <ScatterPlot label="One cohort" points={[{ label: 'Cohort A', x: 5, y: 5, weight: 2 }]} />
);
