/**
 * AgentWorkspaceTemplate — a full AI agent chat workspace composed from library components.
 *
 * Layout: a header (conversation title, agent presence, ModelSelector), then three columns —
 * ConversationList on the left, a message log (MessageTile turns, ToolCallCard tool calls, a
 * StreamingMessage answer with CitationPills) above a MessageComposer in the centre, and a run
 * context pane (AgentCard, ContextMeter, PlanChecklist, ApprovalGate for the pending tool call)
 * on the right. Below ~900px of container width the side panes collapse behind header toggles.
 * With no entries the centre shows an EmptyState with FollowUpChips starter prompts.
 *
 * Presentational: all data comes in as props (demo defaults exported as `demoAgentWorkspace`),
 * interactivity is local state only, and every timestamp is fixed. Size it with a parent that
 * has a definite height; the template fills it and lets its regions scroll.
 *
 * Provenance: original morph-ui composition (2026-10).
 */
import { useState } from 'react';
import './AgentWorkspaceTemplate.css';
import { ConversationList, type ConversationGroup } from '../components/ConversationList';
import { MessageTile } from '../components/MessageTile';
import type { TimelineMessage, AccentSlot } from '../components/MessageTimeline';
import { StreamingMessage } from '../components/StreamingMessage';
import { ToolCallCard, type ToolCallCardProps } from '../components/ToolCallCard';
import { CitationPills, type Citation } from '../components/CitationPills';
import { MessageComposer, type ComposerDraft } from '../components/MessageComposer';
import { ModelSelector, type ModelInfo } from '../components/ModelSelector';
import { AgentPresence, type AgentPresenceState } from '../components/AgentPresence';
import { AgentCard, type AgentStatus } from '../components/AgentCard';
import { ContextMeter } from '../components/ContextMeter';
import { PlanChecklist, type PlanStep } from '../components/PlanChecklist';
import { ApprovalGate } from '../components/ApprovalGate';
import { EmptyState } from '../components/EmptyState';
import { FollowUpChips } from '../components/FollowUpChips';
import { Button } from '../components/Button';
import { GlyphIcon } from '../components/GlyphIcon';

/** One row of the centre log. */
export type WorkspaceEntry =
  | { type: 'message'; id: string; message: TimelineMessage }
  | { type: 'tool'; id: string; call: Omit<ToolCallCardProps, 'className'> }
  | { type: 'answer'; id: string; label?: string; chunks: string[]; done: boolean; citations?: Citation[] };

export interface WorkspaceAgent {
  name: string;
  role?: string;
  status: AgentStatus;
  presence: AgentPresenceState;
  capabilities?: string[];
  lastActive?: string;
}

export interface WorkspaceApproval {
  /** The `tool` entry this gate unblocks; its status follows the decision. */
  toolEntryId?: string;
  title: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  actionSummary: string;
}

export interface AgentWorkspaceTemplateProps {
  title?: string;
  conversations?: ConversationGroup[];
  activeConversationId?: string | null;
  models?: ModelInfo[];
  modelId?: string;
  entries?: WorkspaceEntry[];
  agent?: WorkspaceAgent;
  context?: { used: number; total: number; breakdown?: { label: string; value: number }[] };
  plan?: PlanStep[];
  approval?: WorkspaceApproval | null;
  starterPrompts?: string[];
  /** Fixed clock for messages the user sends from the composer (ms since epoch). */
  now?: number;
  className?: string;
}

/* ── Demo data (fixed clock: 2026-03-12 10:30 UTC) ─────────────────────── */
const T0 = Date.UTC(2026, 2, 12, 10, 30);
const MIN = 60_000;
const ME = '@you:morph.dev';

const demoAgentInfo: WorkspaceAgent = {
  name: 'Atlas',
  role: 'Release engineer',
  status: 'busy',
  presence: 'waiting',
  capabilities: ['git', 'ci', 'changelog'],
  lastActive: 'just now',
};

