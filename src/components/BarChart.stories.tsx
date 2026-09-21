import { BarChart } from './BarChart';

export default {
  title: 'BarChart',
  component: BarChart,
};

export const Default = () => (
  <BarChart
    label="Queries by department, last 7 days"
    data={[
      { label: 'Sales', value: 412 },
      { label: 'Support', value: 388 },
      { label: 'Eng', value: 241 },
      { label: 'Finance', value: 156 },
      { label: 'HR', value: 87 },
    ]}
  />
);

export const Empty = () => <BarChart data={[]} label="Queries by department" />;
