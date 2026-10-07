/**
 * OpsDashboardTemplate: an operations / incident dashboard page composed only
 * from morph-ui components. A header with breadcrumbs, the page title, a search
 * field and a date range; the active filters; four headline KPIs; an error-rate
 * trend beside an SLO error-budget gauge; a paginated table of recent incidents
 * with status badges; and a side rail with service health and the audit trail.
 *
 * All data comes in through props (defaults in `demoOpsDashboard`), so the page
 * stays deterministic: the date range has a fixed `max` and fixed presets, and
 * nothing reads the clock during render. `loading` swaps the figures for
 * skeletons and a spinner; an empty incident list shows an EmptyState inside
 * the table card.
 *
 * Template only: not exported from the package barrel.
 *
 * Provenance: original morph-ui composition (2026-10).
 */
import { useMemo, useState } from 'react';
import './OpsDashboardTemplate.css';
import { Breadcrumbs } from '../components/Breadcrumbs';
import type { Crumb } from '../components/Breadcrumbs';
import { SearchField } from '../components/SearchField';
import { DateRangePicker } from '../components/DateRangePicker';
import type { DateRange, DateRangePreset } from '../components/DateRangePicker';
import { FilterBar } from '../components/FilterBar';
import type { ActiveFilter } from '../components/FilterBar';
import { KpiCard } from '../components/KpiCard';
import type { DeltaDirection } from '../components/KpiCard';
import { Card } from '../components/Card';
import { LineChart } from '../components/LineChart';
import { GaugeChart } from '../components/GaugeChart';
import type { GaugeChartProps } from '../components/GaugeChart';
import { MetricSparkline } from '../components/MetricSparkline';
import { DataTable } from '../components/DataTable';
import type { DataColumn } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { Pagination } from '../components/Pagination';
import { StatusRowList } from '../components/StatusRowList';
import type { StatusRow } from '../components/StatusRowList';
import { AuditLogViewer } from '../components/AuditLogViewer';
import type { AuditEvent } from '../components/AuditLogViewer';
import { EmptyState } from '../components/EmptyState';
import { SkeletonWrapper } from '../components/SkeletonWrapper';
import { Spinner } from '../components/Spinner';
import { Button } from '../components/Button';
import type { Tone } from '../tone';

export type IncidentStatus = 'investigating' | 'mitigated' | 'monitoring' | 'resolved';
export type IncidentSeverity = 'SEV1' | 'SEV2' | 'SEV3';

/** A type alias (not an interface) so rows satisfy DataTable's `Record<string, unknown>`. */
export type OpsIncident = {
  id: string;
  title: string;
  service: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  /** Pre-formatted opened time, e.g. "Oct 6 · 09:12". */
  opened: string;
  /** Pre-formatted duration, e.g. "42m". */
  duration: string;
};

export interface OpsKpi {
  id: string;
  label: string;
  value: string;
  delta?: string;
  deltaDirection?: DeltaDirection;
  /** Up-is-bad metrics (errors, MTTR) pass "danger" for an upward delta. */
  deltaTone?: Tone;
  spark?: number[];
  hint?: string;
}

export interface OpsService {
  id: string;
  name: string;
  tone: Tone;
  status: string;
  region: string;
  uptime: string;
}

/** Each filter id narrows the incident table; unknown ids are shown but do not filter. */
export interface OpsFilter extends ActiveFilter {
  match?: Partial<Pick<OpsIncident, 'service' | 'severity' | 'status'>> & { notStatus?: IncidentStatus };
}

export interface OpsDashboardData {
  trail: Crumb[];
  title: string;
  subtitle: string;
  kpis: OpsKpi[];
  errorRate: { labels: string[]; values: number[] };
  /** Percent of the monthly error budget still unspent, 0–100. */
  budgetRemaining: number;
  /** One line under the gauge, e.g. burn rate and reset date. */
  budgetNote: string;
  latency: { label: string; value: string; series: number[] }[];
  incidents: OpsIncident[];
  services: OpsService[];
  audit: AuditEvent[];
  filters: OpsFilter[];
  range: DateRange;
  /** Upper bound for the date inputs. Fixed so render never reads the clock. */
  maxDate: string;
  presets: DateRangePreset[];
}

