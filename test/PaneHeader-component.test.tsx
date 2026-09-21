import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PaneHeader } from '../src/components/PaneHeader';

describe('PaneHeader Component', () => {
  it('renders root structure and title/subtitle', () => {
    const { container } = render(
      <PaneHeader title="Main Title" subtitle="Sub Title" subtitlePrefix={<span>L</span>} />
    );
    const head = container.querySelector('[data-panehead=""]');
    expect(head).toBeTruthy();
    
    const h1 = container.querySelector('h1[data-swap="title"]');
    expect(h1?.textContent).toBe('Main Title');
    
    const sub = container.querySelector('[data-swap="sub"]');
    expect(sub?.textContent).toContain('Sub Title');
    expect(sub?.querySelector('span')?.textContent).toBe('L');
    
    // Check mark is present
    expect(container.querySelector('[data-mark=""]')).toBeTruthy();
  });

  it('handles onBack', () => {
    const onBack = vi.fn();
    const { container } = render(<PaneHeader title="T" onBack={onBack} backLabel="Go back" />);
    const backBtn = container.querySelector('button');
    expect(backBtn?.getAttribute('aria-label')).toBe('Go back');
    expect(container.querySelector('[data-mark=""]')).toBeNull();
    
    if (backBtn) fireEvent.click(backBtn);
    expect(onBack).toHaveBeenCalled();
  });

  it('renders status', () => {
    const { container } = render(
      <PaneHeader 
        title="T" 
        status={{ tone: 'warn', phase: 'syncing', label: 'Catching up', detail: 'example.com', indicator: <span>I</span> }}
      />
    );
    const statusDiv = container.querySelector('[data-headmeta=""]');
    expect(statusDiv?.getAttribute('data-tone')).toBe('warn');
    expect(statusDiv?.getAttribute('data-connection')).toBe('syncing');
    expect(statusDiv?.getAttribute('aria-label')).toBe('Status: Catching up');
    
    expect(statusDiv?.querySelector('[data-num=""]')?.textContent).toBe('example.com');
    expect(statusDiv?.querySelector('[data-meta=""]')?.textContent).toBe('Catching up');
  });

  it('renders actions', () => {
    const onSelect1 = vi.fn();
    const { container } = render(
      <PaneHeader 
        title="T" 
        actions={[
          { id: '1', label: 'A1', icon: <span>1</span>, shortLabel: 's1', active: true, controls: 'c1', onSelect: onSelect1 },
          { id: '2', label: 'A2', icon: <span>2</span>, onSelect: () => {} }
        ]}
      />
    );
    
    const buttons = container.querySelectorAll('[data-hb=""]');
    expect(buttons.length).toBe(2);
    
    const b1 = buttons[0] as HTMLElement;
    expect(b1.getAttribute('data-on')).toBe('true');
    expect(b1.getAttribute('aria-pressed')).toBe('true');
    expect(b1.getAttribute('aria-expanded')).toBe('true');
    expect(b1.getAttribute('aria-controls')).toBe('c1');
    expect(b1.querySelector('[data-hbl=""]')?.textContent).toBe('s1');
    
    fireEvent.click(b1);
    expect(onSelect1).toHaveBeenCalled();

    const b2 = buttons[1] as HTMLElement;
    expect(b2.getAttribute('data-on')).toBe('false');
    expect(b2.getAttribute('aria-expanded')).toBeNull();
    expect(b2.querySelector('[data-hbl=""]')).toBeNull();
  });
});
