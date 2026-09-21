import { CostMeter } from './CostMeter';

export default {
  title: 'CostMeter',
  component: CostMeter,
};

const usd = (v: number) => `$${v.toFixed(2)}`;

export const Healthy = () => (
  <div style={{ maxWidth: 320 }}>
    <CostMeter spent={1.84} budget={5} formatValue={usd} label="Nightly digest run" />
  </div>
);

export const OverBudget = () => (
  <div style={{ maxWidth: 320 }}>
    <CostMeter spent={6.2} budget={5} formatValue={usd} label="Deep research run" />
  </div>
);
