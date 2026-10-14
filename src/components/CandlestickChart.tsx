import './CandlestickChart.css';

export interface Candle {
  label: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface CandlestickChartProps {
  candles: Candle[];
  height?: number;
  formatValue?: (value: number) => string;
  label?: string;
  className?: string;
}

/**
 * Dependency-free OHLC candlestick chart, pure SVG. Rising candles use the
 * success token, falling candles the danger token; every candle also prints
 * its O/H/L/C in `title` and the figcaption, so direction is never
 * color-only. Up/down markers (`data-dir`) give tests and consumers a hook.
 */
export function CandlestickChart({
  candles,
  height = 220,
  formatValue = (v) => String(v),
  label = 'Candlestick chart',
  className = '',
}: CandlestickChartProps) {
  const W = 560;
  const H = 220;
  const PAD = 10;
  const hasData = candles.length > 0;
  const lows = candles.map((c) => c.low);
  const highs = candles.map((c) => c.high);
  const min = hasData ? Math.min(...lows) : 0;
  const max = hasData ? Math.max(...highs) : 1;
  const span = max - min || 1;

  const step = W / Math.max(candles.length, 1);
  const bodyW = Math.min(18, step * 0.55);
  const xAt = (i: number) => step * (i + 0.5);
  const yAt = (v: number) => PAD + (1 - (v - min) / span) * (H - PAD * 2);

  const summary = hasData
    ? candles
        .map(
          (c) =>
            `${c.label}: open ${formatValue(c.open)}, high ${formatValue(c.high)}, low ${formatValue(c.low)}, close ${formatValue(c.close)}`,
        )
        .join('; ')
    : '';

  return (
    <figure className={className} data-candles="">
      <div data-candlesarea="" style={{ height }}>
        {!hasData ? (
          <span data-candlesempty="">No data</span>
        ) : (
          <div data-candlesplot="">
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${label}. ${summary}`} data-candlessvg="">
              {candles.map((c, i) => {
                const up = c.close >= c.open;
                const color = up ? 'var(--morph-success)' : 'var(--morph-danger)';
                const top = yAt(Math.max(c.open, c.close));
                const bottom = yAt(Math.min(c.open, c.close));
                const x = xAt(i);
                return (
                  <g key={c.label} data-candle="" data-dir={up ? 'up' : 'down'}>
                    {/* Wick: high–low stem behind the body. */}
                    <line
                      x1={x.toFixed(1)}
                      y1={yAt(c.high).toFixed(1)}
                      x2={x.toFixed(1)}
                      y2={yAt(c.low).toFixed(1)}
                      stroke={color}
                      strokeWidth="1.5"
                      data-candlewick=""
                    />
                    <rect
                      x={(x - bodyW / 2).toFixed(1)}
                      y={top.toFixed(1)}
                      width={bodyW.toFixed(1)}
                      height={Math.max(1.5, bottom - top).toFixed(1)}
                      rx="1.5"
                      fill={up ? 'none' : color}
                      stroke={color}
                      strokeWidth="1.5"
                      data-candlebody=""
                    >
                      <title>
                        {`${c.label} ${up ? '▲' : '▼'} open ${formatValue(c.open)}, high ${formatValue(c.high)}, low ${formatValue(c.low)}, close ${formatValue(c.close)}`}
                      </title>
                    </rect>
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </div>
      <div data-candlestickaxis="">
        {candles.map((c) => (
          <span key={c.label} data-candlesticktick="">
            {c.label}
          </span>
        ))}
      </div>
      <figcaption data-sronly="">{summary || 'No data'}</figcaption>
    </figure>
  );
}
