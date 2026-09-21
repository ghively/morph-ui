import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RefractionGlassPanel } from '../src/components/RefractionGlassPanel';

describe('RefractionGlassPanel', () => {
  it('renders correctly with children and svg filter', () => {
    const { container } = render(
      <RefractionGlassPanel displacementScale={20} data-testid="glass">
        <div>Glass Content</div>
      </RefractionGlassPanel>
    );

    expect(screen.getByText('Glass Content')).toBeTruthy();
    
    const panel = screen.getByTestId('glass');
    expect(panel).toBeTruthy();

    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    
    const displacementMap = container.querySelector('feDisplacementMap');
    expect(displacementMap?.getAttribute('scale')).toBe('20');
    
    const backdrop = container.querySelector('.refraction-glass-backdrop');
    expect(backdrop?.getAttribute('style')).toMatch(/filter: url\(.*#.*\)/);
  });
});
