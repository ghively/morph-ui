import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NavigationRail, BrandWordmark } from '../src/components/NavigationRail';

describe('BrandWordmark', () => {
  it('splits PascalCase name correctly', () => {
    const { container, rerender } = render(<BrandWordmark name="MorphUi" />);
    expect(container.textContent).toBe('MorphUi');
    const span = container.querySelector('span');
    expect(span?.textContent).toBe('Ui');

    rerender(<BrandWordmark name="morph" />);
    expect(container.querySelector('span')).toBeNull();
  });
});

describe('NavigationRail Component', () => {
  const items = [
    { id: 'item1', label: 'Item 1', icon: <span data-testid="icon1">1</span> },
    { id: 'item2', label: 'Item 2', icon: <span data-testid="icon2">2</span> },
  ];

  it('renders root attributes correctly', () => {
    const { container } = render(<NavigationRail items={items} onSelect={() => {}} label="MyNav" />);
    const root = container.firstChild as HTMLElement;
    expect(root.getAttribute('role')).toBe('navigation');
    expect(root.getAttribute('aria-label')).toBe('MyNav');
  });

  it('renders nav items and active state correctly', () => {
    const { container } = render(<NavigationRail items={items} activeId="item2" onSelect={() => {}} />);
    const group = container.querySelector('[data-navgroup=""]');
    expect(group?.getAttribute('data-nav')).toBe('1');
    const style = (group as HTMLElement).style.getPropertyValue('--nav-i');
    expect(style).toBe('1');

    const item2 = container.querySelectorAll('[data-dockitem=""]')[1] as HTMLElement;
    expect(item2.getAttribute('data-on')).toBe('true');
    expect(item2.getAttribute('aria-current')).toBe('page');
    expect(item2.getAttribute('title')).toBe('Item 2');
    expect(item2.getAttribute('aria-label')).toBe('Item 2');
  });

  it('handles empty active state', () => {
    const { container } = render(<NavigationRail items={items} onSelect={() => {}} />);
    const group = container.querySelector('[data-navgroup=""]');
    expect(group?.getAttribute('data-nav')).toBe('none');
    expect((group as HTMLElement).style.getPropertyValue('--nav-i')).toBe('0');
  });

  it('calls onPinnedChange when pin button is clicked', () => {
    const fn = vi.fn();
    const { container } = render(<NavigationRail items={items} onSelect={() => {}} pinned={true} onPinnedChange={fn} />);
    const pinBtn = container.querySelector('button[data-fade=""]') as HTMLButtonElement;
    expect(pinBtn.getAttribute('aria-pressed')).toBe('true');
    expect(pinBtn.getAttribute('title')).toBe('Unpin the rail');
    
    fireEvent.click(pinBtn);
    expect(fn).toHaveBeenCalledWith(false);
  });

  it('renders primaryAction and calls onSelect', () => {
    const fn = vi.fn();
    const { container } = render(<NavigationRail items={items} onSelect={() => {}} primaryAction={{ label: 'Primary', onSelect: fn }} />);
    const primaryBtn = container.querySelector('[data-primary=""]') as HTMLButtonElement;
    expect(primaryBtn).toBeTruthy();
    
    fireEvent.click(primaryBtn);
    expect(fn).toHaveBeenCalled();
  });

  it('renders footerItems and account', () => {
    const fn = vi.fn();
    const accountFn = vi.fn();
    const { container } = render(
      <NavigationRail 
        items={items} 
        onSelect={() => {}} 
        footerItems={[{ id: 'f1', label: 'Footer1', icon: <span>F</span>, onSelect: fn, shedWhenFolded: true }]}
        account={{ name: 'Account', avatar: <span>A</span>, onSelect: accountFn }}
      />
    );
    
    const shedItem = container.querySelector('[data-fold="shed"][title="Footer1"]');
    expect(shedItem).toBeTruthy();
    
    const accountBtn = container.querySelector('[aria-label="Settings"]');
    expect(accountBtn).toBeTruthy();
    
    // Check avatar wrapper has display: contents
    const icWrapper = accountBtn?.querySelector('[data-ic=""]') as HTMLElement;
    expect(icWrapper.style.display).toBe('contents');

    // spring is present
    const spring = container.querySelector('[data-fold="shed"][aria-hidden="true"]');
    expect(spring).toBeTruthy();
  });
});
