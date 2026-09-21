import { useState } from 'react';
import './ComponentGallery.css';
import { Button } from './Button';
import { TextField } from './TextField';
import { TextArea } from './TextArea';
import { Select } from './Select';
import { Checkbox } from './Checkbox';
import { RadioGroup } from './RadioGroup';
import { ToggleSwitch } from './ToggleSwitch';
import { Slider } from './Slider';
import { SearchField } from './SearchField';
import { Combobox } from './Combobox';
import { MultiSelect } from './MultiSelect';
import { VariablePromptInput } from './VariablePromptInput';
import { FileDropzone } from './FileDropzone';
import { DateRangePicker } from './DateRangePicker';
import type { DateRange } from './DateRangePicker';
import { Badge } from './Badge';
import { Card } from './Card';
import { Divider } from './Divider';
import { Tabs } from './Tabs';
import { Accordion } from './Accordion';
import { Breadcrumbs } from './Breadcrumbs';
import { TreeView } from './TreeView';
import { Pagination } from './Pagination';
import { Tooltip } from './Tooltip';
import { DataTable } from './DataTable';
import { KpiCard } from './KpiCard';
import { BarChart } from './BarChart';
import { LineChart } from './LineChart';
import { DonutChart } from './DonutChart';
import { ProgressBar } from './ProgressBar';
import { Spinner } from './Spinner';
import { EmptyState } from './EmptyState';
import { InitialsAvatar } from './InitialsAvatar';
import { CitationPills } from './CitationPills';
import { SourceCardList } from './SourceCardList';
import { RetrievalInspector } from './RetrievalInspector';
import { GroundingBadge } from './GroundingBadge';
import { StreamingStageIndicator } from './StreamingStageIndicator';
import { ContextAttributionList } from './ContextAttributionList';
import { AnswerFeedback } from './AnswerFeedback';
import { FollowUpChips } from './FollowUpChips';
import { FilterBar } from './FilterBar';
import { ModalSurface } from './ModalSurface';
import { Drawer } from './Drawer';
import { DropdownMenu } from './DropdownMenu';
import { ConfirmDialog } from './ConfirmDialog';
import { NotificationCenter } from './NotificationCenter';
import { ApprovalInbox } from './ApprovalInbox';
import { PlanChecklist } from './PlanChecklist';
import { CostMeter } from './CostMeter';
import { EvalScoreCard } from './EvalScoreCard';
import { HandoffCard } from './HandoffCard';
import { AuditLogViewer } from './AuditLogViewer';
import { Stepper } from './Stepper';
import { AvatarStack } from './AvatarStack';
import { GaugeChart } from './GaugeChart';
import { FunnelChart } from './FunnelChart';
import { ShortcutHelp } from './ShortcutHelp';

function Section({ title, blurb, children }: { title: string; blurb?: string; children: React.ReactNode }) {
  return (
    <section data-galsection="">
      <h2 data-galheading="">{title}</h2>
      {blurb && <p data-galblurb="">{blurb}</p>}
      <div data-galgrid="">{children}</div>
    </section>
  );
}

function Cell({ name, children, wide }: { name: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div data-galcell="" data-wide={wide ? '' : undefined}>
      <div data-galname="">{name}</div>
      {children}
    </div>
  );
}

/**
 * Library viewing page: every agent-renderable component, live in one place.
 * Open in the catalog (`pnpm catalog`) under ComponentGallery. Not exported
 * from the package barrel — viewer only.
 */
