import { render, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  AppFrame, 
  widthClass, 
  overlays, 
  initialColumns, 
  onWidthChange, 
  remember, 
  escapeTarget, 
  drawerTrack, 
  
  useStalled,
  isSafeTokenName,
  isSafeTokenValue,
  themeCss,
  safeTokens,
  ThemeTokens
} from '../src/components/AppFrame';

describe('AppFrame Utility Functions', () => {
  it('widthClass calculations', () => {
    expect(widthClass(720)).toBe('phone');
    expect(widthClass(721)).toBe('tablet');
    expect(widthClass(1100)).toBe('tablet');
    expect(widthClass(1101)).toBe('desk');
  });

  it('overlays calculations', () => {
    expect(overlays('desk')).toEqual({ sidebar: false, drawer: false, edge: false });
    expect(overlays('tablet')).toEqual({ sidebar: false, drawer: true, edge: true });
    expect(overlays('phone')).toEqual({ sidebar: true, drawer: true, edge: true });
  });

  it('initialColumns calculations', () => {
    expect(initialColumns({ sidebarOpen: true, drawerOpen: true }, 'tablet')).toEqual({ sidebar: true, drawer: false });
  });

  it('onWidthChange logic', () => {
    expect(onWidthChange({ sidebar: false, drawer: false }, { sidebarOpen: true, drawerOpen: true }, 'phone', 'desk')).toEqual({ sidebar: true, drawer: true });
  });

  it('remember logic', () => {
    expect(remember('tablet', 'drawer')).toBe(false);
    expect(remember('tablet', 'sidebar')).toBe(true);
    expect(remember('phone', 'sidebar')).toBe(false);
  });

  it('escapeTarget logic', () => {
    expect(escapeTarget({ sidebar: true, drawer: true, edge: true, width: 'desk' })).toBe('drawer');
    expect(escapeTarget({ sidebar: true, drawer: true, edge: true, width: 'tablet' })).toBe('edge');
  });

  it('drawerTrack logic', () => {
    expect(drawerTrack(false, true)).toBe(false);
    expect(drawerTrack(true, false)).toBe(true);
    expect(drawerTrack(true, true)).toBe('wide');
  });
});

describe('ThemeTokens Functions', () => {
  it('isSafeTokenName', () => {
    expect(isSafeTokenName('--a-b')).toBe(true);
    expect(isSafeTokenName('-x')).toBe(false);
    expect(isSafeTokenName('--')).toBe(false);
  });

  it('isSafeTokenValue', () => {
    expect(isSafeTokenValue('red')).toBe(true);
    expect(isSafeTokenValue('a;b')).toBe(false);
    expect(isSafeTokenValue('url("//evil/x")')).toBe(false);
    expect(isSafeTokenValue('url("/x.png")')).toBe(true);
    expect(isSafeTokenValue('url("data:image/svg+xml,x")')).toBe(true);
    expect(isSafeTokenValue('a'.repeat(40000))).toBe(false);
  });

  it('themeCss', () => {
    expect(themeCss('bad id', {})).toBe('');
    const css = themeCss('t', { '--a': '1' }, { '--b': '2' });
    expect(css).toContain('[data-frame][data-theme-id="t"]{--a:1;}');
    expect(css).toContain('+[_data-theme="dark"]'.replace('_', ''));
  });

  it('safeTokens', () => {
    expect(safeTokens({ '--ok': '1', 'bad': '2', '--x': 'a;b' })).toEqual([['--ok', '1']]);
  });
});

describe('AppFrame Component', () => {
  it('renders attributes properly based on props', () => {
    const { container } = render(<AppFrame left="wide" reduceMotion accent="gold" bare tokenOverrides={{'--mark':'url("/x.svg")'}}>Content</AppFrame>);
    const frame = container.firstChild as HTMLElement;
    expect(frame).toBeTruthy();
    expect(frame.getAttribute('data-left')).toBe('wide');
    expect(frame.getAttribute('data-motion')).toBe('reduce');
    expect(frame.getAttribute('data-sec')).toBe('gold');
    
    // Check bare wrapper
    const inner = frame.querySelector('[data-inner=""]');
    expect(inner).toBeTruthy();
    
    // Check token overrides in inline style
    expect(frame.style.getPropertyValue('--mark')).toBe('url("/x.svg")');
  });
});

describe('Hooks', () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    vi.useFakeTimers();
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.useRealTimers();
  });

  it('useStalled handles timers', () => {
    let stalled;
    function TestCmp({ trying, settled }: { trying: boolean; settled: boolean }) {
      stalled = useStalled(trying, settled);
      return null;
    }
    
    const { rerender } = render(<TestCmp trying={true} settled={false} />);
    expect(stalled).toBe(false);
    
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(stalled).toBe(true);
    
    rerender(<TestCmp trying={true} settled={true} />);
    expect(stalled).toBe(false);
  });
  
  it('ThemeTokens renders element and avoids reassignment', () => {
    const { rerender } = render(<ThemeTokens id="t" tokens={{ '--a': '1' }} />);
    const el = document.head.querySelector('#morph-ui-theme-tokens');
    expect(el).toBeTruthy();
    expect(el?.textContent).toContain('--a:1');
    
    const textNode = el?.firstChild;
    rerender(<ThemeTokens id="t" tokens={{ '--a': '1' }} />);
    expect(el?.firstChild).toBe(textNode);
  });
});