export const demoAgentWorkspace = {
  title: 'Ship the 2.4 release notes',
  activeConversationId: 'c1',
  conversations: [
    { id: 'today', label: 'Today', conversations: [
      { id: 'c1', name: 'Ship the 2.4 release notes' },
      { id: 'c2', name: 'Flaky e2e on Safari', unread: 3 },
    ] },
    { id: 'week', label: 'This week', conversations: [
      { id: 'c3', name: 'Token audit for dark mode' },
      { id: 'c4', name: 'Migrate catalog to Ladle 5', highlight: 1 },
      { id: 'c5', name: 'Draft onboarding email' },
    ] },
  ] as ConversationGroup[],
  models: [
    { id: 'large', label: 'Morph Large', vendor: 'Morph', contextWindow: 200000, tags: ['reasoning'], enabled: true },
    { id: 'medium', label: 'Morph Medium', vendor: 'Morph', contextWindow: 128000, tags: ['balanced'], enabled: true },
    { id: 'small', label: 'Morph Small', vendor: 'Morph', contextWindow: 32000, tags: ['fast'], enabled: true },
  ] as ModelInfo[],
  modelId: 'large',
  entries: [
    { type: 'message', id: 'm1', message: {
      id: 'm1', senderId: ME, senderName: 'You', mine: true, ts: T0, kind: 'text', sendState: 'sent',
      text: 'Draft the 2.4 release notes from the merged PRs, then tag the release.',
      preview: 'Draft the 2.4 release notes…',
    } },
    { type: 'tool', id: 't1', call: { toolName: 'list_merged_prs', args: { since: 'v2.3.0', base: 'main' }, status: 'succeeded', duration: 412, result: { count: 14 } } },
    { type: 'tool', id: 't2', call: { toolName: 'read_file', args: { path: 'CHANGELOG.md', limit: 80 }, status: 'succeeded', duration: 36, result: { lines: 80 } } },
    { type: 'answer', id: 'a1', label: 'Atlas', done: true, citations: [
      { id: 'pr-812', title: '#812 ModelSelector search' },
      { id: 'pr-820', title: '#820 Frame-scoped theming' },
      { id: 'pr-827', title: '#827 ToolCallCard durations' },
    ], chunks: [
      'Here is the draft for **2.4**. Fourteen PRs landed since `v2.3.0`; I grouped them into three themes.\n\n',
      '*Highlights:* model search in `ModelSelector`, theming a single frame instead of `:root`, and tool-call durations.\n\n',
      'Next I will tag the release — that step needs your approval.',
    ] },
    { type: 'tool', id: 't3', call: { toolName: 'git_tag', args: { tag: 'v2.4.0', push: true }, status: 'pending' } },
  ] as WorkspaceEntry[],
  agent: demoAgentInfo,
  context: { used: 61400, total: 200000, breakdown: [
    { label: 'System', value: 6200 },
    { label: 'History', value: 31800 },
    { label: 'Tools', value: 23400 },
  ] },
  plan: [
    { id: 'p1', label: 'Collect merged PRs', detail: '14 since v2.3.0', state: 'done' },
    { id: 'p2', label: 'Draft release notes', detail: '3 themes', state: 'done' },
    { id: 'p3', label: 'Tag v2.4.0', detail: 'awaiting approval', state: 'blocked' },
    { id: 'p4', label: 'Publish to changelog', state: 'todo' },
  ] as PlanStep[],
  approval: {
    toolEntryId: 't3',
    title: 'Push tag v2.4.0',
    description: 'Creates and pushes the v2.4.0 tag to origin, which starts the publish workflow.',
    riskLevel: 'medium',
    actionSummary: 'git push origin v2.4.0',
  } as WorkspaceApproval,
  starterPrompts: [
    'Summarise what changed since the last release',
    'Find flaky tests in the last 20 CI runs',
    'Draft a migration guide for the new tokens',
  ],
  now: T0 + 5 * MIN,
};

const ACCENT: AccentSlot = 'blue';