export function ComponentGallery() {
  const [tab, setTab] = useState('a');
  const [page, setPage] = useState(3);
  const [cite, setCite] = useState<string | undefined>('s1');
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState('7d');
  const [slider, setSlider] = useState(0.72);
  const [search, setSearch] = useState('');
  const [combo, setCombo] = useState<string | null>('m2');
  const [multi, setMulti] = useState<string[]>(['support']);
  const [range, setRange] = useState<DateRange>({ from: '', to: '' });
  const [preset, setPreset] = useState<string | null>(null);
  const [filters, setFilters] = useState([
    { id: 'f1', label: 'Fresh only' },
    { id: 'f2', label: 'Support' },
  ]);

  return (
    <div data-gallery="">
      <header data-galhead="">
        <h1>morph-ui gallery</h1>
        <p>Every component an agent can render — live. For the composed dashboard, see the RagDashboardDemo story.</p>
      </header>

      <Section title="Buttons & actions" blurb="Clicks, menus, confirmations, tooltips.">
        <Cell name="Button">
          <div data-galrow="">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button loading>Loading</Button>
          </div>
        </Cell>
        <Cell name="DropdownMenu">
          <DropdownMenu
            trigger={<Button size="sm">Export ▾</Button>}
            sections={[{ title: 'Format', items: [{ id: 'csv', label: 'CSV' }, { id: 'pdf', label: 'PDF' }] }, { items: [{ id: 'del', label: 'Delete', danger: true }] }]}
            onPick={() => {}}
          />
        </Cell>
        <Cell name="ConfirmDialog">
          <Button size="sm" variant="danger" onClick={() => setConfirm(true)}>Delete…</Button>
        </Cell>
        <Cell name="Tooltip">
          <Tooltip content="Rebuilds the vector index."><Button size="sm">Hover me</Button></Tooltip>
        </Cell>
        <Cell name="ModalSurface">
          <Button size="sm" onClick={() => setModal(true)}>Open modal</Button>
        </Cell>
        <Cell name="Drawer">
          <Button size="sm" onClick={() => setDrawer(true)}>Open drawer</Button>
        </Cell>
      </Section>

      <Section title="Form inputs" blurb="Query bars, fields, pickers, uploads.">
        <Cell name="SearchField"><SearchField id="g-search" value={search} onChange={setSearch} placeholder="Search…" /></Cell>
        <Cell name="TextField"><TextField id="g-text" label="Query" placeholder="Ask anything…" hint="Searches everything." /></Cell>
        <Cell name="TextArea"><TextArea id="g-area" label="Notes" rows={2} placeholder="Context…" /></Cell>
        <Cell name="Select">
          <Select id="g-select" label="Department" placeholder="Choose…" options={[{ value: 's', label: 'Sales' }, { value: 'f', label: 'Finance' }]} value="" onChange={() => {}} />
        </Cell>
        <Cell name="Combobox">
          <Combobox id="g-combo" label="Model" value={combo} onChange={setCombo} options={[{ value: 'm1', label: 'Atlas Large' }, { value: 'm2', label: 'Atlas Mini' }]} />
        </Cell>
        <Cell name="MultiSelect">
          <MultiSelect id="g-multi" label="Departments" values={multi} onChange={setMulti} options={[{ value: 'support', label: 'Support' }, { value: 'sales', label: 'Sales' }]} />
        </Cell>
        <Cell name="Checkbox"><Checkbox id="g-check" label="Live refresh" checked={checked} onChange={setChecked} /></Cell>
        <Cell name="RadioGroup">
          <RadioGroup name="g-radio" value={radio} onChange={setRadio} options={[{ value: '24h', label: 'Day' }, { value: '7d', label: 'Week' }]} orientation="horizontal" />
        </Cell>
        <Cell name="ToggleSwitch">
          <span data-galrow=""><ToggleSwitch on={toggle} onChange={setToggle} label="Notifications" /> <span>Notifications</span></span>
        </Cell>
        <Cell name="Slider"><Slider id="g-slider" label="Cutoff" min={0.5} max={0.95} step={0.01} value={slider} onChange={setSlider} formatValue={(v) => v.toFixed(2)} /></Cell>
        <Cell name="DateRangePicker"><DateRangePicker id="g-range" value={range} onChange={setRange} activePresetId={preset ?? undefined} onPresetChange={setPreset} /></Cell>
        <Cell name="VariablePromptInput" wide>
          <VariablePromptInput id="g-var" template="Summarize {{topic}} for {{audience}}." readOnlyTemplate />
        </Cell>
        <Cell name="FileDropzone" wide><FileDropzone id="g-drop" accept=".pdf,.md" maxSizeBytes={25 * 1024 * 1024} /></Cell>
      </Section>

      <Section title="Navigation & structure" blurb="Move through views, sections, hierarchies.">
        <Cell name="Tabs" wide>
          <Tabs tabs={[{ id: 'a', label: 'Overview' }, { id: 'b', label: 'Sources', badge: 12 }]} activeId={tab} onTabChange={setTab}>
            <p style={{ margin: 0 }}>{tab === 'a' ? 'Overview panel.' : 'Sources panel.'}</p>
          </Tabs>
        </Cell>
        <Cell name="Accordion">
          <Accordion items={[{ id: 'x', title: 'Sales', content: 'CRM + calls.' }, { id: 'y', title: 'Support', content: 'Tickets.' }]} defaultOpenIds={['x']} />
        </Cell>
        <Cell name="Breadcrumbs"><Breadcrumbs trail={[{ label: 'Home' }, { label: 'Corpora' }, { label: 'Support' }]} /></Cell>
        <Cell name="TreeView">
          <TreeView nodes={[{ id: 's', label: 'Support', children: [{ id: 't', label: 'Tickets' }] }]} defaultExpandedIds={['s']} label="Corpus" />
        </Cell>
        <Cell name="Pagination"><Pagination page={page} totalPages={13} onPageChange={setPage} /></Cell>
        <Cell name="FilterBar" wide>
          <FilterBar filters={filters} resultCount={1284} onRemove={(id) => setFilters((f) => f.filter((x) => x.id !== id))} onClearAll={() => setFilters([])} />
        </Cell>
      </Section>

      <Section title="Data display" blurb="Metrics, charts, tables.">
        <Cell name="KpiCard"><KpiCard label="Queries" value="1,284" delta="12% up" deltaDirection="up" spark={[1, 2, 2, 3, 5]} /></Cell>
        <Cell name="Badge">
          <div data-galrow="">
            <Badge>Draft</Badge><Badge tone="info">Indexed</Badge><Badge tone="success">Fresh</Badge><Badge tone="warn">Stale</Badge><Badge tone="danger">Offline</Badge>
          </div>
        </Cell>
        <Cell name="BarChart"><BarChart label="By dept" data={[{ label: 'Sales', value: 41 }, { label: 'Support', value: 38 }, { label: 'Eng', value: 24 }]} /></Cell>
        <Cell name="LineChart"><LineChart values={[3, 7, 5, 9, 6]} label="Trend" /></Cell>
        <Cell name="DonutChart"><DonutChart label="Share" segments={[{ label: 'A', value: 70 }, { label: 'B', value: 30 }]} /></Cell>
        <Cell name="DataTable" wide>
          <DataTable
            columns={[{ key: 'source', header: 'Source', sortable: true }, { key: 'chunks', header: 'Chunks', align: 'right', sortable: true }]}
            rows={[{ source: 'Tickets', chunks: 120 }, { source: 'CRM', chunks: 48 }]}
            rowKey={(r) => r.source}
            defaultSortKey="chunks"
            defaultSortDir="desc"
          />
        </Cell>
        <Cell name="ProgressBar"><ProgressBar value={68} label="Indexing · 68%" /></Cell>
        <Cell name="Spinner"><Spinner label="Loading demo" /></Cell>
        <Cell name="Card"><Card title="Tile" subtitle="Subtitle" actions={<Badge size="sm">New</Badge>}>Body text.</Card></Cell>
        <Cell name="Divider"><div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}><span>Above</span><Divider label="Cutoff" /><span>Below</span></div></Cell>
        <Cell name="EmptyState"><EmptyState title="No items" /></Cell>
        <Cell name="InitialsAvatar">
          <div data-galrow="">
            <InitialsAvatar name="Ada Lovelace" /><InitialsAvatar name="Atlas Agent" agent working />
          </div>
        </Cell>
      </Section>

      <Section title="RAG answer UX" blurb="Everything an answer needs: verdict, citations, sources, feedback.">
        <Cell name="GroundingBadge"><GroundingBadge verdict="grounded" detail="4 of 4 cited" /></Cell>
        <Cell name="StreamingStageIndicator"><StreamingStageIndicator stage="reading" /></Cell>
        <Cell name="CitationPills">
          <p style={{ margin: 0 }}>Refunds rose 8% <CitationPills citations={[{ id: 's1' }, { id: 's2' }]} activeId={cite} onSelect={setCite} /></p>
        </Cell>
        <Cell name="SourceCardList">
          <SourceCardList
            sources={[
              { id: 's1', title: 'Policy update', excerpt: 'Refunds extend to 30 days…', department: 'Support', score: 0.91 },
              { id: 's2', title: 'Queue review', excerpt: 'Tickets grew 8%…', score: 0.84 },
            ]}
            activeId={cite}
            onSelect={setCite}
            compact
          />
        </Cell>
        <Cell name="RetrievalInspector" wide>
          <RetrievalInspector chunks={[{ id: 'c1', title: 'Policy', excerpt: 'Extends to 30 days…', score: 0.91 }, { id: 'c2', title: 'Old note', excerpt: 'Legacy IDs…', score: 0.41 }]} />
        </Cell>
        <Cell name="ContextAttributionList" wide>
          <ContextAttributionList budget={128000} entries={[{ source: 'Tickets', tokens: 18400 }, { source: 'CRM', tokens: 9200 }]} />
        </Cell>
        <Cell name="FollowUpChips">
          <FollowUpChips suggestions={['Break it down', 'Show tickets']} onPick={() => {}} />
        </Cell>
        <Cell name="AnswerFeedback" wide><AnswerFeedback onSubmit={() => {}} /></Cell>
      </Section>

      <Section title="Agent ops" blurb="Human-in-the-loop: approvals, plans, cost, quality, handoffs, audit.">
        <Cell name="ApprovalInbox" wide>
          <ApprovalInbox
            requests={[
              { id: 'a1', title: 'Drop the 2019 archive', detail: '184k chunks.', agent: 'Atlas', risk: 'high' },
              { id: 'a2', title: 'Retry Finance sync', risk: 'low' },
            ]}
            onApprove={() => {}}
            onReject={() => {}}
          />
        </Cell>
        <Cell name="PlanChecklist">
          <PlanChecklist
            steps={[
              { id: 'p1', label: 'Pull deltas', state: 'done' },
              { id: 'p2', label: 'Draft summary', state: 'active' },
              { id: 'p3', label: 'Sign-off', state: 'blocked' },
              { id: 'p4', label: 'Publish', state: 'todo' },
            ]}
          />
        </Cell>
        <Cell name="CostMeter"><CostMeter spent={1.84} budget={5} formatValue={(v) => `$${v.toFixed(2)}`} /></Cell>
        <Cell name="EvalScoreCard" wide>
          <EvalScoreCard
            title="Answer quality"
            dimensions={[
              { name: 'Grounded', score: 94, target: 90 },
              { name: 'Complete', score: 81, target: 85 },
              { name: 'Concise', score: 77, target: 70 },
            ]}
          />
        </Cell>
        <Cell name="HandoffCard" wide>
          <HandoffCard to="Priya" reason="Unsure about grandfathering." needed="Approve the draft." urgency="soon" onAccept={() => {}} />
        </Cell>
        <Cell name="AuditLogViewer" wide>
          <AuditLogViewer
            events={[
              { id: 'g1', time: '09:41', actor: 'Priya', event: 'approved deletion', level: 'action' },
              { id: 'g2', time: '09:12', actor: 'Atlas', event: 'was denied email send', level: 'denied' },
            ]}
          />
        </Cell>
      </Section>

      <Section title="More display" blurb="Wizards, people, gauges, funnels, shortcuts.">
        <Cell name="Stepper" wide>
          <Stepper steps={[{ id: 't1', label: 'Scope' }, { id: 't2', label: 'Prompt' }, { id: 't3', label: 'Review' }]} current={1} label="Setup" />
        </Cell>
        <Cell name="AvatarStack">
          <AvatarStack people={[{ name: 'Priya Nair' }, { name: 'Tom Becker' }, { name: 'Atlas Agent', agent: true }, { name: 'June Park' }]} />
        </Cell>
        <Cell name="GaugeChart"><GaugeChart label="SLA" value={94} centerLabel="94%" zones={[{ upTo: 90, tone: 'ok' }, { upTo: 100, tone: 'good' }]} /></Cell>
        <Cell name="FunnelChart" wide>
          <FunnelChart stages={[{ label: 'Queries', value: 8988 }, { label: 'Cited', value: 6404 }, { label: 'Resolved', value: 3981 }]} />
        </Cell>
        <Cell name="ShortcutHelp">
          <ShortcutHelp groups={[{ title: 'Lab', shortcuts: [{ keys: ['⌘', 'K'], action: 'Focus query' }, { keys: ['?'], action: 'Help' }] }]} />
        </Cell>
      </Section>

      <Section title="Ops" blurb="Notifications and inboxes.">
        <Cell name="NotificationCenter" wide>
          <NotificationCenter
            notifications={[
              { id: 'n1', title: 'Reindex finished', body: '120k chunks.', tone: 'success', time: '4m ago' },
              { id: 'n2', title: 'Source stale', body: 'Retry scheduled.', tone: 'warn', time: '1h ago', read: true },
            ]}
          />
        </Cell>
      </Section>

      {modal && (
        <ModalSurface label="Gallery modal" title="ModalSurface" onClose={() => setModal(false)}>
          <p style={{ margin: 0 }}>Dialogs still live here too.</p>
        </ModalSurface>
      )}
      <Drawer open={drawer} onClose={() => setDrawer(false)} label="Gallery drawer" title="Drawer">
        <p style={{ margin: 0 }}>Slide-over drills down from any tile.</p>
      </Drawer>
      <ConfirmDialog
        open={confirm}
        title="Delete this view?"
        body="Just proving the dialog works from the gallery."
        confirmLabel="Delete"
        danger
        onConfirm={() => setConfirm(false)}
        onCancel={() => setConfirm(false)}
      />
    </div>
  );
}
