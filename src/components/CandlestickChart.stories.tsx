import { CandlestickChart } from './CandlestickChart';

export default {
  title: 'CandlestickChart',
  component: CandlestickChart,
};

export const Default = () => (
  <CandlestickChart
    label="Daily token price (cents per million)"
    formatValue={(v) => `${v.toFixed(1)}¢`}
    candles={[
      { label: 'Mon', open: 42, high: 47.5, low: 41, close: 46.2 },
      { label: 'Tue', open: 46.2, high: 48.8, low: 44.1, close: 45.0 },
      { label: 'Wed', open: 45.0, high: 45.4, low: 40.2, close: 41.1 },
      { label: 'Thu', open: 41.1, high: 44.9, low: 40.8, close: 44.3 },
      { label: 'Fri', open: 44.3, high: 49.6, low: 43.9, close: 48.9 },
      { label: 'Sat', open: 48.9, high: 50.2, low: 46.5, close: 47.1 },
      { label: 'Sun', open: 47.1, high: 47.8, low: 43.0, close: 43.6 },
    ]}
  />
);

export const Downtrend = () => (
  <CandlestickChart
    label="Weekly spend (dollars)"
    formatValue={(v) => `$${v}`}
    candles={[
      { label: 'W1', open: 120, high: 138, low: 116, close: 131 },
      { label: 'W2', open: 131, high: 133, low: 114, close: 118 },
      { label: 'W3', open: 118, high: 124, low: 102, close: 105 },
      { label: 'W4', open: 105, high: 112, low: 97, close: 99 },
      { label: 'W5', open: 99, high: 104, low: 88, close: 91 },
    ]}
  />
);
