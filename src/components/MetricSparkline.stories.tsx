import { MetricSparkline } from './MetricSparkline';

export const Default = () => (
  <div style={{ padding: '2rem' }}>
    <MetricSparkline
      label="Throughput"
      value="1,420 req/s"
      series={[820, 932, 901, 934, 1290, 1330, 1320, 1420]}
    />
  </div>
);

export const TrendDown = () => (
  <div style={{ padding: '2rem' }}>
    <MetricSparkline
      label="P99 Latency"
      value="42 ms"
      series={[180, 165, 142, 110, 95, 78, 55, 42]}
    />
  </div>
);

export const TrendNeutral = () => (
  <div style={{ padding: '2rem' }}>
    <MetricSparkline
      label="Memory Allocation"
      value="4.0 GB"
      series={[4.0, 4.2, 3.9, 4.5, 4.1, 4.3, 4.0]}
    />
  </div>
);

export const SinglePoint = () => (
  <div style={{ padding: '2rem' }}>
    <MetricSparkline
      label="System Health"
      value="100%"
      series={[100]}
    />
  </div>
);

export const EmptySeries = () => (
  <div style={{ padding: '2rem' }}>
    <MetricSparkline
      label="Cold Boot"
      value="0 rpm"
      series={[]}
    />
  </div>
);
