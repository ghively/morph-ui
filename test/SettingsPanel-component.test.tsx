import { render, fireEvent, renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  SettingsPanel, 
  SettingRow, 
  SettingRule, 
  minutesToTime, 
  timeToMinutes, 
  TimeRangeField, 
  usePersistedState 
} from '../src/components/SettingsPanel';

describe('SettingsPanel Utilities', () => {
  it('minutesToTime', () => {
    expect(minutesToTime(0)).toBe('00:00');
    expect(minutesToTime(1320)).toBe('22:00');
    expect(minutesToTime(7 * 60)).toBe('07:00');
    expect(minutesToTime(1440)).toBe('00:00');
  });

  it('timeToMinutes', () => {
    expect(timeToMinutes('22:30', 0)).toBe(1350);
    expect(timeToMinutes('', 99)).toBe(99);
    expect(timeToMinutes('nonsense', 5)).toBe(5);
  });
});

describe('usePersistedState', () => {
  let store: Record<string, string> = {};

  beforeEach(() => {
    store = {};
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => { store[k] = v; },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reads existing key and writes on set', () => {
    store['myKey'] = JSON.stringify('val');
    const { result } = renderHook(() => usePersistedState('myKey', 'init'));
    expect(result.current[0]).toBe('val');

    act(() => {
      result.current[1]('newVal');
    });
    
    expect(result.current[0]).toBe('newVal');
    expect(store['myKey']).toBe(JSON.stringify('newVal'));
  });

  it('falls back on corrupt value', () => {
    store['myKey'] = 'invalid json';
    const { result } = renderHook(() => usePersistedState('myKey', 'init'));
    expect(result.current[0]).toBe('init');
  });

  it('does not throw when localStorage setItem throws', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => { throw new Error('QuotaExceeded'); }
    });

    const { result } = renderHook(() => usePersistedState('myKey', 'init'));
    
    expect(() => {
      act(() => {
        result.current[1]('newVal');
      });
    }).not.toThrow();

    expect(result.current[0]).toBe('newVal');
  });
});

describe('SettingsPanel Components', () => {
  it('renders SettingsPanel and rail correctly', () => {
    const onSection = vi.fn();
    const { container } = render(
      <SettingsPanel 
        sections={[{ id: '1', label: 'Section 1' }, { id: '2', label: 'Section 2' }]} 
        activeSection="2" 
        onSectionChange={onSection}
      >
        <div id="c">Child</div>
      </SettingsPanel>
    );
    
    const tabs = container.querySelectorAll('[role="tab"]');
    expect(tabs.length).toBe(2);
    expect(tabs[0].getAttribute('aria-selected')).toBe('false');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('data-on')).toBe('true');
    
    fireEvent.click(tabs[0]);
    expect(onSection).toHaveBeenCalledWith('1');

    const panel = container.querySelector('[role="tabpanel"]');
    expect(panel?.getAttribute('aria-label')).toBe('Section 2');
    expect(panel?.querySelector('#c')).toBeTruthy();
  });

  it('handles onClose and overrides title', () => {
    const onClose = vi.fn();
    const { container } = render(
      <SettingsPanel 
        sections={[{ id: '1', label: 'Section 1' }]} 
        activeSection="1" 
        onSectionChange={() => {}} 
        onClose={onClose} 
        title="Custom Title" 
        closeLabel="Close me"
      >
        C
      </SettingsPanel>
    );

    const closeBtn = container.querySelector('button[aria-label="Close me"]');
    expect(closeBtn).toBeTruthy();
    if (closeBtn) fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();

    const panel = container.querySelector('[role="tabpanel"]');
    expect(panel?.getAttribute('aria-label')).toBe('Custom Title');
  });

  it('renders SettingRow correctly', () => {
    const { container, rerender } = render(<SettingRow heading="H">C</SettingRow>);
    const row = container.querySelector('[data-setrow=""]');
    expect(row).toBeTruthy();
    expect(row?.querySelector('h4')?.textContent).toBe('H');
    expect(row?.querySelector('p')).toBeNull();

    rerender(<SettingRow heading="H" description="D">C</SettingRow>);
    expect(container.querySelector('p')?.textContent).toBe('D');
  });

  it('renders SettingRule', () => {
    const { container } = render(<SettingRule />);
    expect(container.querySelector('[data-setrule=""]')).toBeTruthy();
  });

  it('TimeRangeField handles inputs correctly', () => {
    const onS = vi.fn();
    const onE = vi.fn();
    const { container } = render(
      <TimeRangeField start={0} end={1350} onStartChange={onS} onEndChange={onE} startLabel="S" endLabel="E" />
    );

    const inputs = container.querySelectorAll('input[type="time"]');
    expect(inputs.length).toBe(2);
    const in1 = inputs[0] as HTMLInputElement;
    const in2 = inputs[1] as HTMLInputElement;
    
    expect(in1.value).toBe('00:00');
    expect(in2.value).toBe('22:30');
    expect(in1.getAttribute('aria-label')).toBe('S');
    expect(in2.getAttribute('aria-label')).toBe('E');

    fireEvent.change(in1, { target: { value: '01:00' } });
    expect(onS).toHaveBeenCalledWith(60);

    fireEvent.change(in2, { target: { value: '23:30' } });
    expect(onE).toHaveBeenCalledWith(1410);
  });
});
