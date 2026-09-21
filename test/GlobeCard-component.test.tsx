import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GlobeCard } from '../src/components/GlobeCard';

describe('GlobeCard', () => {
  it('renders title and description', () => {
    render(<GlobeCard title="Global Reach" description="Monitoring worldwide activity" />);
    
    expect(screen.getByText('Global Reach')).toBeDefined();
    expect(screen.getByText('Monitoring worldwide activity')).toBeDefined();
    expect(screen.getByRole('img', { name: 'Interactive 3D Globe' })).toBeDefined();
  });

  it('renders with custom icon', () => {
    render(<GlobeCard title="Globe" icon={<span data-testid="custom-icon">Icon</span>} />);
    
    expect(screen.getByTestId('custom-icon')).toBeDefined();
  });

  it('handles mouse events without crashing', () => {
    const { container } = render(<GlobeCard title="Globe" />);
    const card = container.firstChild as HTMLElement;
    
    // Simulate hover/unhover
    fireEvent.mouseEnter(card);
    fireEvent.mouseLeave(card);
    
    // Simulate focus/blur
    fireEvent.focus(card);
    fireEvent.blur(card);
    
    expect(card).toBeDefined();
  });
});
