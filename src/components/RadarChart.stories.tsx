import { RadarChart } from './RadarChart';

export default {
  title: 'RadarChart',
  component: RadarChart,
};

const AXES = ['Speed', 'Cost', 'Quality', 'Context', 'Safety'];

export const Default = () => (
  <RadarChart
    label="Model capability profile (0–10)"
    axes={AXES}
    series={[
      { label: 'Frontier XL', values: [6, 3, 10, 9, 8] },
      { label: 'Workhorse', values: [8, 8, 7, 6, 7] },
      { label: 'Mini', values: [10, 10, 5, 4, 6] },
    ]}
  />
);

export const TwoSeries = () => (
  <RadarChart
    label="Sprint health before and after the migration"
    axes={['Velocity', 'Review time', 'Escapes', 'Uptime', 'Happiness']}
    series={[
      { label: 'Before', values: [5, 3, 8, 6, 4] },
      { label: 'After', values: [8, 7, 3, 9, 7] },
    ]}
  />
);
