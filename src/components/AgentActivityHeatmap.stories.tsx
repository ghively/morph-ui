import type { StoryDefault, Story } from '@ladle/react';
import { useState } from 'react';
import { AgentActivityHeatmap, type HeatmapDataPoint } from './AgentActivityHeatmap';

const DEFAULT_METRICS = [
  'agent runs/day',
  'messages/day',
  'tool calls/day',
  'failures/day',
  'completed tasks/day',
  'human interventions/day',
];

function generateDailyData(
  days: number,
  metrics: string[],
  seedFn: (dayIndex: number, metric: string) => number
): HeatmapDataPoint[] {
  const result: HeatmapDataPoint[] = [];
  const baseDate = new Date('2026-05-01T00:00:00Z');

  for (let i = 0; i < days; i++) {
    const d = new Date(baseDate);
    d.setUTCDate(d.getUTCDate() + i);
    const dateStr = d.toISOString().slice(0, 10);

    for (const metric of metrics) {
      result.push({
        date: dateStr,
        metric,
        count: seedFn(i, metric),
      });
    }
  }

  return result;
}

const defaultData: HeatmapDataPoint[] = generateDailyData(
  112, // 16 weeks * 7 days
  DEFAULT_METRICS,
  (dayIndex, metric) => {
    const isWeekend = (dayIndex % 7) >= 5;

    switch (metric) {
      case 'agent runs/day':
        return isWeekend
          ? dayIndex % 3 === 0 ? 4 + ((dayIndex * 7) % 12) : 0
          : 18 + ((dayIndex * 17) % 65);
      case 'messages/day':
        return isWeekend
          ? 12 + ((dayIndex * 9) % 35)
          : 110 + ((dayIndex * 41) % 320);
      case 'tool calls/day':
        return isWeekend
          ? 6 + ((dayIndex * 5) % 20)
          : 65 + ((dayIndex * 29) % 210);
      case 'failures/day':
        return dayIndex % 11 === 0 ? 1 + ((dayIndex * 3) % 6) : (dayIndex % 5 === 0 ? 1 : 0);
      case 'completed tasks/day':
        return isWeekend
          ? dayIndex % 2 === 0 ? 2 : 0
          : 14 + ((dayIndex * 19) % 55);
      case 'human interventions/day':
        return dayIndex % 8 === 0 ? 1 + ((dayIndex * 2) % 4) : 0;
      default:
        return 0;
    }
  }
);

export const Default = () => (
  <div style={{ padding: '2rem' }}>
    <AgentActivityHeatmap data={defaultData} />
  </div>
);

export const InteractiveSelection = () => {
  const [selectedCell, setSelectedCell] = useState<{
    date: string;
    metric: string;
    count: number;
  } | null>(null);

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div
        style={{
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          border: '1px solid var(--app-line, rgba(255, 255, 255, 0.1))',
          backgroundColor: 'var(--app-surface, rgba(255, 255, 255, 0.03))',
          fontSize: '0.875rem',
        }}
      >
        {selectedCell ? (
          <span>
            Selected: <strong>{selectedCell.date}</strong> &mdash;{' '}
            <strong style={{ color: 'var(--app-blue, #6c9cf0)' }}>{selectedCell.count}</strong>{' '}
            {selectedCell.metric}
          </span>
        ) : (
          <span style={{ opacity: 0.7 }}>
            Click on any heatmap cell to inspect activity on that date.
          </span>
        )}
      </div>
      <AgentActivityHeatmap
        data={defaultData}
        onCellSelect={(date, metric, count) => setSelectedCell({ date, metric, count })}
      />
    </div>
  );
};

const customMetricsList = [
  'Tokens Ingested (k)',
  'Context Evictions',
  'Subagent Forks',
  'Cache Hits',
];

const customData = generateDailyData(84, customMetricsList, (dayIndex, metric) => {
  if (metric === 'Tokens Ingested (k)') {
    return 150 + ((dayIndex * 37) % 850);
  }
  if (metric === 'Context Evictions') {
    return dayIndex % 4 === 0 ? 2 + ((dayIndex * 5) % 12) : 0;
  }
  if (metric === 'Subagent Forks') {
    return 5 + ((dayIndex * 13) % 45);
  }
  // Cache Hits
  return 800 + ((dayIndex * 71) % 1200);
});

export const CustomMetrics = () => (
  <div style={{ padding: '2rem' }}>
    <AgentActivityHeatmap metrics={customMetricsList} data={customData} />
  </div>
);

const sparseData = generateDailyData(49, ['agent runs/day', 'failures/day'], (dayIndex, metric) => {
  if (metric === 'agent runs/day') {
    return dayIndex % 7 === 2 || dayIndex % 9 === 0 ? 1 + ((dayIndex * 3) % 4) : 0;
  }
  return dayIndex === 14 || dayIndex === 35 ? 1 : 0;
});

export const SparseActivity = () => (
  <div style={{ padding: '2rem' }}>
    <AgentActivityHeatmap metrics={['agent runs/day', 'failures/day']} data={sparseData} />
  </div>
);

export const Empty = () => (
  <div style={{ padding: '2rem' }}>
    <AgentActivityHeatmap data={[]} />
  </div>
);
