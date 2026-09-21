import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ModalSurface } from '../src/components/ModalSurface';

describe('ModalSurface', () => {
  it('renders with correct ARIA attributes', () => {
    const { getByRole } = render(
      <ModalSurface label="Test Dialog" onClose={() => {}}>
        <div />
      </ModalSurface>
    );
    const dialog = getByRole('dialog');
    expect(dialog).toBeTruthy();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-label')).toBe('Test Dialog');
  });

  it('auto-focuses first focusable element and restores focus on unmount', () => {
    const outerButton = document.createElement('button');
    document.body.appendChild(outerButton);
    outerButton.focus();
    
    expect(document.activeElement).toBe(outerButton);

    const { getByTestId, unmount } = render(
      <ModalSurface label="Focus Test" onClose={() => {}}>
        <button data-testid="inner-btn">Inner</button>
      </ModalSurface>
    );

    const innerButton = getByTestId('inner-btn');
    expect(document.activeElement).toBe(innerButton);

    unmount();
    expect(document.activeElement).toBe(outerButton);
    
    document.body.removeChild(outerButton);
  });

  it('closes on escape correctly', () => {
    const onClose = vi.fn();
    render(
      <ModalSurface label="Escape Test" onClose={onClose}>
        <div />
      </ModalSurface>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close on escape when dismissOnEscape is false', () => {
    const onClose = vi.fn();
    render(
      <ModalSurface label="Escape Test" onClose={onClose} dismissOnEscape={false}>
        <div />
      </ModalSurface>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes on scrim click, but not on panel click', () => {
    const onClose = vi.fn();
    const { getByRole } = render(
      <ModalSurface label="Click Test" onClose={onClose}>
        <div />
      </ModalSurface>
    );

    const dialog = getByRole('dialog');
    const scrim = dialog.parentElement;

    // Panel click
    fireEvent.click(dialog);
    expect(onClose).not.toHaveBeenCalled();

    // Scrim click
    fireEvent.click(scrim!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('supports placement attributes', () => {
    const { getByRole, rerender } = render(
      <ModalSurface label="Placement Test" onClose={() => {}} placement="bottom-sheet">
        <div />
      </ModalSurface>
    );
    
    let dialog = getByRole('dialog');
    let scrim = dialog.parentElement;
    expect(dialog.getAttribute('data-drawer')).toBe('up');
    
    rerender(
      <ModalSurface label="Placement Test" onClose={() => {}} placement="top-drawer">
        <div />
      </ModalSurface>
    );
    dialog = getByRole('dialog');
    scrim = dialog.parentElement;
    expect(dialog.getAttribute('data-drawer')).toBe('down');
    
    rerender(
      <ModalSurface label="Placement Test" onClose={() => {}} placement="center">
        <div />
      </ModalSurface>
    );
    dialog = getByRole('dialog');
    scrim = dialog.parentElement;
    expect(dialog.getAttribute('data-drawer')).toBe('up');
    expect(scrim!.style.alignItems).toBe('center');
  });

  it('renders tabs correctly', () => {
    const onTabChange = vi.fn();
    const { getAllByRole, getByRole } = render(
      <ModalSurface 
        label="Tabs Test" 
        onClose={() => {}} 
        tabs={[{ id: 't1', label: 'Tab 1' }, { id: 't2', label: 'Tab 2' }]}
        activeTab="t1"
        onTabChange={onTabChange}
      >
        <div />
      </ModalSurface>
    );

    const tabs = getAllByRole('tab');
    expect(tabs.length).toBe(2);
    expect(tabs[0]!.getAttribute('aria-selected')).toBe('true');
    expect(tabs[1]!.getAttribute('aria-selected')).toBe('false');

    const tabpanel = getByRole('tabpanel');
    expect(tabpanel).toBeTruthy();

    fireEvent.click(tabs[1]!);
    expect(onTabChange).toHaveBeenCalledWith('t2');
  });

  it('renders title and close button', () => {
    const { getByLabelText } = render(
      <ModalSurface label="Title Test" onClose={() => {}} title="My Title">
        <div />
      </ModalSurface>
    );
    
    const closeBtn = getByLabelText('Close My Title');
    expect(closeBtn).toBeTruthy();
  });

  it('traps tab focus', () => {
    const originalOffsetParent = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetParent');
    Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
      get() { return this.parentNode; },
      configurable: true
    });

    const { getByTestId } = render(
      <ModalSurface label="Tab Test" onClose={() => {}}>
        <button data-testid="b1">1</button>
        <button data-testid="b2">2</button>
        <button data-testid="b3">3</button>
      </ModalSurface>
    );

    const b1 = getByTestId('b1');
    const b3 = getByTestId('b3');

    b3.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(b1);

    b1.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(b3);

    if (originalOffsetParent) {
      Object.defineProperty(HTMLElement.prototype, 'offsetParent', originalOffsetParent);
    } else {
      delete (HTMLElement.prototype as unknown as Record<string, unknown>).offsetParent;
    }
  });
});
