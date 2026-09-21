import { RunTimeline, type RunTimelineStep } from './RunTimeline';

const frame: React.CSSProperties = {
  padding: '2rem',
  maxWidth: '560px',
  fontFamily: 'system-ui, -apple-system, sans-serif',
};

const base = new Date('2026-09-20T23:40:00Z').getTime();
const at = (offsetSeconds: number) => new Date(base + offsetSeconds * 1000).toISOString();

const steps: RunTimelineStep[] = [
  {
    id: 'checkout',
    label: 'Checkout main',
    status: 'succeeded',
    startedAt: at(0),
    endedAt: at(4),
    detail: 'Resolved 3b96784 on origin/main',
  },
  {
    id: 'install',
    label: 'pnpm install --frozen-lockfile',
    status: 'succeeded',
    startedAt: at(4),
    endedAt: at(31),
    detail: '812 packages, lockfile unchanged',
  },
  {
    id: 'typecheck',
    label: 'pnpm typecheck',
    status: 'succeeded',
    startedAt: at(31),
    endedAt: at(45),
  },
  {
    id: 'test',
    label: 'pnpm test',
    status: 'running',
    startedAt: at(45),
    detail: '86 test files, 284 tests in flight',
  },
  {
    id: 'catalog',
    label: 'pnpm catalog:build',
    status: 'pending',
  },
];

export const Default = () => (
  <div style={frame}>
    <RunTimeline steps={steps} />
  </div>
);

export const Dense = () => (
  <div style={frame}>
    <RunTimeline steps={steps} dense />
  </div>
);

export const FailedRun = () => {
  const failed: RunTimelineStep[] = [
    { id: 'checkout', label: 'Checkout main', status: 'succeeded', startedAt: at(0), endedAt: at(3) },
    { id: 'install', label: 'pnpm install', status: 'succeeded', startedAt: at(3), endedAt: at(28) },
    {
      id: 'lint',
      label: 'pnpm lint',
      status: 'failed',
      startedAt: at(28),
      endedAt: at(39),
      detail: "2 errors: '@typescript-eslint/no-unused-vars' in ToolCallCard.stories.tsx",
    },
    { id: 'test', label: 'pnpm test', status: 'pending' },
  ];

  return (
    <div style={frame}>
      <RunTimeline steps={failed} />
    </div>
  );
};
