import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StackedBarChart } from '../src/components/StackedBarChart';

const CATEGORIES = ['mini', 'pro'];
const SERIES = [
  { label: 'Chat', values: [10, 20] },
  { label: 'Embed', values: [5, 10] },
];

describe('StackedBarChart', () => {
  it('renders one stack per category and one segment per series', () => {
    const { container } = render(
      <StackedBarChart categories={CATEGORIES} series={SERIES} />,
    );
    expect(container.querySelectorAll('[data-sbarstack]').length).toBe(2);
    expect(container.querySelectorAll('[data-sbarseg]').length).toBe(4);
    expect(container.querySelectorAll('[data-sbarlegend] li').length).toBe(2);
  });

  it('supports horizontal orientation', () => {
    const { container } = render(
      <StackedBarChart categories={CATEGORIES} series={SERIES} orientation="horizontal" />,
    );
    expect(container.querySelector('[data-sbar]')!.getAttribute('data-orientation')).toBe(
      'horizontal',
    );
  });

  it('prints each bar total and the full summary', () => {
    render(<StackedBarChart categories={CATEGORIES} series={SERIES} />);
    expect(screen.getByText('15')).toBeTruthy();
    expect(screen.getByText('30')).toBeTruthy();
    expect(
      screen.getByRole('img', { name: /mini: Chat 10, Embed 5 \(total 15\)/ }),
    ).toBeTruthy();
  });

  it('renders empty state without categories', () => {
    const { container } = render(<StackedBarChart categories={[]} series={SERIES} />);
    expect(container.querySelector('[data-sbarempty]')).toBeTruthy();
  });
});