export function AgentWorkspaceTemplate({
  title = demoAgentWorkspace.title,
  conversations = demoAgentWorkspace.conversations,
  activeConversationId = demoAgentWorkspace.activeConversationId,
  models = demoAgentWorkspace.models,
  modelId = demoAgentWorkspace.modelId,
  entries: initialEntries = demoAgentWorkspace.entries,
  agent = demoAgentWorkspace.agent,
  context = demoAgentWorkspace.context,
  plan: initialPlan = demoAgentWorkspace.plan,
  approval = demoAgentWorkspace.approval,
  starterPrompts = demoAgentWorkspace.starterPrompts,
  now = demoAgentWorkspace.now,
  className = '',
}: AgentWorkspaceTemplateProps) {
  const [filter, setFilter] = useState('');
  const [activeId, setActiveId] = useState(activeConversationId);
  const [model, setModel] = useState(modelId);
  const [entries, setEntries] = useState(initialEntries);
  const [plan, setPlan] = useState(initialPlan);
  const [draft, setDraft] = useState<ComposerDraft>({ text: '', mentions: [] });
  const [citeId, setCiteId] = useState<string | undefined>();
  const [pane, setPane] = useState<'none' | 'left' | 'ctx'>('none');
  const [presence, setPresence] = useState(agent.presence);
  const [sent, setSent] = useState(0);


  const send = (d: ComposerDraft) => {
    const text = d.text.trim();
    if (!text) return;
    const id = 'sent-' + sent;
    setSent(n => n + 1);
    setEntries(list => [...list, { type: 'message', id, message: {
      id, senderId: ME, senderName: 'You', mine: true, ts: now + sent * MIN, kind: 'text', sendState: 'sent', text, preview: text,
    } }]);
    setDraft({ text: '', mentions: [] });
  };

  const resolve = (approved: boolean) => {
    const toolId = approval?.toolEntryId;
    if (toolId) {
      setEntries(list => list.map(e => e.type === 'tool' && e.id === toolId
        ? { ...e, call: { ...e.call, status: approved ? 'running' : 'failed', error: approved ? undefined : 'Denied by the user.' } }
        : e));
    }
    setPlan(steps => steps.map(s => s.state === 'blocked' ? { ...s, state: approved ? 'active' : 'blocked', detail: approved ? 'approved' : 'denied by the user' } : s));
    setPresence(approved ? 'tool-use' : 'idle');
  };

  const togglePane = (p: 'left' | 'ctx') => setPane(cur => (cur === p ? 'none' : p));
  const empty = entries.length === 0;

  return (
    <div className={'agent-ws ' + className} data-agent-workspace="" data-pane={pane}>
      <header className="agent-ws-head">
        <span className="agent-ws-toggle">
          <Button variant="ghost" size="sm" aria-label="Conversations" aria-expanded={pane === 'left'} onClick={() => togglePane('left')}>
            <GlyphIcon name="chats" size={16} />
          </Button>
        </span>
        <div className="agent-ws-heading">
          <AgentPresence state={presence} size="xs" label={agent.name + ' is ' + presence} />
          <h1 className="agent-ws-title">{empty ? 'New conversation' : title}</h1>
        </div>
        <div className="agent-ws-tools">
          <ModelSelector models={models} selectedId={model} onSelect={setModel} />
          <span className="agent-ws-toggle">
            <Button variant="ghost" size="sm" aria-label="Run context" aria-expanded={pane === 'ctx'} onClick={() => togglePane('ctx')}>
              <GlyphIcon name="dashboard" size={16} />
            </Button>
          </span>
        </div>
      </header>

      <div className="agent-ws-body">
        <div className="agent-ws-left" data-agent-ws-pane="left">
          <ConversationList groups={conversations} activeId={activeId} filter={filter} onFilterChange={setFilter}
            onSelect={id => { setActiveId(id); setPane('none'); }} />
        </div>

        <main className="agent-ws-main" aria-labelledby="agent-ws-messages">
          <h2 id="agent-ws-messages" className="agent-ws-sr">Messages</h2>
          {empty ? (
            <div className="agent-ws-empty">
              <EmptyState title={'Start a conversation with ' + agent.name} icon={<GlyphIcon name="agents" size={18} />}>
                Ask a question or pick a starter prompt. {agent.name} can use {(agent.capabilities ?? []).join(', ') || 'its tools'}.
              </EmptyState>
              <FollowUpChips label="Try asking" suggestions={starterPrompts} onPick={s => setDraft({ text: s, mentions: [] })} />
            </div>
          ) : (
            <div className="agent-ws-log" role="log" aria-label="Conversation messages" tabIndex={0}>
              {entries.map(e => (
                <div key={e.id} className="agent-ws-entry" data-entry={e.type}>
                  {e.type === 'message' && <MessageTile message={e.message} accent={ACCENT} />}
                  {e.type === 'tool' && <ToolCallCard {...e.call} />}
                  {e.type === 'answer' && (
                    <div className="agent-ws-answer">
                      <StreamingMessage chunks={e.chunks} done={e.done} label={e.label} />
                      {e.citations && e.citations.length > 0 && (
                        <div className="agent-ws-sources">
                          <span>Sources</span>
                          <CitationPills citations={e.citations} activeId={citeId} onSelect={setCiteId} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="agent-ws-composer">
            <MessageComposer draft={draft} onDraftChange={setDraft} onSend={send} autoFocus={false}
              placeholder={'Message ' + agent.name + '…'} />
          </div>
        </main>

        <aside className="agent-ws-ctx" data-agent-ws-pane="ctx" aria-labelledby="agent-ws-ctx-h">
          <h2 id="agent-ws-ctx-h" className="agent-ws-eyebrow">Run context</h2>
          {approval && (
            <section className="agent-ws-approval" aria-labelledby="agent-ws-approval-h">
              <h3 id="agent-ws-approval-h" className="agent-ws-eyebrow">Needs approval</h3>
              <ApprovalGate title={approval.title} description={approval.description} riskLevel={approval.riskLevel}
                actionSummary={approval.actionSummary} onResolve={resolve} />
            </section>
          )}
          <AgentCard name={agent.name} role={agent.role} status={agent.status} capabilities={agent.capabilities} lastActive={agent.lastActive} />
          <ContextMeter used={context.used} total={context.total} breakdown={context.breakdown} />
          {plan.length > 0 && <PlanChecklist steps={plan} label="Plan" />}
        </aside>
      </div>
    </div>
  );
}
