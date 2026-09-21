import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DetailsPanel, ProfileCard } from '../src/components/DetailsPanel';

describe('DetailsPanel Component', () => {
  it('renders root structure', () => {
    const { container } = render(
      <DetailsPanel kind="Member" context="Context" label="RegionLabel" onClose={() => {}}>
        Child
      </DetailsPanel>
    );
    const root = container.firstChild as HTMLElement;
    expect(root.getAttribute('role')).toBe('region');
    expect(root.getAttribute('aria-label')).toBe('RegionLabel');
    expect(container.textContent).toContain('Member');
    expect(container.textContent).toContain('Context');
  });

  it('handles onClose', () => {
    const onClose = vi.fn();
    const { container } = render(
      <DetailsPanel kind="K" label="L" onClose={onClose}>C</DetailsPanel>
    );
    const closeBtn = container.querySelector('button[aria-label="Close details"]');
    expect(closeBtn).toBeTruthy();
    if (closeBtn) fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('renders onBack or icon', () => {
    const onBack = vi.fn();
    const { container, rerender } = render(
      <DetailsPanel kind="K" label="L" onClose={() => {}} onBack={onBack}>C</DetailsPanel>
    );
    const backBtn = container.querySelector('button[aria-label="Back"]');
    expect(backBtn).toBeTruthy();
    expect(container.querySelector('[data-tile=""]')).toBeNull();
    
    if (backBtn) fireEvent.click(backBtn);
    expect(onBack).toHaveBeenCalled();

    rerender(
      <DetailsPanel kind="K" label="L" onClose={() => {}} icon={<span id="i">I</span>}>C</DetailsPanel>
    );
    expect(container.querySelector('button[aria-label="Back"]')).toBeNull();
    expect(container.querySelector('[data-tile=""]')).toBeTruthy();
  });

  it('renders children in scrolling body', () => {
    const { container } = render(
      <DetailsPanel kind="K" label="L" onClose={() => {}}>
        <div id="c">Child</div>
      </DetailsPanel>
    );
    const body = container.querySelector('div[style*="overflow: auto"]');
    expect(body).toBeTruthy();
    expect(body?.querySelector('#c')).toBeTruthy();
  });
});

describe('ProfileCard Component', () => {
  it('renders avatar and flex row layout', () => {
    const { container } = render(<ProfileCard title="T" avatar={<span>A</span>} />);
    const card = container.querySelector('[data-card=""]') as HTMLElement;
    expect(card.style.display).toBe('flex');
    expect(card.firstChild?.textContent).toBe('A');
  });

  it('renders without avatar', () => {
    const { container } = render(<ProfileCard title="T" />);
    const card = container.querySelector('[data-card=""]') as HTMLElement;
    expect(card.style.display).not.toBe('flex');
  });

  it('renders fields when provided', () => {
    const { container } = render(
      <ProfileCard 
        title="Title" 
        identifier="ID" 
        description="Desc" 
        note="Note" 
      />
    );
    expect(container.querySelector('[data-strong=""]')?.textContent).toBe('Title');
    expect(container.querySelector('[data-num=""]')?.textContent).toBe('ID');
    const metas = container.querySelectorAll('[data-meta=""]');
    expect(metas[0].textContent).toBe('Desc');
    expect(metas[1].textContent).toBe('Note');
  });

  it('renders badges and toggles', () => {
    const onChange = vi.fn();
    const { container } = render(
      <ProfileCard 
        title="T" 
        badges={[{ id: '1', label: 'B1', solid: true }, { id: '2', label: 'B2' }]} 
        toggles={[{ id: 't1', label: 'Toggle', on: true, onChange }]} 
      />
    );
    const tags = container.querySelectorAll('[data-tag=""]');
    expect(tags[0].textContent).toBe('B1');
    expect(tags[0].hasAttribute('data-solid')).toBe(true);
    expect(tags[1].textContent).toBe('B2');
    expect(tags[1].hasAttribute('data-solid')).toBe(false);

    const toggle = container.querySelector('[data-chip=""]') as HTMLButtonElement;
    expect(toggle.getAttribute('data-on')).toBe('true');
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(toggle);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('renders chips', () => {
    const { container, rerender } = render(<ProfileCard title="T" chips={['C1', 'C2']} />);
    const chips = container.querySelectorAll('[data-chip=""]');
    expect(chips.length).toBe(2);

    rerender(<ProfileCard title="T" chips={[]} />);
    expect(container.textContent).toContain('No capabilities published.');
  });

  it('renders status', () => {
    const { container, rerender } = render(<ProfileCard title="T" status={{ text: 'S', tone: 'ok' }} />);
    const dot = container.querySelector('[data-dot=""]');
    expect(dot?.getAttribute('data-tone')).toBe('ok');

    rerender(<ProfileCard title="T" status={{ text: 'S' }} />);
    expect(container.querySelector('[data-dot=""]')?.getAttribute('data-tone')).toBeNull();
  });

  it('renders eyebrow', () => {
    const { container } = render(<ProfileCard title="T" eyebrow="Eye" />);
    const eyebrow = container.querySelector('[data-eyebrow=""]');
    expect(eyebrow?.textContent).toBe('Eye');
    // eyebrow must be before card
    expect(eyebrow?.nextElementSibling?.getAttribute('data-card')).toBe('');
  });
});
