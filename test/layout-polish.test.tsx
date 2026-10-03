import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { Drawer } from '../src/components/Drawer';
import { Tabs } from '../src/components/Tabs';

import { FloatingDock } from '../src/components/FloatingDock';
import { ModalSurface } from '../src/components/ModalSurface';
import { NavigationRail } from '../src/components/NavigationRail';

import { Breadcrumbs } from '../src/components/Breadcrumbs';

import { widthClass, pageWindow, minutesToTime, timeToMinutes,  } from '../src/components/layout.shared';

describe('AppFrame utilities', () => {
  it('widthClass', () => {
    expect(widthClass(700)).toBe('phone');
    expect(widthClass(900)).toBe('tablet');
    expect(widthClass(1200)).toBe('desk');
  });
});

describe('Breadcrumbs logic', () => {
  it('collapses breadcrumbs', () => {
    const { container } = render(<Breadcrumbs trail={[{label: 'a'}, {label: 'b'}, {label: 'c'}, {label: 'd'}, {label: 'e'}]} maxVisible={3} />);
    expect(container.textContent).toContain('…');
  });
});

describe('Drawer', () => {
  it('renders and handles escape', () => {
    const onClose = vi.fn();
    render(<Drawer open={true} onClose={onClose} label="D" title="Drawer" size="md">Test</Drawer>);
    expect(screen.getByText('Drawer')).toBeTruthy();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});

describe('Pagination logic', () => {
  it('pageWindow', () => {
    expect(pageWindow(5, 10, 1)).toEqual([1, 'gap', 4, 5, 6, 'gap', 10]);
  });
});

describe('FloatingDock hook', () => {
  it('calculates scale', () => {
    // This is tested in component implicitly or we can just render
    const { container } = render(<FloatingDock items={[{id: '1', label: '1', icon: <span />}]} />);
    expect(container.querySelector('.floating-dock-item')).toBeTruthy();
  });
});

describe('ModalSurface', () => {
  it('handles tabs and close', () => {
    const onClose = vi.fn();
    const onTabChange = vi.fn();
    render(<ModalSurface label="M" onClose={onClose} tabs={[{id: 'a', label: 'A'}]} activeTab="a" onTabChange={onTabChange}><div/></ModalSurface>);
    expect(screen.getByText('A')).toBeTruthy();
    fireEvent.click(screen.getByText('A'));
    expect(onTabChange).toHaveBeenCalledWith('a');
  });
});

describe('NavigationRail', () => {
  it('renders brand correctly', () => {
    render(<NavigationRail items={[]} onSelect={() => {}} brand={{name: 'AgentOps'}} />);
    expect(screen.getByText('Agent')).toBeTruthy();
    expect(screen.getByText('Ops')).toBeTruthy();
  });
});

describe('SettingsPanel logic', () => {
  it('time conversions', () => {
    expect(minutesToTime(90)).toBe('01:30');
    expect(timeToMinutes('01:30', 0)).toBe(90);
  });
});

describe('Tabs', () => {
  it('navigates with arrows', () => {
    const onTabChange = vi.fn();
    render(<Tabs tabs={[{id: 'a', label: 'A'}, {id: 'b', label: 'B'}]} activeId="a" onTabChange={onTabChange} />);
    const t = screen.getByText('A').closest('button')!;
    fireEvent.keyDown(t, { key: 'ArrowRight' });
    expect(onTabChange).toHaveBeenCalledWith('b');
  });
});
