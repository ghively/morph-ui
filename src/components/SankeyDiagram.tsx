import './SankeyDiagram.css';

export interface SankeyNode {
  id: string;
  label?: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
  /** Series index 0–5 picks the --series-N flow color; defaults to the source node's index. */
  series?: number;
}

export interface SankeyDiagramProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
  height?: number;
  /** Height of one unit of value in px. Scales flows proportionally. */
  formatValue?: (value: number) => string;
  label?: string;
  className?: string;
}

const PALETTE = [
  'var(--series-1)',
  'var(--series-2)',
  'var(--series-3)',
  'var(--series-4)',
  'var(--series-5)',
  'var(--series-6)',
];

/** Cubic bezier ribbon path between two node ports. */
function ribbon(x0: number, y0: number, x1: number, y1: number, h0: number, h1: number): string {
  const mx = (x0 + x1) / 2;
  return [
    `M${x0.toFixed(1)},${y0.toFixed(1)}`,
    `C${mx.toFixed(1)},${y0.toFixed(1)} ${mx.toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`,
    `L${x1.toFixed(1)},${(y1 + h1).toFixed(1)}`,
    `C${mx.toFixed(1)},${(y1 + h1).toFixed(1)} ${mx.toFixed(1)},${(y0 + h0).toFixed(1)} ${x0.toFixed(1)},${(y0 + h0).toFixed(1)}`,
    'Z',
  ].join(' ');
}

/**
 * Dependency-free two-plus-column Sankey, pure SVG, layered left to right.
 * Flows are drawn as bezier ribbons in `--series-*` colors; each ribbon and
 * node carries a `title` and the figcaption lists every flow as text, so
 * volume is never color-only.
 */
export function SankeyDiagram({
  nodes,
  links,
  height = 260,
  formatValue = (v) => String(v),
  label = 'Sankey diagram',
  className = '',
}: SankeyDiagramProps) {
  const W = 560;
  const H = 260;
  const NODE_W = 14;
  const GAP = 4;
  const byId = new Map(nodes.map((n, i) => [n.id, { ...n, series: i }]));

  // Assign columns: a node's column is the longest path from any source.
  const incoming = new Map<string, string[]>();
  links.forEach((l) => {
    const arr = incoming.get(l.target) ?? [];
    arr.push(l.source);
    incoming.set(l.target, arr);
  });
  const columnOf = new Map<string, number>();
  const resolve = (id: string, seen = new Set<string>()): number => {
    if (columnOf.has(id)) return columnOf.get(id)!;
    if (seen.has(id)) return 0; // cycle guard
    seen.add(id);
    const srcs = incoming.get(id) ?? [];
    const col = srcs.length ? Math.max(...srcs.map((s) => resolve(s, seen))) + 1 : 0;
    columnOf.set(id, col);
    return col;
  };
  nodes.forEach((n) => resolve(n.id));
  const maxCol = Math.max(0, ...columnOf.values());
  const columns: string[][] = Array.from({ length: maxCol + 1 }, () => []);
  nodes.forEach((n) => columns[columnOf.get(n.id)!]!.push(n.id));

  // Node value = max(in, out) so nothing overdraws.
  const nodeValue = new Map<string, number>();
  nodes.forEach((n) => nodeValue.set(n.id, 0));
  links.forEach((l) => {
    nodeValue.set(l.source, Math.max(nodeValue.get(l.source) ?? 0, l.value));
    nodeValue.set(l.target, Math.max(nodeValue.get(l.target) ?? 0, l.value));
  });
  // Sum per column, then scale so the busiest column fills the height.
  const colTotals = columns.map((col) => col.reduce((s, id) => s + (nodeValue.get(id) ?? 0), 0));
  const maxTotal = Math.max(1, ...colTotals);
  const usable = H - GAP * 2;
  const scale = usable / maxTotal;

  const nodeRects = new Map<string, { x: number; y: number; w: number; h: number }>();
  columns.forEach((col, ci) => {
    const colH = col.reduce((s, id) => s + (nodeValue.get(id) ?? 0) * scale, 0);
    let y = (H - colH) / 2;
    const x = 10 + (ci * (W - NODE_W - 20)) / Math.max(maxCol, 1);
    col.forEach((id) => {
      const h = Math.max(3, (nodeValue.get(id) ?? 0) * scale);
      nodeRects.set(id, { x, y, w: NODE_W, h });
      y += h + GAP;
    });
  });

  // Flow offsets per node side.
  const outUsed = new Map<string, number>();
  const inUsed = new Map<string, number>();
  const hasLinks = links.length > 0;
  const summary = hasLinks
    ? `${links.map((l) => `${l.source} → ${l.target}: ${formatValue(l.value)}`).join(', ')}.`
    : '';

  return (
    <figure className={className} data-sankey="">
      <div data-sankeyarea="" style={{ height }}>
        {!hasLinks ? (
          <span data-sankeyempty="">No data</span>
        ) : (
          <div data-sankeyplot="">
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${label}. ${summary}`} data-sankeysvg="">
              {links.map((l, i) => {
                const from = nodeRects.get(l.source);
                const to = nodeRects.get(l.target);
                if (!from || !to) return null;
                const h0 = l.value * scale;
                const h1 = l.value * scale;
                const y0 = from.y + (outUsed.get(l.source) ?? 0);
                const y1 = to.y + (inUsed.get(l.target) ?? 0);
                outUsed.set(l.source, (outUsed.get(l.source) ?? 0) + h0);
                inUsed.set(l.target, (inUsed.get(l.target) ?? 0) + h1);
                const color = PALETTE[(l.series ?? byId.get(l.source)?.series ?? i) % PALETTE.length];
                return (
                  <path
                    key={`${l.source}-${l.target}-${i}`}
                    d={ribbon(from.x + from.w, y0, to.x, y1, h0, h1)}
                    fill={color}
                    data-sankeyflow=""
                  >
                    <title>{`${l.source} → ${l.target}: ${formatValue(l.value)}`}</title>
                  </path>
                );
              })}
              {nodes.map((n) => {
                const r = nodeRects.get(n.id);
                if (!r) return null;
                const seriesIdx = byId.get(n.id)?.series ?? 0;
                return (
                  <g key={n.id} data-sankeynode="">
                    <rect
                      x={r.x.toFixed(1)}
                      y={r.y.toFixed(1)}
                      width={r.w}
                      height={r.h.toFixed(1)}
                      rx="2"
                      fill={PALETTE[seriesIdx % PALETTE.length]}
                      data-sankeybar=""
                    >
                      <title>{`${n.label ?? n.id}: ${formatValue(nodeValue.get(n.id) ?? 0)}`}</title>
                    </rect>
                    <text
                      x={r.x <= W / 2 ? r.x - 5 : r.x + r.w + 5}
                      y={(r.y + r.h / 2).toFixed(1)}
                      textAnchor={r.x <= W / 2 ? 'end' : 'start'}
                      dominantBaseline="central"
                      data-sankeyname=""
                    >
                      {n.label ?? n.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </div>
      <figcaption data-sronly="">{summary || 'No data'}</figcaption>
    </figure>
  );
}
