import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MultimodalComposer } from '../src/components/MultimodalComposer';
import { TokenPills } from '../src/components/TokenPills';

describe('MultimodalComposer (polish additions)', () => {
  it('seeds the tray from defaultAttachments with type tiles', () => {
    const { container } = render(<MultimodalComposer defaultAttachments={[new File(['x'], 'shot.png', { type: 'image/png' }), new File(['x'], 'run.json')]} />);
    expect(container.querySelector('.mm-thumb.k-img')?.textContent).toBe('PNG');
    expect(container.querySelector('.mm-thumb.k-code')?.textContent).toBe('JSON');
  });

  it('starts in voice mode and toggles back to text', () => {
    render(<MultimodalComposer defaultVoiceMode />);
    expect(screen.getByText('Listening…')).toBeTruthy();
    expect(screen.queryByRole('combobox')).toBeFalsy();
    fireEvent.click(screen.getByLabelText('Stop voice input'));
    expect(screen.getByRole('combobox')).toBeTruthy();
  });

  it('defers Enter to the host when onKeyDown is given', () => {
    const onSend = vi.fn(), onKeyDown = vi.fn();
    render(<MultimodalComposer draftText="hi" onSend={onSend} onKeyDown={onKeyDown} />);
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' });
    expect(onKeyDown).toHaveBeenCalled();
    expect(onSend).not.toHaveBeenCalled();
  });
});

describe('TokenPills (polish additions)', () => {
  const options = [{ id: 'a', label: 'A', count: 3 }, { id: 'b', label: 'B', disabled: true }];

  it('renders counts and respects disabled options', () => {
    const onChange = vi.fn();
    const { container } = render(<TokenPills options={options} selectedIds={[]} onChange={onChange} />);
    expect(container.querySelector('.token-pill-count')?.textContent).toBe('3');
    const pills = container.querySelectorAll<HTMLButtonElement>('.token-pill');
    expect(pills[1].disabled).toBe(true);
    fireEvent.keyDown(pills[1], { key: 'Enter' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('puts the roving tab stop on the first selected pill', () => {
    const { container } = render(<TokenPills options={[{ id: 'x', label: 'X' }, { id: 'y', label: 'Y' }]} selectedIds={['y']} onChange={() => {}} />);
    const pills = container.querySelectorAll('.token-pill');
    expect(pills[0].getAttribute('tabindex')).toBe('-1');
    expect(pills[1].getAttribute('tabindex')).toBe('0');
  });
});
