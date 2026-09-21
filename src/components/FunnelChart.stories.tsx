import { FunnelChart } from './FunnelChart';

export default {
  title: 'FunnelChart',
  component: FunnelChart,
};

export const Default = () => (
  <div style={{ maxWidth: 480 }}>
    <FunnelChart
      label="Answer pipeline, last 7 days"
      stages={[
        { label: 'Queries', value: 8988 },
        { label: 'Retrieved', value: 8120 },
        { label: 'Cited answers', value: 6404 },
        { label: 'Marked resolved', value: 3981 },
      ]}
    />
  </div>
);
