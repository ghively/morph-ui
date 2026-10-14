import { GaugeCluster } from './GaugeCluster';

export default {
  title: 'GaugeCluster',
  component: GaugeCluster,
};

export const Default = () => (
  <GaugeCluster
    label="Fleet health: CPU, memory, disk, network, queue depth"
    gauges={[
      { label: 'CPU', value: 62 },
      { label: 'Memory', value: 81, tone: 'warn' },
      { label: 'Disk', value: 94, tone: 'danger' },
      { label: 'Network', value: 38 },
      { label: 'Queue', value: 12, tone: 'success' },
    ]}
  />
);

export const Pair = () => (
  <GaugeCluster
    label="SLA attainment and error budget remaining"
    gauges={[
      { label: 'Availability', value: 99.7, unit: '%', tone: 'success' },
      { label: 'Error budget', value: 42, unit: '% left' },
    ]}
  />
);
