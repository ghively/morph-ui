import './HeatmapGrid.css';

export interface HeatmapCell {
  /** 0–1 normalized intensity; drives the color-mix fill. */
  value: number;
  /** Optional text override shown in the cell (defaults to the formatted value). */
  text?: string;
}

export interface HeatmapGridProps {
  /** Row headers. */
  rows: string[];
  /** Column headers. */
  columns: string[];
  /** cells[row][column]; missing entries render as empty. */
  cells: (HeatmapCell | undefined)[][];
  formatValue?: (value: number) => string;
  label?: string;
  className?: string;
}

/**
 * Dependency-free heatmap table. Intensity is painted with `color-mix()` over
 * the accent ramp in row order (--series-N), but every filled cell also shows
 * its value as text, so heat is never the only channel. Semantically it is a
 * real table with row/column headers.
 */
export function HeatmapGrid({
  rows,
  columns,
  cells,
  formatValue = (v) => String(Math.round(v * 100)),
  label = 'Heatmap',
  className = '',
}: HeatmapGridProps) {
  const hasData = rows.length > 0 && columns.length > 0;
  const summary = hasData
    ? rows
        .map((r, ri) =>
          columns
            .map((c, ci) => {
              const cell = cells[ri]?.[ci];
              return cell ? `${r}×${c}: ${cell.text ?? formatValue(cell.value)}` : '';
            })
            .filter(Boolean)
            .join(', '),
        )
        .filter(Boolean)
        .join('; ')
    : '';

  return (
    <figure className={className} data-heatmap="">
      {hasData ? (
        <table data-heatmaptable="">
          <caption data-sronly="">{`${label}. ${summary}`}</caption>
          <thead>
            <tr>
              <th data-heatmapcorner="" scope="col">
                <span aria-hidden="true" />
              </th>
              {columns.map((c) => (
                <th key={c} scope="col" data-heatmapcol="">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={r} data-heatmaprow="">
                <th scope="row" data-heatmaprowhead="">
                  {r}
                </th>
                {columns.map((c, ci) => {
                  const cell = cells[ri]?.[ci];
                  return (
                    <td key={c} data-heatmapcell="" data-empty={cell ? undefined : 'true'}>
                      {cell ? (
                        <span
                          data-heatcell=""
                          title={`${r} × ${c}: ${cell.text ?? formatValue(cell.value)}`}
                          style={
                            {
                              '--heat': String(Math.max(0, Math.min(1, cell.value))),
                              '--heat-c': `var(--series-${(ri % 6) + 1})`,
                            } as React.CSSProperties
                          }
                        >
                          {cell.text ?? formatValue(cell.value)}
                        </span>
                      ) : (
                        <span data-heatmiss="" aria-label="no data">
                          –
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p data-heatmapempty="">No data</p>
      )}
      <figcaption data-sronly="">{summary || 'No data'}</figcaption>
    </figure>
  );
}
