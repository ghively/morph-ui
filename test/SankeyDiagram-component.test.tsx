import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SankeyDiagram } from '../src/components/SankeyDiagram';

const NODES = [
  { id: 'a', label: 'Alpha' },
  { id: 'b', label: 'Beta' },
  { id: 'c', label: 'Gamma' },
];

describe('SankeyDiagram', () => {
  it('draws one ribbon per link and one bar per node', () => {
    const { container } = render(
      <SankeyDiagram
        nodes={NODES}
        links={[
          { source: 'a', target: 'b', value: 5 },
          { source: 'a', target: 'c', value: 3 },
          { source: 'b', target: 'c', value: 2 },
        ]}
      />,
    );
    expect(container.querySelectorAll('[data-sankeyflow]').length).toBe(3);
    expect(container.querySelectorAll('[data-sankeybar]').length).toBe(3);
  });

  it('layers nodes left to right by flow depth', () => {
    const { container } = render(
      <SankeyDiagram
        nodes={NODES}
        links={[
          { source: 'a', target: 'b', value: 5 },
          { source: 'b', target: 'c', value: 5 },
        ]}
      />,
    );
    const xOf = (label: string) =>
      Number(
        [...container.querySelectorAll('[data-sankeynode]')]
          .find((g) => g.querySelector('[data-sankeyname]')?.textContent === label)
          ?.querySelector('rect')
          ?.getAttribute('x'),
      );
    const xa = xOf('Alpha');
    const xb = xOf('Beta');
    const xc = xOf('Gamma');
    expect(xa).toBeLessThan(xb);
    expect(xb).toBeLessThan(xc);
  });

  it('lists every flow in the accessible summary', () => {
    render(
      <SankeyDiagram
        nodes={NODES}
        links={[
          { source: 'a', target: 'b', value: 5 },
          { source: 'b', target: 'c', value: 2 },
        ]}
      />,
    );
    expect(screen.getByRole('img', { name: /a → b: 5, b → c: 2/ })).toBeTruthy();
  });

  it('renders empty state without links', () => {
    const { container } = render(<SankeyDiagram nodes={NODES} links={[]} />);
    expect(container.querySelector('[data-sankeyempty]')).toBeTruthy();
  });
});
