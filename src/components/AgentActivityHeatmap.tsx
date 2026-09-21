import { useState, useMemo, useRef, type KeyboardEvent } from 'react';
import './AgentActivityHeatmap.css';

export interface HeatmapDataPoint {
  date: string;
  metric: string;
  count: number;
}

export interface AgentActivityHeatmapProps {
  data: HeatmapDataPoint[];
  metrics?: string[];
  onCellSelect?: (date: string, metric: string, count: number) => void;
  className?: string;
}

const DEFAULT_METRICS = [
  'agent runs/day',
  'messages/day',
  'tool calls/day',
  'failures/day',
  'completed tasks/day',
  'human interventions/day'
];

export function AgentActivityHeatmap({
  data,
  metrics = DEFAULT_METRICS,
  onCellSelect,
  className = ''
}: AgentActivityHeatmapProps) {
  const [selectedMetric, setSelectedMetric] = useState(metrics[0] || '');
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Roving tabindex state
  const [focusedIndex, setFocusedIndex] = useState<{col: number, row: number}>({col: 0, row: 0});

  const filteredData = useMemo(() => {
    return data.filter(d => d.metric === selectedMetric);
  }, [data, selectedMetric]);

  // Generate 7 rows (days of week) x 52 columns (weeks) roughly.
  // Instead of a strict calendar, we'll just chunk the data. 
  // Let's assume we want to show 52 weeks * 7 days = 364 days ending on the latest date in data, or today.
  
  const dates = useMemo(() => {
    // Collect all unique dates from the entire data set to form the grid.
    const allDates = Array.from(new Set(data.map(d => d.date))).sort();
    return allDates;
  }, [data]);

  const maxCount = useMemo(() => {
    let max = 0;
    filteredData.forEach(d => {
      if (d.count > max) max = d.count;
    });
    return max;
  }, [filteredData]);

  // Build columns of 7 days
  const gridCells = useMemo(() => {
    const getLevel = (count: number) => {
      if (count === 0) return 0;
      if (maxCount === 0) return 1;
      const ratio = count / maxCount;
      if (ratio <= 0.33) return 1;
      if (ratio <= 0.66) return 2;
      return 3;
    };

    const dataMap = new Map<string, number>();
    filteredData.forEach(d => dataMap.set(d.date, d.count));
    
    const cells: {date: string, count: number, level: number}[] = [];
    dates.forEach(date => {
      const count = dataMap.get(date) || 0;
      cells.push({
        date,
        count,
        level: getLevel(count)
      });
    });
    return cells;
  }, [dates, filteredData, maxCount]);
  
  const rows = 7;
  const cols = Math.ceil(gridCells.length / rows) || 1;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    const col = Math.floor(index / rows);
    const row = index % rows;
    
    let newCol = col;
    let newRow = row;

    if (e.key === 'ArrowRight') {
      newCol = Math.min(cols - 1, col + 1);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      newCol = Math.max(0, col - 1);
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      newRow = Math.min(rows - 1, row + 1);
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      newRow = Math.max(0, row - 1);
      e.preventDefault();
    }

    const newIndex = newCol * rows + newRow;
    if (newIndex >= 0 && newIndex < gridCells.length) {
      setFocusedIndex({col: newCol, row: newRow});
      
      // Find the element and focus it
      const element = gridRef.current?.querySelector(`[data-index="${newIndex}"]`) as HTMLElement;
      if (element) {
        element.focus();
      }
    }
  };

  return (
    <div className={`agent-activity-heatmap ${className}`}>
      <div className="agent-activity-heatmap-controls" role="group" aria-label="Select metric">
        {metrics.map(metric => (
          <button
            key={metric}
            className="agent-activity-heatmap-metric-btn"
            aria-pressed={selectedMetric === metric}
            onClick={() => setSelectedMetric(metric)}
          >
            {metric}
          </button>
        ))}
      </div>

      <div className="agent-activity-heatmap-grid-container">
        <div 
          className="agent-activity-heatmap-grid" 
          role="grid" 
          aria-label="Activity heatmap"
          ref={gridRef}
        >
          {gridCells.map((cell, index) => {
            const isFocusable = Math.floor(index / rows) === focusedIndex.col && (index % rows) === focusedIndex.row;
            return (
              <div
                key={cell.date}
                className="agent-activity-heatmap-cell"
                role="gridcell"
                tabIndex={isFocusable ? 0 : -1}
                data-level={cell.level}
                data-index={index}
                aria-label={`${cell.date}: ${cell.count} ${selectedMetric}`}
                onClick={() => onCellSelect?.(cell.date, selectedMetric, cell.count)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            );
          })}
        </div>
      </div>

      <div className="agent-activity-heatmap-legend" aria-hidden="true">
        <span>Less</span>
        <div className="agent-activity-heatmap-legend-items">
          <div className="agent-activity-heatmap-legend-cell agent-activity-heatmap-cell" data-level="0" />
          <div className="agent-activity-heatmap-legend-cell agent-activity-heatmap-cell" data-level="1" />
          <div className="agent-activity-heatmap-legend-cell agent-activity-heatmap-cell" data-level="2" />
          <div className="agent-activity-heatmap-legend-cell agent-activity-heatmap-cell" data-level="3" />
        </div>
        <span>More</span>
        <span style={{marginLeft: 'auto'}}>Max: {maxCount}</span>
      </div>
    </div>
  );
}
