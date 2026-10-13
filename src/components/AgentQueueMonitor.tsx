import './AgentQueueMonitor.css';
import { useMemo } from 'react';
export type QueueLane = 'queued' | 'running' | 'done';
export interface QueueAgent { id: string; label: string; lane: QueueLane; waitMs?: number; meta?: string }
export interface AgentQueueMonitorProps { agents: QueueAgent[]; title?: string; className?: string }
export function AgentQueueMonitor({ agents, title = 'Agent queue', className = '' }: AgentQueueMonitorProps) {
  const counts = useMemo(() => ({ queued: agents.filter(a => a.lane === 'queued').length, running: agents.filter(a => a.lane === 'running').length, done: agents.filter(a => a.lane === 'done').length }), [agents]);
  const waits = agents.filter(a => a.waitMs != null).map(a => a.waitMs!);
  const avg = waits.length ? Math.round(waits.reduce((a, b) => a + b, 0) / waits.length) : 0;
  return <section className={'agent-queue-monitor ' + className} data-agent-queue="" aria-label={title}>
    <header><div><span className="aq-kicker">OPERATIONS</span><h2>{title}</h2></div><div className="aq-summary"><b>{counts.running}</b><span>live</span><b>{avg}ms</b><span>avg wait</span></div></header>
    <div className="aq-lanes">{(['queued','running','done'] as QueueLane[]).map(lane => <div className="aq-lane" data-lane={lane} key={lane}><div className="aq-lane-head"><span>{lane}</span><b>{counts[lane]}</b></div><div className="aq-list">{agents.filter(a => a.lane === lane).map(a => <div className="aq-row" key={a.id}><span className="aq-dot"/><div><strong>{a.label}</strong><small>{a.meta ?? (a.waitMs != null ? a.waitMs + 'ms wait' : 'No wait')}</small></div></div>)}</div></div>)}</div>
  </section>;
}
export type { AgentQueueMonitorProps as QueueMonitorProps };