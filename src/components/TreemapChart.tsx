import './TreemapChart.css';

export interface TreemapNode {
  label: string;
  value: number;
  /** Series index 0–5 picks the --series-N ramp color; children inherit the parent's hue. */
  series?: number;
  children?: TreemapNode[];
}

export interface TreemapChartProps {
  data: TreemapNode[];
  height?: number;
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

interface Item {
  node: TreemapNode;
  area: number;
  color: string;
}

interface Cell {
  x: number;
  y: number;
  w: number;
  h: number;
  node: TreemapNode;
  depth: number;
  color: string;
}

/**
 * Squarified treemap (Bruls, Huizing & van Wijk). Rectangles are laid into a
 * strip against the shorter side of the remaining rectangle, growing the strip
 * while the worst aspect ratio improves — which keeps tiles near-square.
 */
function squarify(items: Item[], x: number, y: number, w: number, h: number, depth: number, out: Cell[]): void {
  if (items.length === 0 || w <= 0 || h <= 0) return;
  const areas = items.map((i) => i.area);
  const total = areas.reduce((s, a) => s + a, 0);
  if (total <= 0) return;
  const scaled: Item[] = items.map((it, i) => ({ ...it, area: (areas[i]! / total) * w * h }));

  // A single item simply fills the rectangle; several go through the strip logic.
  if (scaled.length === 1) {
    emitCell(scaled[0]!, x, y, w, h, depth, out);
    return;
  }

  // Strip runs along the shorter side: a left column when the rect is wide,
  // a top row when it is tall.
  const column = w >= h;
  const stripLen = column ? h : w;

  // Grow the strip while its worst aspect ratio keeps improving.
  let best = Infinity;
  let split = 0;
  let acc = 0;
  for (let i = 0; i < scaled.length; i++) {
    acc += scaled[i]!.area;
    const thickness = acc / stripLen;
    let worst = 0;
    for (let j = 0; j <= i; j++) {
      const long = (scaled[j]!.area / acc) * stripLen;
      const r = Math.max(long / thickness, thickness / long);
      if (r > worst) worst = r;
    }
    if (worst <= best) {
      best = worst;
      split = i + 1;
    } else {
      break;
    }
  }
  if (split === 0) split = 1;
  const stripArea = scaled.slice(0, split).reduce((s, it) => s + it.area, 0);
  const thickness = stripArea / stripLen;

  let offset = 0;
  for (const it of scaled.slice(0, split)) {
    const len = (it.area / stripArea) * stripLen;
    if (column) {
      emitCell(it, x, y + offset, thickness, len, depth, out);
    } else {
      emitCell(it, x + offset, y, len, thickness, depth, out);
    }
    offset += len;
  }
  if (column) {
    squarify(scaled.slice(split), x + thickness, y, Math.max(0, w - thickness), h, depth, out);
  } else {
    squarify(scaled.slice(split), x, y + thickness, w, Math.max(0, h - thickness), depth, out);
  }
}

function emitCell(item: Item, x: number, y: number, w: number, h: number, depth: number, out: Cell[]): void {
  out.push({ x, y, w, h, node: item.node, depth, color: item.color });
  const kids = item.node.children;
  if (kids?.length) {
    const kidTotal = kids.reduce((s, c) => s + c.value, 0);
    if (kidTotal > 0 && w > 8 && h > 8) {
      // Children tile the parent, inset by the stroke; they keep the parent hue.
      const kidItems: Item[] = kids.map((c) => ({
        node: c,
        area: (c.value / kidTotal) * (w - 4) * (h - 4),
        color: item.color,
      }));
      squarify(kidItems, x + 2, y + 2, Math.max(0, w - 4), Math.max(0, h - 4), depth + 1, out);
    }
  }
}

/** Walk nested data into text "label: value (share%)" entries. */
function summarize(nodes: TreemapNode[], total: number, formatValue: (v: number) => string): string {
  return nodes
    .map((n) => {
      const own = `${n.label}: ${formatValue(n.value)} (${total > 0 ? Math.round((n.value / total) * 100) : 0}%)`;
      return n.children?.length ? `${own} [${summarize(n.children, n.value, formatValue)}]` : own;
    })
    .join(', ');
}

/**
 * Dependency-free squarified treemap, pure SVG. Cell color follows the
 * `--series-*` ramp in data order; every cell prints label and value as text
 * and the figcaption carries the full share breakdown, so size is never the
 * only channel.
 */
export function TreemapChart({
  data,
  height = 240,
  formatValue = (v) => String(v),
  label = 'Treemap chart',
  className = '',
}: TreemapChartProps) {
  const W = 560;
  const H = 240;
  const hasData = data.length > 0;
  const total = data.reduce((s, n) => s + n.value, 0);
  const cells: Cell[] = [];
  if (hasData && total > 0) {
    const items: Item[] = data.map((n, i) => ({
      node: n,
      area: (n.value / total) * W * H,
      color: PALETTE[(n.series ?? i) % PALETTE.length]!,
    }));
    squarify(items, 0, 0, W, H, 0, cells);
  }
  const summary = hasData ? summarize(data, total, formatValue) : '';

  return (
    <figure className={className} data-treemap="">
      <div data-treemaparea="" style={{ height }}>
        {!hasData || total <= 0 ? (
          <span data-treemapempty="">No data</span>
        ) : (
          <div data-treemapplot="">
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${label}. ${summary}`} data-treemapsvg="">
              {cells.map((c, i) => {
                const pct = total > 0 ? Math.round((c.node.value / total) * 100) : 0;
                const showText = c.w > 54 && c.h > 30;
                return (
                  <g key={`${c.node.label}-${i}`} data-treemapcell="" data-depth={c.depth}>
                    <rect
                      x={c.x.toFixed(1)}
                      y={c.y.toFixed(1)}
                      width={Math.max(0, c.w - 1).toFixed(1)}
                      height={Math.max(0, c.h - 1).toFixed(1)}
                      rx="3"
                      fill={c.color}
                      fillOpacity={c.depth === 0 ? 0.55 : 0.8}
                      stroke="var(--morph-card-bg)"
                      strokeWidth="1.5"
                    >
                      <title>{`${c.node.label}: ${formatValue(c.node.value)} (${pct}%)`}</title>
                    </rect>
                    {showText && (
                      <>
                        <text
                          x={(c.x + 6).toFixed(1)}
                          y={(c.y + 15).toFixed(1)}
                          data-treemapname=""
                          data-depth={c.depth}
                        >
                          {c.node.label}
                        </text>
                        {c.h > 44 && (
                          <text
                            x={(c.x + 6).toFixed(1)}
                            y={(c.y + 29).toFixed(1)}
                            data-treemapvalue=""
                          >
                            {`${formatValue(c.node.value)} · ${pct}%`}
                          </text>
                        )}
                      </>
                    )}
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
