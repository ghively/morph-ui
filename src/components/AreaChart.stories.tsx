import { AreaChart } from './AreaChart';

export default {
  title: 'AreaChart',
  component: AreaChart,
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const Default = () => (
  <AreaChart
    label="Storage cost per month (dollars)"
    formatValue={(v) => `$${v}`}
    labels={MONTHS}
    series={[
      { label: 'Compute', values: [12, 14, 13, 16, 18, 22, 21, 25, 28, 27, 31, 34] },
      { label: 'Storage', values: [4, 5, 6, 6, 7, 8, 9, 10, 12, 13, 14, 16] },
      { label: 'Egress', values: [1, 2, 2, 3, 3, 4, 5, 5, 6, 7, 8, 9] },
    ]}
  />
);

export const FlatFills = () => (
  <AreaChart
    gradient={false}
    label="Requests per month (thousands)"
    formatValue={(v) => `${v}k`}
    labels={MONTHS}
    series={[
      { label: 'Search', values: [40, 44, 41, 52, 58, 55, 62, 70, 68, 74, 80, 86] },
      { label: 'Ingest', values: [18, 20, 24, 22, 26, 30, 28, 32, 36, 34, 38, 42] },
    ]}
  />
);

export const SingleSeries = () => (
  <AreaChart
    label="Latency p95 per month (ms)"
    labels={MONTHS.slice(0, 6)}
    series={[{ label: 'p95', values: [210, 198, 225, 240, 232, 218] }]}
  />
);
