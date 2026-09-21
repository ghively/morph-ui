import type { ReactNode } from 'react';
import { AdaptiveBento, type AdaptiveBentoItem } from './AdaptiveBento';

function CardContent({
  title,
  subtitle,
  stat,
  badge,
  children,
}: {
  title: string;
  subtitle?: string;
  stat?: string;
  badge?: string;
  children?: ReactNode;
}) {
  return (
    <div
      style={{
        padding: '1.25rem',
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--app-dim)' }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: '0.85rem', color: 'var(--app-faint)', marginTop: '0.25rem' }}>
              {subtitle}
            </div>
          )}
        </div>
        {badge && (
          <span
            style={{
              fontSize: '0.7rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '999px',
              backgroundColor: 'var(--app-hover)',
              color: 'var(--app-blue)',
              border: '1px solid var(--app-line)',
            }}
          >
            {badge}
          </span>
        )}
      </div>

      {stat && (
        <div style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--app-text)', lineHeight: 1.2 }}>
          {stat}
        </div>
      )}

      {children && <div style={{ fontSize: '0.85rem', color: 'var(--app-dim)' }}>{children}</div>}
    </div>
  );
}

const sampleItems: AdaptiveBentoItem[] = [
  {
    id: 'overview',
    span: 2,
    rowSpan: 2,
    node: (
      <CardContent
        title="Fleet Telemetry"
        subtitle="Real-time multi-agent execution pipeline"
        badge="Active"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span>Success Rate</span>
            <span style={{ color: 'var(--app-text)', fontWeight: 600 }}>99.4%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span>Tasks Completed</span>
            <span style={{ color: 'var(--app-text)', fontWeight: 600 }}>14,289</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span>Avg Response Latency</span>
            <span style={{ color: 'var(--app-text)', fontWeight: 600 }}>184ms</span>
          </div>
        </div>
      </CardContent>
    ),
  },
  {
    id: 'active-agents',
    span: 1,
    rowSpan: 1,
    node: (
      <CardContent
        title="Active Agents"
        stat="24"
        badge="Healthy"
      >
        <span>All nodes responding across 3 regions</span>
      </CardContent>
    ),
  },
  {
    id: 'queue-depth',
    span: 1,
    rowSpan: 1,
    node: (
      <CardContent
        title="Queue Depth"
        stat="3"
        badge="Normal"
      >
        <span>Zero backlog overflow detected</span>
      </CardContent>
    ),
  },
  {
    id: 'banner',
    span: 3,
    rowSpan: 1,
    node: (
      <CardContent
        title="System Event Stream"
        subtitle="Autonomous orchestration engine operating at nominal capacity"
        badge="Live"
      >
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <span>CPU: 22%</span>
          <span>Memory: 4.2 / 16 GB</span>
          <span>Egress: 18.4 MB/s</span>
          <span>Active Connections: 412</span>
        </div>
      </CardContent>
    ),
  },
  {
    id: 'cache-hit',
    span: 1,
    rowSpan: 1,
    node: (
      <CardContent
        title="Cache Hit Ratio"
        stat="94.8%"
      >
        <span>+2.1% from baseline</span>
      </CardContent>
    ),
  },
  {
    id: 'agent-status',
    span: 2,
    rowSpan: 1,
    node: (
      <CardContent
        title="Top Dispatcher"
        subtitle="Primary Claude 3.5 Sonnet router"
        badge="Running"
      >
        <span>Handled 8,492 requests in the last 24 hours with zero retries.</span>
      </CardContent>
    ),
  },
];

export const Default = () => (
  <div style={{ padding: '2rem' }}>
    <AdaptiveBento items={sampleItems} />
  </div>
);

export const CompactDensity = () => (
  <div style={{ padding: '2rem' }}>
    <AdaptiveBento items={sampleItems} density="compact" />
  </div>
);

export const SpanningTiles = () => (
  <div style={{ padding: '2rem' }}>
    <AdaptiveBento
      items={[
        {
          id: 'tile-2x2',
          span: 2,
          rowSpan: 2,
          node: (
            <CardContent
              title="Tile: Span 2, RowSpan 2"
              subtitle="Occupies 2 columns and 2 rows on large screens"
              stat="2 × 2"
            />
          ),
        },
        {
          id: 'tile-1x1-a',
          span: 1,
          rowSpan: 1,
          node: (
            <CardContent
              title="Tile: Span 1, RowSpan 1"
              stat="1 × 1"
            />
          ),
        },
        {
          id: 'tile-1x1-b',
          span: 1,
          rowSpan: 1,
          node: (
            <CardContent
              title="Tile: Span 1, RowSpan 1"
              stat="1 × 1"
            />
          ),
        },
        {
          id: 'tile-3x1',
          span: 3,
          rowSpan: 1,
          node: (
            <CardContent
              title="Tile: Span 3, RowSpan 1"
              subtitle="Full-width span across all 3 columns"
              stat="3 × 1"
            />
          ),
        },
      ]}
    />
  </div>
);

export const Empty = () => (
  <div style={{ padding: '2rem' }}>
    <AdaptiveBento items={[]} />
  </div>
);