export interface OpsDashboardTemplateProps extends Partial<OpsDashboardData> {
  /** Rows per incident page. */
  pageSize?: number;
  /** Shows skeletons over the figures and a spinner in the table card. */
  loading?: boolean;
  className?: string;
}

const STATUS_TONE: Record<IncidentStatus, Tone> = {
  investigating: 'danger',
  mitigated: 'warn',
  monitoring: 'info',
  resolved: 'success',
};

const SEVERITY_TONE: Record<IncidentSeverity, Tone> = {
  SEV1: 'danger',
  SEV2: 'warn',
  SEV3: 'neutral',
};

const BUDGET_ZONES: GaugeChartProps['zones'] = [
  { upTo: 25, tone: 'danger' },
  { upTo: 50, tone: 'warn' },
  { upTo: 100, tone: 'success' },
];

const STATUS_LABEL: Record<IncidentStatus, string> = {
  investigating: 'Investigating',
  mitigated: 'Mitigated',
  monitoring: 'Monitoring',
  resolved: 'Resolved',
};

export const demoOpsDashboard: OpsDashboardData = {
  trail: [{ label: 'Platform', href: '#platform' }, { label: 'Operations', href: '#ops' }, { label: 'Incident overview' }],
  title: 'Incident overview',
  subtitle: 'Production · all regions · on call: Priya Raman',
  kpis: [
    { id: 'open', label: 'Open incidents', value: '3', delta: '1 more than yesterday', deltaDirection: 'up', deltaTone: 'danger', spark: [1, 2, 1, 1, 2, 4, 3] },
    { id: 'mttr', label: 'MTTR (7d)', value: '38m', delta: '12m faster', deltaDirection: 'down', deltaTone: 'success', spark: [61, 55, 52, 47, 44, 40, 38] },
    { id: 'uptime', label: 'Availability (30d)', value: '99.94%', delta: 'within SLO', deltaDirection: 'flat', spark: [99.97, 99.95, 99.96, 99.92, 99.94, 99.94] },
    { id: 'deploys', label: 'Deploys today', value: '27', delta: '2 rolled back', deltaDirection: 'down', deltaTone: 'warn', hint: 'Freeze lifts 18:00 UTC' },
  ],
  errorRate: {
    labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
    values: [0.21, 0.18, 0.2, 0.19, 0.34, 1.12, 0.86, 0.42, 0.31, 0.27, 0.24, 0.22],
  },
  budgetRemaining: 64,
  budgetNote: 'Burning 1.4× · resets Nov 1',
  latency: [
    { label: 'API p95', value: '212 ms', series: [180, 176, 190, 240, 228, 214, 212] },
    { label: 'Queue lag', value: '4.1 s', series: [2.2, 2.4, 2.1, 6.8, 5.5, 4.6, 4.1] },
  ],
  incidents: [
    { id: 'INC-2187', title: 'Checkout 502s from edge pool eu-west', service: 'checkout-api', severity: 'SEV1', status: 'investigating', opened: 'Oct 6 · 10:04', duration: '26m' },
    { id: 'INC-2186', title: 'Payment webhooks delayed', service: 'payments', severity: 'SEV2', status: 'mitigated', opened: 'Oct 6 · 08:51', duration: '1h 39m' },
    { id: 'INC-2185', title: 'Search index lagging behind writes', service: 'search', severity: 'SEV2', status: 'investigating', opened: 'Oct 6 · 07:30', duration: '3h 00m' },
    { id: 'INC-2184', title: 'Elevated 429s on public API', service: 'gateway', severity: 'SEV3', status: 'monitoring', opened: 'Oct 5 · 22:17', duration: '12h 13m' },
    { id: 'INC-2183', title: 'Image resizer OOM restarts', service: 'media', severity: 'SEV3', status: 'resolved', opened: 'Oct 5 · 16:02', duration: '48m' },
    { id: 'INC-2182', title: 'Login latency spike after deploy', service: 'auth', severity: 'SEV2', status: 'resolved', opened: 'Oct 5 · 11:40', duration: '22m' },
    { id: 'INC-2181', title: 'Stale cache on pricing pages', service: 'checkout-api', severity: 'SEV3', status: 'resolved', opened: 'Oct 4 · 19:55', duration: '1h 05m' },
    { id: 'INC-2180', title: 'Replica lag on orders-db', service: 'orders', severity: 'SEV2', status: 'resolved', opened: 'Oct 4 · 03:12', duration: '2h 18m' },
    { id: 'INC-2179', title: 'Email digests sent twice', service: 'notifications', severity: 'SEV3', status: 'resolved', opened: 'Oct 3 · 06:00', duration: '35m' },
  ],
  services: [
    { id: 'checkout', name: 'checkout-api', tone: 'danger', status: 'Degraded', region: 'eu-west-1', uptime: '99.71%' },
    { id: 'search', name: 'search', tone: 'warn', status: 'Lagging', region: 'us-east-1', uptime: '99.90%' },
    { id: 'payments', name: 'payments', tone: 'warn', status: 'Recovering', region: 'global', uptime: '99.93%' },
    { id: 'auth', name: 'auth', tone: 'success', status: 'Healthy', region: 'global', uptime: '99.99%' },
    { id: 'orders', name: 'orders', tone: 'success', status: 'Healthy', region: 'us-east-1', uptime: '99.98%' },
  ],
  audit: [
    { id: 'a1', time: '10:21', actor: 'Priya Raman', event: 'paged the edge team', detail: 'INC-2187 · escalation policy "Edge P1"', level: 'action' },
    { id: 'a2', time: '10:09', actor: 'deploy-bot', event: 'rolled back checkout-api v4.18.2', detail: 'Error rate crossed 1% for 3 minutes', level: 'warning' },
    { id: 'a3', time: '09:47', actor: 'Marco Diaz', event: 'tried to lift the deploy freeze', detail: 'Requires incident commander approval', level: 'denied' },
    { id: 'a4', time: '08:58', actor: 'Ana Kowalski', event: 'marked INC-2186 mitigated' },
  ],
  filters: [
    { id: 'env', label: 'Env: production' },
    { id: 'open', label: 'Hide resolved', match: { notStatus: 'resolved' } },
  ],
  range: { from: '2026-09-30', to: '2026-10-06' },
  maxDate: '2026-10-06',
  presets: [
    { id: '24h', label: '24h', range: { from: '2026-10-05', to: '2026-10-06' } },
    { id: '7d', label: '7d', range: { from: '2026-09-30', to: '2026-10-06' } },
    { id: '30d', label: '30d', range: { from: '2026-09-07', to: '2026-10-06' } },
  ],
};

