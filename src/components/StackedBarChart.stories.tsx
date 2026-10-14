import { StackedBarChart } from './StackedBarChart';

export default {
  title: 'StackedBarChart',
  component: StackedBarChart,
};

const MODELS = ['mini', 'flash', 'pro', 'opus'];
const TASKS = ['Chat', 'Embed', 'Rerank', 'Vision'];

export const Vertical = () => (
  <StackedBarChart
    label="Weekly tokens by task per model (millions)"
    formatValue={(v) => `${v}M`}
    categories={MODELS}
    series={[
      { label: 'Chat', values: [120, 90, 60, 20] },
      { label: 'Embed', values: [40, 65, 10, 0] },
      { label: 'Rerank', values: [10, 25, 15, 5] },
      { label: 'Vision', values: [0, 12, 8, 18] },
    ]}
  />
);

export const Horizontal = () => (
  <StackedBarChart
    label="Weekly tokens by task per model (millions), horizontal"
    orientation="horizontal"
    formatValue={(v) => `${v}M`}
    categories={MODELS}
    series={TASKS.map((t, i) => ({
      label: t,
      values: MODELS.map((m) => [120, 90, 60, 20][i]! + (i + 1) * (m.length % 3)),
    }))}
  />
);

export const NoValues = () => (
  <StackedBarChart
    label="Incidents by severity per service"
    showValues={false}
    categories={['api', 'web', 'worker']}
    series={[
      { label: 'Sev1', values: [1, 0, 2] },
      { label: 'Sev2', values: [3, 2, 4] },
      { label: 'Sev3', values: [6, 8, 5] },
    ]}
  />
);
