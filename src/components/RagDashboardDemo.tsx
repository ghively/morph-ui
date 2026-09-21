import { useEffect, useState } from 'react';
import './RagDashboardDemo.css';
import { Breadcrumbs } from './Breadcrumbs';
import { Button } from './Button';
import { Badge } from './Badge';
import { Tabs } from './Tabs';
import { KpiCard } from './KpiCard';
import { Card } from './Card';
import { BarChart } from './BarChart';
import { DonutChart } from './DonutChart';
import { LineChart } from './LineChart';
import { DataTable } from './DataTable';
import { FilterBar } from './FilterBar';
import { SearchField } from './SearchField';
import { MultiSelect } from './MultiSelect';
import { DateRangePicker } from './DateRangePicker';
import type { DateRange } from './DateRangePicker';
import { Slider } from './Slider';
import { GroundingBadge } from './GroundingBadge';
import { CitationPills } from './CitationPills';
import { SourceCardList } from './SourceCardList';
import { StreamingStageIndicator } from './StreamingStageIndicator';
import type { RagStage } from './StreamingStageIndicator';
import { RetrievalInspector } from './RetrievalInspector';
import { AnswerFeedback } from './AnswerFeedback';
import { VariablePromptInput } from './VariablePromptInput';
import { FollowUpChips } from './FollowUpChips';
import { ContextAttributionList } from './ContextAttributionList';
import { TreeView } from './TreeView';
import { FileDropzone } from './FileDropzone';
import { ProgressBar } from './ProgressBar';
import { Drawer } from './Drawer';
import { ConfirmDialog } from './ConfirmDialog';
import { DropdownMenu } from './DropdownMenu';
import { NotificationCenter } from './NotificationCenter';
import type { Notification } from './NotificationCenter';

const DEPTS = [
  { value: 'sales', label: 'Sales' },
  { value: 'support', label: 'Support' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'finance', label: 'Finance' },
];

const SOURCES = [
  { source: 'Ticket archive', department: 'Support', chunks: 120408, freshness: '4m ago', fresh: true },
  { source: 'Sales CRM', department: 'Sales', chunks: 48210, freshness: '12m ago', fresh: true },
  { source: 'Runbooks', department: 'Engineering', chunks: 8944, freshness: '1h ago', fresh: true },
  { source: 'Q3 filings', department: 'Finance', chunks: 3210, freshness: '6h ago', fresh: false },
];

const ANSWER_SOURCES = [
  { id: 's1', title: 'March refund policy update', excerpt: 'Digital-goods refunds extend from 14 to 30 days when the account is in good standing…', department: 'Support', score: 0.91 },
  { id: 's2', title: 'Billing queue weekly review', excerpt: 'Refund-tagged tickets grew 8% WoW; 61% cite the extended window as the reason for contact…', department: 'Support', score: 0.84 },
  { id: 's3', title: 'Q1 revenue recognition note', excerpt: 'Extended refund windows shift recognized revenue timing for annual plans…', department: 'Finance', score: 0.62 },
];

const STAGE_FLOW: RagStage[] = ['searching', 'reading', 'drafting'];

const SEED_NOTES: Notification[] = [
  { id: 'n1', title: 'Support reindex finished', body: '120,408 chunks in 6m 12s.', tone: 'success', time: '4m ago' },
  { id: 'n2', title: 'Finance source went stale', body: 'No heartbeat for 6 hours.', tone: 'warn', time: '1h ago', read: true },
  { id: 'n3', title: 'Approval requested: drop 2019 archive', body: 'Agent Atlas is waiting on you.', tone: 'danger', time: '2h ago' },
];

/**
 * Working demo: a corporate RAG command center composed entirely of morph-ui
 * primitives. Open it in the catalog (`pnpm catalog`) under RagDashboardDemo.
 * Not exported from the package barrel — demo only.
 */