function matches(row: OpsIncident, f: OpsFilter): boolean {
  const m = f.match;
  if (!m) return true;
  if (m.notStatus && row.status === m.notStatus) return false;
  if (m.service && row.service !== m.service) return false;
  if (m.severity && row.severity !== m.severity) return false;
  if (m.status && row.status !== m.status) return false;
  return true;
}

const COLUMNS: DataColumn<OpsIncident>[] = [
  {
    key: 'id',
    header: 'Incident',
    sortable: true,
    render: (r) => (
      <span className="ops-dash-stack">
        <span className="ops-dash-mono">{r.id}</span>
        <span className="ops-dash-meta">{r.opened}</span>
      </span>
    ),
  },
  {
    key: 'title',
    header: 'Summary',
    sortable: true,
    render: (r) => (
      <span className="ops-dash-stack">
        <span className="ops-dash-summary-title">{r.title}</span>
        <span className="ops-dash-meta">{r.service}</span>
      </span>
    ),
  },
  { key: 'severity', header: 'Sev', sortable: true, render: (r) => <Badge size="sm" tone={SEVERITY_TONE[r.severity]}>{r.severity}</Badge> },
  { key: 'status', header: 'Status', sortable: true, render: (r) => <Badge size="sm" tone={STATUS_TONE[r.status]}>{STATUS_LABEL[r.status]}</Badge> },
  { key: 'duration', header: 'Open for', align: 'right', render: (r) => <span className="ops-dash-num">{r.duration}</span> },
];

