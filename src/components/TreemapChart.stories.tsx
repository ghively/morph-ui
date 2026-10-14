import { TreemapChart } from './TreemapChart';

export default {
  title: 'TreemapChart',
  component: TreemapChart,
};

export const Default = () => (
  <TreemapChart
    label="Monthly spend by service (dollars)"
    formatValue={(v) => `$${v}`}
    height={260}
    data={[
      { label: 'Compute', value: 3200 },
      { label: 'Storage', value: 1400 },
      { label: 'Egress', value: 620 },
      { label: 'DNS', value: 90 },
      { label: 'Monitoring', value: 240 },
    ]}
  />
);

export const NestedGroups = () => (
  <TreemapChart
    label='Disk usage by "project"'
    height={280}
    data={[
      {
        label: 'media',
        value: 900,
        children: [
          { label: 'movies', value: 620 },
          { label: 'music', value: 180 },
          { label: 'books', value: 100 },
        ],
      },
      {
        label: 'work',
        value: 480,
        children: [
          { label: 'repos', value: 300 },
          { label: 'vm-images', value: 180 },
        ],
      },
      { label: 'backups', value: 350 },
      { label: 'system', value: 120 },
    ]}
  />
);