export function RagDashboardDemo() {
  const [tab, setTab] = useState('overview');
  const [query, setQuery] = useState('Why did refunds spike in March?');
  const [stage, setStage] = useState<RagStage | null>(null);
  const [answered, setAnswered] = useState(false);
  const [citeId, setCiteId] = useState<string | undefined>('s1');
  const [depts, setDepts] = useState<string[]>(['support', 'sales']);
  const [threshold, setThreshold] = useState(0.72);
  const [range, setRange] = useState<DateRange>({ from: '', to: '' });
  const [preset, setPreset] = useState<string | null>('7d');
  const [filters, setFilters] = useState([
    { id: 'fresh', label: 'Fresh only' },
    { id: 'win', label: 'Last 7 days' },
  ]);
  const [drawer, setDrawer] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [indexing, setIndexing] = useState<number | null>(null);
  const [notes, setNotes] = useState<Notification[]>(SEED_NOTES);
  const [asked, setAsked] = useState<string | null>(null);

  useEffect(() => {
    if (stage === null) return;
    const i = STAGE_FLOW.indexOf(stage);
    if (i < STAGE_FLOW.length - 1) {
      const t = window.setTimeout(() => setStage(STAGE_FLOW[i + 1]!), 1100);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => {
      setStage(null);
      setAnswered(true);
    }, 1300);
    return () => window.clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    if (indexing === null) return;
    if (indexing >= 100) {
      const t = window.setTimeout(() => setIndexing(null), 800);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setIndexing((v) => Math.min(100, (v ?? 0) + 9)), 220);
    return () => window.clearTimeout(t);
  }, [indexing]);

  const ask = () => {
    if (!query.trim() || stage !== null) return;
    setAnswered(false);
    setAsked(query.trim());
    setStage('searching');
  };

  return (
    <div data-ragdemo="">
      <Breadcrumbs trail={[{ label: 'Corp RAG' }, { label: 'Command center' }]} />
      <header data-demohead="">
        <div>
          <h1 data-demotitle="">RAG command center</h1>
          <p data-demosub="">Live across {depts.length} of {DEPTS.length} departments · threshold {threshold.toFixed(2)}</p>
        </div>
        <div data-demoactions="">
          <DropdownMenu
            trigger={<Button size="sm">Export ▾</Button>}
            sections={[{ title: 'Format', items: [{ id: 'csv', label: 'CSV' }, { id: 'pdf', label: 'PDF report' }] }]}
            onPick={() => {}}
          />
          <Button size="sm" variant="primary" onClick={() => setIndexing(4)}>
            Reindex all
          </Button>
          <Button size="sm" variant="danger" onClick={() => setConfirm(true)}>
            Delete view
          </Button>
        </div>
      </header>

      {indexing !== null && <ProgressBar value={indexing} label={`Reindexing… ${indexing}%`} />}

      <div data-kpirow="">
        <KpiCard label="Queries today" value="1,284" delta="12.4% vs yesterday" deltaDirection="up" spark={[8, 10, 9, 12, 14, 13, 18, 22]} />
        <KpiCard label="Median latency" value="1.8s" delta="0.3s slower" deltaDirection="down" />
        <KpiCard label="Grounded answers" value="94%" delta="2 pts up" deltaDirection="up" spark={[88, 90, 89, 92, 93, 94]} />
        <KpiCard label="Sources fresh" value="41 / 43" delta="2 stale" deltaTone="neutral" hint="Retry scheduled" />
      </div>

      <Tabs
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'lab', label: 'Answer lab', badge: answered ? 'live' : undefined },
          { id: 'sources', label: 'Sources', badge: 43 },
        ]}
        activeId={tab}
        onTabChange={setTab}
        label="Command center sections"
      >
        {tab === 'overview' && (
          <div data-demogrid="">
            <div data-demomain="">
              <FilterBar filters={filters} resultCount={1284} onRemove={(id) => setFilters((f) => f.filter((x) => x.id !== id))} onClearAll={() => setFilters([])} />
              <div data-chartgrid="">
                <Card title="Queries by department" subtitle="Last 7 days">
                  <BarChart label="Queries by department" data={[{ label: 'Sales', value: 412 }, { label: 'Support', value: 388 }, { label: 'Eng', value: 241 }, { label: 'Finance', value: 156 }]} />
                </Card>
                <Card title="Corpus share" subtitle="184k chunks">
                  <DonutChart label="Corpus share" centerLabel="184k" formatValue={(v) => `${v}k`} segments={[{ label: 'Support', value: 120 }, { label: 'Sales', value: 48 }, { label: 'Finance', value: 9 }, { label: 'Eng', value: 7 }]} />
                </Card>
              </div>
              <Card title="Latency trend" subtitle="Median answer seconds, 12 weeks">
                <LineChart values={[2.4, 2.2, 2.3, 2.1, 2.0, 1.9, 2.0, 1.8, 1.9, 1.8, 1.7, 1.8]} label="Latency trend" formatValue={(v) => `${v}s`} />
              </Card>
              <DataTable
                caption="Connected sources"
                columns={[
                  { key: 'source', header: 'Source', sortable: true },
                  { key: 'department', header: 'Department', sortable: true },
                  { key: 'chunks', header: 'Chunks', align: 'right', sortable: true },
                  { key: 'freshness', header: 'Freshness', render: (r) => <Badge tone={(r as unknown as { fresh: boolean }).fresh ? 'success' : 'warn'}>{String((r as unknown as { freshness: string }).freshness)}</Badge> },
                ]}
                rows={SOURCES}
                rowKey={(r) => r.source}
                defaultSortKey="chunks"
                defaultSortDir="desc"
              />
              <ContextAttributionList
                budget={128000}
                entries={[
                  { source: 'Ticket archive', tokens: 18400, department: 'Support' },
                  { source: 'Sales CRM notes', tokens: 9200, department: 'Sales' },
                  { source: 'Q3 filings', tokens: 4100, department: 'Finance' },
                ]}
              />
            </div>
            <div data-demoside="">
              <NotificationCenter
                notifications={notes}
                onMarkAllRead={() => setNotes((ns) => ns.map((n) => ({ ...n, read: true })))}
                onDismiss={(id) => setNotes((ns) => ns.filter((n) => n.id !== id))}
              />
              <Card title="Scope" subtitle="What the dashboard covers">
                <div data-scopefields="">
                  <MultiSelect id="demo-depts" label="Departments" options={DEPTS} values={depts} onChange={setDepts} />
                  <DateRangePicker id="demo-range" value={range} onChange={setRange} activePresetId={preset ?? undefined} onPresetChange={setPreset} />
                  <Slider id="demo-threshold" label="Similarity cutoff" min={0.5} max={0.95} step={0.01} value={threshold} onChange={setThreshold} formatValue={(v) => v.toFixed(2)} />
                </div>
              </Card>
            </div>
          </div>
        )}

        {tab === 'lab' && (
          <div data-labgrid="">
            <Card title="Ask" subtitle="Answers stream with citations you can inspect">
              <div data-askrow="">
                <SearchField id="demo-q" value={query} onChange={setQuery} onSubmit={ask} placeholder="Ask about any department…" />
                <Button variant="primary" onClick={ask} loading={stage !== null}>
                  {stage !== null ? 'Working' : 'Ask'}
                </Button>
              </div>
              {stage !== null && (
                <div data-stagerow="">
                  <StreamingStageIndicator stage={stage} />
                </div>
              )}
              {answered && (
                <div data-answer="">
                  <div data-answerhead="">
                    <GroundingBadge verdict="grounded" detail="4 of 4 claims cited" />
                    <Button size="sm" variant="ghost" onClick={() => setDrawer(true)}>
                      Why this answer?
                    </Button>
                  </div>
                  <p data-answertext="">
                    Refund requests rose 8% week over week after the March policy change
                    <CitationPills citations={[{ id: 's1' }, { id: 's2' }]} activeId={citeId} onSelect={setCiteId} />, driven
                    mainly by the billing queue citing the extended 30-day window
                    <CitationPills citations={[{ id: 's2' }, { id: 's3' }]} activeId={citeId} onSelect={setCiteId} />.
                    {asked && asked !== 'Why did refunds spike in March?' ? ` (Scoped to: ${asked})` : ''}
                  </p>
                  <SourceCardList sources={ANSWER_SOURCES} activeId={citeId} onSelect={setCiteId} />
                  <FollowUpChips
                    suggestions={['Break this down by department', 'Show the underlying tickets', 'Draft the stakeholder summary']}
                    onPick={(s) => {
                      setQuery(s);
                      setAnswered(false);
                      setStage('searching');
                    }}
                  />
                  <AnswerFeedback onSubmit={() => {}} />
                </div>
              )}
            </Card>
            <Card title="Prompt template" subtitle="Variables become fill-in fields">
              <VariablePromptInput
                id="demo-prompt"
                template="Summarize {{topic}} for the {{audience}} team over {{timeframe}}."
                readOnlyTemplate
                runLabel="Use in lab"
                onRun={(filled) => {
                  setQuery(filled);
                  setAnswered(false);
                  setStage('searching');
                }}
              />
            </Card>
          </div>
        )}

        {tab === 'sources' && (
          <div data-sourcegrid="">
            <Card title="Corpus browser" subtitle="Pick a node to scope retrieval">
              <TreeView
                nodes={[
                  { id: 'support', label: 'Support', meta: '120k', children: [{ id: 'tickets', label: 'Ticket archive', meta: '118k' }, { id: 'macros', label: 'Macros', meta: '2k' }] },
                  { id: 'sales', label: 'Sales', meta: '48k', children: [{ id: 'crm', label: 'CRM notes', meta: '41k' }] },
                  { id: 'finance', label: 'Finance', meta: '9k' },
                ]}
                defaultExpandedIds={['support']}
                label="Corpus browser"
              />
            </Card>
            <Card title="Add documents" subtitle="Parsed and chunked on upload">
              <FileDropzone id="demo-upload" accept=".pdf,.docx,.txt,.md" maxSizeBytes={25 * 1024 * 1024} onFiles={() => setIndexing(4)} />
            </Card>
          </div>
        )}
      </Tabs>

      <Drawer open={drawer} onClose={() => setDrawer(false)} label="Retrieval inspector" title="Why this answer?">
        <RetrievalInspector
          threshold={threshold}
          chunks={[
            { id: 'c1', title: 'March refund policy update', excerpt: 'Digital-goods refunds extend from 14 to 30 days…', score: 0.91, department: 'Support', tokens: 1840 },
            { id: 'c2', title: 'Billing queue weekly review', excerpt: 'Refund-tagged tickets grew 8% WoW…', score: 0.84, department: 'Support', tokens: 2210 },
            { id: 'c3', title: '2019 archive migration note', excerpt: 'Legacy ticket IDs were remapped…', score: 0.41, department: 'Engineering', tokens: 620 },
          ]}
        />
      </Drawer>

      <ConfirmDialog
        open={confirm}
        title="Delete this view?"
        body="Filters, scope, and prompt templates for this view will be removed for everyone."
        confirmLabel="Delete"
        danger
        onConfirm={() => setConfirm(false)}
        onCancel={() => setConfirm(false)}
      />
    </div>
  );
}