export function OpsDashboardTemplate({
  trail = demoOpsDashboard.trail,
  title = demoOpsDashboard.title,
  subtitle = demoOpsDashboard.subtitle,
  kpis = demoOpsDashboard.kpis,
  errorRate = demoOpsDashboard.errorRate,
  budgetRemaining = demoOpsDashboard.budgetRemaining,
  budgetNote = demoOpsDashboard.budgetNote,
  latency = demoOpsDashboard.latency,
  incidents = demoOpsDashboard.incidents,
  services = demoOpsDashboard.services,
  audit = demoOpsDashboard.audit,
  filters: initialFilters = demoOpsDashboard.filters,
  range: initialRange = demoOpsDashboard.range,
  maxDate = demoOpsDashboard.maxDate,
  presets = demoOpsDashboard.presets,
  pageSize = 4,
  loading = false,
  className = '',
}: OpsDashboardTemplateProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<OpsFilter[]>(initialFilters);
  const [range, setRange] = useState<DateRange>(initialRange);
  const [preset, setPreset] = useState<string | null>(
    () => presets.find((p) => p.range.from === initialRange.from && p.range.to === initialRange.to)?.id ?? null,
  );
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' }>({ key: 'id', dir: 'desc' });

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = incidents.filter(
      (r) =>
        filters.every((f) => matches(r, f)) &&
        (!q || `${r.id} ${r.title} ${r.service}`.toLowerCase().includes(q)),
    );
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = String(a[sort.key as keyof OpsIncident]);
      const bv = String(b[sort.key as keyof OpsIncident]);
      return av < bv ? -dir : av > bv ? dir : 0;
    });
  }, [incidents, filters, query, sort]);

  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize));
  const current = Math.min(page, totalPages);
  const pageRows = visible.slice((current - 1) * pageSize, current * pageSize);
  const openCount = incidents.filter((r) => r.status !== 'resolved').length;

  const serviceRows: StatusRow[] = services.map((s) => ({
    id: s.id,
    dot: true,
    tone: s.tone,
    live: s.tone === 'danger',
    title: s.name,
    meta: `${s.status} · ${s.region}`,
    metric: { label: 'Uptime', value: s.uptime },
  }));

  const resetView = () => {
    setQuery('');
    setFilters([]);
    setPage(1);
  };

  return (
    <div className={`ops-dash ${className}`.trim()} data-opsdash="" data-loading={loading ? '' : undefined}>
      <main className="ops-dash-main" aria-labelledby="ops-dash-title">
        <header className="ops-dash-head">
          <div className="ops-dash-titles">
            <Breadcrumbs trail={trail} />
            <h1 id="ops-dash-title" className="ops-dash-title">{title}</h1>
            <p className="ops-dash-sub">{subtitle}</p>
          </div>
          <div className="ops-dash-controls" role="search" aria-label="Incident search and range">
            <SearchField
              id="ops-dash-search"
              label="Search incidents"
              placeholder="Search incidents, services…"
              value={query}
              onChange={(v) => {
                setQuery(v);
                setPage(1);
              }}
            />
            <DateRangePicker
              id="ops-dash-range"
              label="Reporting window"
              value={range}
              onChange={setRange}
              presets={presets}
              activePresetId={preset ?? undefined}
              onPresetChange={setPreset}
              max={maxDate}
            />
          </div>
        </header>

        <FilterBar
          filters={filters}
          resultCount={visible.length}
          onRemove={(id) => {
            setFilters((fs) => fs.filter((f) => f.id !== id));
            setPage(1);
          }}
          onClearAll={() => {
            setFilters([]);
            setPage(1);
          }}
        />

        <section className="ops-dash-section" aria-labelledby="ops-dash-kpis">
          <h2 id="ops-dash-kpis" className="ops-dash-sr">Key metrics</h2>
          <SkeletonWrapper isLoading={loading}>
            <div className="ops-dash-kpis">
              {kpis.map((k) => (
                <KpiCard
                  key={k.id}
                  label={k.label}
                  value={loading ? '—' : k.value}
                  delta={loading ? undefined : k.delta}
                  deltaDirection={k.deltaDirection}
                  deltaTone={k.deltaTone}
                  hint={loading ? undefined : k.hint}
                  spark={loading ? undefined : k.spark}
                />
              ))}
            </div>
          </SkeletonWrapper>
        </section>

        <section className="ops-dash-section ops-dash-charts" aria-labelledby="ops-dash-trends">
          <h2 id="ops-dash-trends" className="ops-dash-sr">Trends</h2>
          <Card title="Error rate" subtitle="5xx share of requests, last 24h" className="ops-dash-chart-main">
            <SkeletonWrapper isLoading={loading}>
              <LineChart
                label="Error rate, last 24 hours"
                values={loading ? errorRate.labels.map(() => 0) : errorRate.values}
                showDots={!loading}
                labels={errorRate.labels}
                height={150}
                formatValue={(v) => `${v.toFixed(2)}%`}
              />
              <div className="ops-dash-axis" aria-hidden="true">
                <span>{errorRate.labels[0]}</span>
                <span>{errorRate.labels[Math.floor(errorRate.labels.length / 2)]}</span>
                <span>{errorRate.labels[errorRate.labels.length - 1]}</span>
              </div>
            </SkeletonWrapper>
          </Card>
          <Card title="Error budget" subtitle="October SLO · 99.9%" className="ops-dash-chart-side">
            <SkeletonWrapper isLoading={loading}>
              <div className="ops-dash-gauge">
                <GaugeChart
                  label="Error budget remaining"
                  value={loading ? 0 : budgetRemaining}
                  centerLabel={loading ? '—' : `${budgetRemaining}% left`}
                  zones={loading ? undefined : BUDGET_ZONES}
                />
              </div>
              <p className="ops-dash-note">{budgetNote}</p>
            </SkeletonWrapper>
          </Card>
        </section>

        <section className="ops-dash-section ops-dash-lower" aria-labelledby="ops-dash-ops">
          <h2 id="ops-dash-ops" className="ops-dash-sr">Incidents and service health</h2>
          <Card
            title="Recent incidents"
            subtitle={loading ? 'Fetching the reporting window…' : `${openCount} open · ${incidents.length} in window`}
            className="ops-dash-table-card"
            actions={<Button size="sm" variant="primary">Declare incident</Button>}
          >
            {loading ? (
              <div className="ops-dash-loading">
                <Spinner label="Loading incidents" />
                <span>Loading incidents…</span>
              </div>
            ) : visible.length === 0 ? (
              <EmptyState
                title={incidents.length === 0 ? 'No incidents in this window' : 'No incidents match'}
                action={
                  incidents.length > 0 ? (
                    <Button size="sm" onClick={resetView}>
                      Reset filters
                    </Button>
                  ) : undefined
                }
              >
                {incidents.length === 0
                  ? 'Quiet shift. New incidents will appear here as they are declared.'
                  : 'Try a different search or remove a filter.'}
              </EmptyState>
            ) : (
              <>
                <DataTable<OpsIncident>
                  caption="Recent incidents"
                  columns={COLUMNS}
                  rows={pageRows}
                  rowKey={(r) => r.id}
                  defaultSortKey={sort.key}
                  defaultSortDir={sort.dir}
                  onSortChange={(key, dir) => {
                    setSort({ key, dir });
                    setPage(1);
                  }}
                />
                <div className="ops-dash-pager">
                  <span className="ops-dash-range">
                    {(current - 1) * pageSize + 1}–{Math.min(current * pageSize, visible.length)} of {visible.length}
                  </span>
                  <Pagination page={current} totalPages={totalPages} onPageChange={setPage} label="Incident pages" />
                </div>
              </>
            )}
          </Card>

          <aside className="ops-dash-rail" aria-label="Service health and audit trail">
            {latency.length > 0 && (
              <Card title="Golden signals" subtitle="Last 6 hours">
                <SkeletonWrapper isLoading={loading}>
                  <div className="ops-dash-sparks">
                    {latency.map((m) => (
                      <MetricSparkline key={m.label} label={m.label} value={loading ? '—' : m.value} series={loading ? [] : m.series} invert period="6h" />
                    ))}
                  </div>
                </SkeletonWrapper>
              </Card>
            )}
            <Card title="Service health" subtitle={`${services.length} tracked services`}>
              <StatusRowList rows={serviceRows} label="Service health" flush />
              {services.length === 0 && <EmptyState title="No services tracked" />}
            </Card>
            <Card title="Audit trail" subtitle="Today">
              <AuditLogViewer events={audit} emptyText="No actions recorded today." />
            </Card>
          </aside>
        </section>
      </main>
    </div>
  );
}

