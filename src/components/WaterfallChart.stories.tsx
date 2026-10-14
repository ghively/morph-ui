import { WaterfallChart } from './WaterfallChart';

export default {
  title: 'WaterfallChart',
  component: WaterfallChart,
};

export const Default = () => (
  <WaterfallChart
    label="Monthly cost bridge (dollars)"
    formatValue={(v) => `$${Math.abs(v)}`}
    steps={[
      { label: 'Start', value: 1200, kind: 'total' },
      { label: 'GPU rent', value: +320 },
      { label: 'API spend', value: +180 },
      { label: 'Cache wins', value: -240 },
      { label: 'Reserved', value: -150 },
      { label: 'End', value: 1310, kind: 'total' },
    ]}
  />
);

export const HeadcountBridge = () => (
  <WaterfallChart
    label="Team headcount change this quarter"
    steps={[
      { label: 'Q2 end', value: 24, kind: 'total' },
      { label: 'Hires', value: +6 },
      { label: 'Transfers in', value: +2 },
      { label: 'Attrition', value: -3 },
      { label: 'Transfers out', value: -1 },
      { label: 'Q3 end', value: 28, kind: 'total' },
    ]}
  />
);
