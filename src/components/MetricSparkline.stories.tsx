import { MetricSparkline } from './MetricSparkline';

const grid = { display: 'grid', gap: 8, maxWidth: 420 } as const;

export const Default = () => (
  <div style={grid}>
    <MetricSparkline label="Throughput" value="1,420 req/s" period="24h" series={[820, 932, 901, 934, 1290, 1330, 1320, 1420]} />
  </div>
);

export const ListOfMetrics = () => (
  <div style={grid}>
    <MetricSparkline label="Throughput" value="1,420 req/s" period="24h" series={[820, 932, 901, 934, 1290, 1330, 1320, 1420]} />
    <MetricSparkline label="P99 latency" value="42 ms" period="24h" invert series={[180, 165, 142, 110, 95, 78, 55, 42]} />
    <MetricSparkline label="Error rate" value="2.4%" period="24h" invert series={[0.8, 0.9, 0.7, 1.1, 1.6, 1.9, 2.2, 2.4]} />
    <MetricSparkline label="Memory" value="4.0 GB" period="1h" series={[4.0, 4.2, 3.9, 4.5, 4.1, 4.3, 4.0]} />
  </div>
);

export const EdgeCases = () => (
  <div style={grid}>
    <MetricSparkline label="System health" value="100%" series={[100]} />
    <MetricSparkline label="Cold boot" value="0 rpm" series={[]} />
  </div>
);
