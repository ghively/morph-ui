import { HealthCheckPanel } from './HealthCheckPanel';

export default {
  title: 'HealthCheckPanel',
  component: HealthCheckPanel,
};

export const MixedFleet = () => (
  <HealthCheckPanel
    services={[
      {
        id: 'api',
        name: 'Gateway API',
        status: 'ok',
        latency: [42, 38, 51, 44, 40, 47, 39, 43],
        uptime: 0.9998,
      },
      {
        id: 'db',
        name: 'Primary database',
        status: 'degraded',
        latency: [12, 15, 84, 220, 310, 260, 290, 240],
        note: 'Failover to replica in progress',
        uptime: 0.9972,
      },
      {
        id: 'vector',
        name: 'Vector index',
        status: 'ok',
        latency: [95, 102, 88, 91, 99, 93, 90, 97],
        uptime: 0.9999,
      },
      {
        id: 'mail',
        name: 'Outbound mail',
        status: 'down',
        latency: [120, 140, 830, 1200, 990, 1100, 1450, 1380],
        note: 'Provider unreachable from eu-west',
        uptime: 0.941,
      },
    ]}
  />
);

export const AllOperational = () => (
  <HealthCheckPanel
    title="Edge status"
    services={[
      { id: 'a', name: 'us-east', status: 'ok', latency: [18, 21, 19, 22, 20, 19], uptime: 1 },
      { id: 'b', name: 'eu-west', status: 'ok', latency: [24, 26, 23, 25, 27, 24], uptime: 1 },
      { id: 'c', name: 'ap-south', status: 'ok', latency: [31, 34, 30, 33, 32, 31], uptime: 0.9999 },
    ]}
  />
);

export const NoSamples = () => (
  <HealthCheckPanel
    services={[
      { id: 'x', name: 'Batch worker', status: 'ok', uptime: 0.999 },
      { id: 'y', name: 'Webhooks', status: 'degraded', note: 'Queue backlog 4k' },
    ]}
  />
);
