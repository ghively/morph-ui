import { GaugeChart } from './GaugeChart';

export default {
  title: 'GaugeChart',
  component: GaugeChart,
};

export const Zones = () => (
  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
    <GaugeChart
      label="Answer SLA compliance"
      value={94}
      centerLabel="94%"
      zones={[{ upTo: 70, tone: 'bad' }, { upTo: 90, tone: 'ok' }, { upTo: 100, tone: 'good' }]}
    />
    <GaugeChart label="Quota fill" value={38} centerLabel="38%" />
  </div>
);
