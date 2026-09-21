import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BloomSheet } from '../src/components/BloomSheet';

describe('BloomSheet', () => {
  it('renders trigger initially', () => {
    render(<BloomSheet triggerLabel="Open Sheet" title="Title">Content</BloomSheet>);
    expect(screen.getByRole('button', { name: 'Open Sheet' })).toBeDefined();
    
    // Panel should be in document but conceptually hidden by CSS/opacity 0
    const dialog = screen.getByRole('dialog', { hidden: true });
    expect(dialog).toBeDefined();
  });

  it('opens and closes via buttons', () => {
    const { container } = render(<BloomSheet triggerLabel="Open Sheet" title="Title">Content</BloomSheet>);
    const trigger = screen.getByRole('button', { name: 'Open Sheet' });
    const wrapper = container.querySelector('.bloom-sheet-container');
    
    expect(wrapper?.getAttribute('data-open')).toBe('false');
    
    fireEvent.click(trigger);
    expect(wrapper?.getAttribute('data-open')).toBe('true');
    
    const closeBtn = screen.getByRole('button', { name: 'Close panel', hidden: true });
    fireEvent.click(closeBtn);
    expect(wrapper?.getAttribute('data-open')).toBe('false');
  });

  it('closes on escape', () => {
    const { container } = render(<BloomSheet triggerLabel="Open Sheet" title="Title">Content</BloomSheet>);
    const trigger = screen.getByRole('button', { name: 'Open Sheet' });
    const wrapper = container.querySelector('.bloom-sheet-container');
    
    fireEvent.click(trigger);
    expect(wrapper?.getAttribute('data-open')).toBe('true');
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(wrapper?.getAttribute('data-open')).toBe('false');
  });
});
