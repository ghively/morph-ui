import { DonutChart } from './DonutChart';

export default {
  title: 'DonutChart',
  component: DonutChart,
};

export const Default = () => (
  <DonutChart
    label="Corpus share by department"
    centerLabel="184k"
    formatValue={(v) => `${v}k`}
    segments={[
      { label: 'Support', value: 120 },
      { label: 'Sales', value: 48 },
      { label: 'Finance', value: 9 },
      { label: 'HR', value: 7 },
    ]}
  />
);

export const Empty = () => <DonutChart segments={[]} label="Corpus share by department" />;
