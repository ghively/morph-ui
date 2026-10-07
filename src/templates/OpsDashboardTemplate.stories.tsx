import { OpsDashboardTemplate, demoOpsDashboard } from './OpsDashboardTemplate';

export default {
  title: 'Templates/OpsDashboard',
};

/** Incident overview with live data: KPIs, error-rate trend, error budget, incidents and service health. */
export const Default = () => <OpsDashboardTemplate {...demoOpsDashboard} />;

/** First load: figures are skeletons and the incident table shows a spinner. */
export const Loading = () => <OpsDashboardTemplate {...demoOpsDashboard} loading />;

/** A quiet window: no incidents, so the table card shows an EmptyState. */
export const NoIncidents = () => (
  <OpsDashboardTemplate
    {...demoOpsDashboard}
    incidents={[]}
    filters={[]}
    kpis={demoOpsDashboard.kpis.map((k) => (k.id === 'open' ? { ...k, value: '0', delta: '3 fewer than yesterday', deltaDirection: 'down', deltaTone: 'success', spark: [3, 2, 2, 1, 1, 0, 0] } : k))}
  />
);

/** Phone width: header controls stack, KPIs go 2-up, the rail drops under the incidents. */
export const Narrow = () => (
  <div style={{ maxWidth: 380 }}>
    <OpsDashboardTemplate {...demoOpsDashboard} />
  </div>
);
