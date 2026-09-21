import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SidePanel } from '../src/components/SidePanel';

describe('SidePanel Component', () => {
  it('handles open state', () => {
    const { container, rerender } = render(
      <SidePanel open={false} slot="left" title="T" onClose={() => {}}>Content</SidePanel>
    );
    const panel = container.firstChild as HTMLElement;
    expect(panel.getAttribute('data-open')).toBe('false');
    expect(panel.getAttribute('aria-hidden')).toBe('true');
    expect(panel.hasAttribute('inert')).toBe(true);

    rerender(<SidePanel open={true} slot="left" title="T" onClose={() => {}}>Content</SidePanel>);
    expect(panel.getAttribute('data-open')).toBe('true');
    expect(panel.getAttribute('aria-hidden')).toBe('false');
    expect(panel.hasAttribute('inert')).toBe(false);
  });

  it('renders onBack button or icon', () => {
    const onBack = vi.fn();
    const { container, rerender } = render(
      <SidePanel open={true} slot="left" title="T" onClose={() => {}} onBack={onBack}>C</SidePanel>
    );
    const backBtn = container.querySelector('button[aria-label="Back"]');
    expect(backBtn).toBeTruthy();
    expect(container.querySelector('[data-tile]')).toBeNull();
    
    if (backBtn) fireEvent.click(backBtn);
    expect(onBack).toHaveBeenCalled();

    rerender(<SidePanel open={true} slot="left" title="T" onClose={() => {}} icon={<span id="icon">I</span>}>C</SidePanel>);
    expect(container.querySelector('button[aria-label="Back"]')).toBeNull();
    expect(container.querySelector('[data-tile]')).toBeTruthy();
  });

  it('renders headerAction correctly', () => {
    const onSelect = vi.fn();
    const { container } = render(
      <SidePanel 
        open={true} slot="drawer" title="T" onClose={() => {}} 
        headerAction={{ label: 'Action', icon: <span>A</span>, onSelect }}
      >C</SidePanel>
    );
    const actionBtn = container.querySelector('button[aria-label="Action"]');
    expect(actionBtn).toBeTruthy();
    if (actionBtn) fireEvent.click(actionBtn);
    expect(onSelect).toHaveBeenCalled();
  });

  it('renders close button correctly', () => {
    const onClose = vi.fn();
    const { container } = render(
      <SidePanel open={true} slot="drawer" title="T" onClose={onClose} bodyId="b1">C</SidePanel>
    );
    const closeBtn = container.querySelector('button[aria-label="Collapse"]');
    expect(closeBtn).toBeTruthy();
    expect(closeBtn?.getAttribute('aria-expanded')).toBe('true');
    expect(closeBtn?.getAttribute('aria-controls')).toBe('b1');
    if (closeBtn) fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('renders title and subtitle', () => {
    const { container } = render(
      <SidePanel open={true} slot="left" title="Title" subtitle="Sub" onClose={() => {}}>C</SidePanel>
    );
    expect(container.textContent).toContain('Title');
    expect(container.textContent).toContain('Sub');
  });

  it('sets slot properly', () => {
    const { container } = render(
      <SidePanel open={true} slot="left" title="T" onClose={() => {}}>C</SidePanel>
    );
    expect((container.firstChild as HTMLElement).getAttribute('data-slot')).toBe('left');
  });

  it('sets body overflow and renders children in body', () => {
    const { container } = render(
      <SidePanel open={true} slot="left" title="T" onClose={() => {}} bodyId="b1" bodyOverflow="hidden">
        <div id="child">Child</div>
      </SidePanel>
    );
    const body = container.querySelector('#b1') as HTMLElement;
    expect(body).toBeTruthy();
    expect(body.style.overflow).toBe('hidden');
    expect(body.querySelector('#child')).toBeTruthy();
  });
});
