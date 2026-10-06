import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { Popover } from '../src/components/Popover';

const trig = () => screen.getByRole('button', { name: 'Filters' });

describe('Popover', () => {
  it('opens and closes on trigger click', () => {
    const { container } = render(<Popover trigger="Filters" title="Filter sources"><input aria-label="Query" /></Popover>);
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.click(trig());
    expect(screen.getByRole('dialog', { name: 'Filter sources' })).toBeTruthy();
    expect(container.querySelector('[data-popover]')?.hasAttribute('data-open')).toBe(true);
    fireEvent.click(trig());
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(container.querySelector('[data-popover]')?.hasAttribute('data-open')).toBe(false);
  });

  it('wires aria between trigger and panel', () => {
    render(<Popover trigger="Filters" label="Source filters" placement="top-end"><p>Body</p></Popover>);
    const t = trig();
    expect(t.getAttribute('aria-haspopup')).toBe('dialog');
    expect(t.getAttribute('aria-expanded')).toBe('false');
    expect(t.hasAttribute('data-popovertrigger')).toBe(true);
    fireEvent.click(t);
    const panel = screen.getByRole('dialog', { name: 'Source filters' });
    expect(t.getAttribute('aria-expanded')).toBe('true');
    expect(t.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.hasAttribute('data-popoverpanel')).toBe(true);
    expect(panel.getAttribute('data-placement')).toBe('top-end');
    expect(panel.getAttribute('aria-modal')).toBeNull();
  });

  it('labels the dialog by its title', () => {
    render(<Popover trigger="Filters" title="Filter sources" defaultOpen><p>Body</p></Popover>);
    const panel = screen.getByRole('dialog');
    const heading = screen.getByRole('heading', { name: 'Filter sources' });
    expect(panel.getAttribute('aria-labelledby')).toBe(heading.id);
  });

  it('moves focus to the first focusable element, or the panel itself', () => {
    const { unmount } = render(<Popover trigger="Filters"><button type="button">First</button><button type="button">Second</button></Popover>);
    fireEvent.click(trig());
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'First' }));
    unmount();
    render(<Popover trigger="Filters" label="Info"><p>Nothing focusable</p></Popover>);
    fireEvent.click(trig());
    expect(document.activeElement).toBe(screen.getByRole('dialog'));
  });

  it('does not steal focus when open on mount', () => {
    render(<Popover trigger="Filters" defaultOpen><button type="button">Inside</button></Popover>);
    expect(document.activeElement).toBe(document.body);
  });

  it('Escape closes and returns focus to the trigger', () => {
    render(<Popover trigger="Filters"><input aria-label="Query" /></Popover>);
    fireEvent.click(trig());
    const input = screen.getByLabelText('Query');
    expect(document.activeElement).toBe(input);
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trig());
  });

  it('closes on outside mousedown unless disabled', () => {
    const { rerender } = render(<div><span>outside</span><Popover trigger="Filters" defaultOpen><p>Body</p></Popover></div>);
    fireEvent.mouseDown(screen.getByRole('dialog'));
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.mouseDown(screen.getByText('outside'));
    expect(screen.queryByRole('dialog')).toBeNull();
    rerender(<div><span>elsewhere</span><Popover key="b" trigger="Filters" defaultOpen closeOnInteractOutside={false}><p>Body</p></Popover></div>);
    fireEvent.mouseDown(screen.getByText('elsewhere'));
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('supports controlled mode', () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(<Popover trigger="Filters" open={false} onOpenChange={onOpenChange}><p>Body</p></Popover>);
    fireEvent.click(trig());
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('dialog')).toBeNull();
    rerender(<Popover trigger="Filters" open onOpenChange={onOpenChange}><p>Body</p></Popover>);
    expect(screen.getByRole('dialog')).toBeTruthy();

    function Harness() {
      const [open, setOpen] = useState(true);
      return <><span>state:{String(open)}</span><Popover trigger="Ctl" open={open} onOpenChange={setOpen}><p>Body</p></Popover></>;
    }
    rerender(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'Ctl' }));
    expect(screen.getByText('state:false')).toBeTruthy();
  });

  it('accepts a custom trigger and width', () => {
    render(
      <Popover label="Profile" width={300} renderTrigger={p => <button type="button" {...p}>Ada</button>}>
        <p>Card</p>
      </Popover>,
    );
    const t = screen.getByRole('button', { name: 'Ada' });
    expect(t.getAttribute('aria-haspopup')).toBe('dialog');
    fireEvent.click(t);
    const panel = screen.getByRole('dialog', { name: 'Profile' });
    expect(panel.style.getPropertyValue('--popover-w')).toBe('300px');
    fireEvent.keyDown(panel, { key: 'Escape' });
    expect(document.activeElement).toBe(t);
  });
});
