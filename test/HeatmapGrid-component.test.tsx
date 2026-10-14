import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HeatmapGrid } from '../src/components/HeatmapGrid';

describe('HeatmapGrid', () => {
  it('renders a real table with row and column headers', () => {
    render(
      <HeatmapGrid
        rows={['Mon', 'Tue']}
        columns={['AM', 'PM']}
        cells={[
          [{ value: 0.5 }, { value: 1 }],
          [{ value: 0 }, undefined],
        ]}
      />,
    );
    const table = screen.getByRole('table');
    expect(within(table).getByRole('columnheader', { name: 'AM' })).toBeTruthy();
    expect(within(table).getByRole('rowheader', { name: 'Tue' })).toBeTruthy();
    expect(table.querySelectorAll('[data-heatcell]').length).toBe(3);
    expect(table.querySelectorAll('[data-heatmiss]').length).toBe(1);
  });

  it('scales intensity through the --heat custom property', () => {
    const { container } = render(
      <HeatmapGrid
        rows={['R']}
        columns={['C']}
        cells={[[{ value: 0.75 }]]}
      />,
    );
    const cell = container.querySelector<HTMLElement>('[data-heatcell]');
    expect(cell?.style.getPropertyValue('--heat')).toBe('0.75');
    expect(cell?.style.getPropertyValue('--heat-c')).toBe('var(--series-1)');
  });

  it('shows every cell as text in the summary', () => {
    render(
      <HeatmapGrid
        label="Deploys"
        rows={['Mon']}
        columns={['AM']}
        cells={[[{ value: 0.5 }]]}
      />,
    );
    expect(screen.getByText(/Deploys\. Mon×AM: 50/)).toBeTruthy();
  });

  it('renders empty state for no rows', () => {
    const { container } = render(<HeatmapGrid rows={[]} columns={[]} cells={[]} />);
    expect(container.querySelector('[data-heatmapempty]')).toBeTruthy();
  });
});
