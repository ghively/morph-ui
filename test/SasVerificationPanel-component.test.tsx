import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SasVerificationPanel } from '../src/components/SasVerificationPanel';

describe('SasVerificationPanel', () => {
  it('renders idle phase', () => {
    const onStart = vi.fn();
    render(<SasVerificationPanel phase="idle" onStart={onStart} />);
    
    expect(screen.getByRole('button', { name: 'Start verification' })).toBeTruthy();
    expect(screen.getByText('Compare emoji with one of your other signed-in clients.')).toBeTruthy();
    expect(screen.queryByText('Cancel')).toBeNull();
    
    fireEvent.click(screen.getByRole('button', { name: 'Start verification' }));
    expect(onStart).toHaveBeenCalled();
  });

  it('renders emoji phase and beats status check', () => {
    const onConfirmMatch = vi.fn();
    const onReportMismatch = vi.fn();
    render(
      <SasVerificationPanel
        phase="requested"
        emoji={[
          { symbol: '🐶', name: 'Dog' },
          { symbol: '🐱', name: 'Cat' }
        ]}
        onStart={() => {}}
        onConfirmMatch={onConfirmMatch}
        onReportMismatch={onReportMismatch}
      />
    );
    
    // Check aria-live on root
    const root = screen.getByText('Verify with another session').parentElement;
    expect(root?.getAttribute('aria-live')).toBe('polite');

    expect(screen.queryByText('Another session wants to verify.')).toBeNull(); // Emoji grid wins

    // Check cells
    expect(screen.getByText('Dog')).toBeTruthy();
    expect(screen.getByText('Cat')).toBeTruthy();

    const matchBtn = screen.getByRole('button', { name: 'They match' });
    const mismatchBtn = screen.getByRole('button', { name: "They don't match" });
    
    fireEvent.click(matchBtn);
    expect(onConfirmMatch).toHaveBeenCalled();
    
    fireEvent.click(mismatchBtn);
    expect(onReportMismatch).toHaveBeenCalled();
  });

  it('renders incoming requested phase', () => {
    const onAccept = vi.fn();
    const onCancel = vi.fn();
    render(
      <SasVerificationPanel
        phase="requested"
        initiatedByMe={false}
        onStart={() => {}}
        onAccept={onAccept}
        onCancel={onCancel}
      />
    );

    expect(screen.getByText('Another session wants to verify.')).toBeTruthy();
    
    const acceptBtn = screen.getByRole('button', { name: 'Accept' });
    fireEvent.click(acceptBtn);
    expect(onAccept).toHaveBeenCalled();

    const cancelBtn = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelBtn);
    expect(onCancel).toHaveBeenCalled();
  });

  it('renders waiting requested phase (initiatedByMe: true)', () => {
    render(
      <SasVerificationPanel
        phase="requested"
        initiatedByMe={true}
        onStart={() => {}}
      />
    );

    expect(screen.getByText('Waiting for your other session…')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Accept' })).toBeNull();
  });

  it('renders done and cancelled texts', () => {
    const { rerender } = render(<SasVerificationPanel phase="done" onStart={() => {}} />);
    expect(screen.getByText('Verified.')).toBeTruthy();

    rerender(<SasVerificationPanel phase="cancelled" onStart={() => {}} />);
    expect(screen.getByText('Cancelled.')).toBeTruthy();
  });

  it('copy overrides work', () => {
    render(
      <SasVerificationPanel
        phase="idle"
        onStart={() => {}}
        copy={{ intro: 'Custom intro', startLabel: 'Go!' }}
      />
    );
    expect(screen.getByText('Custom intro')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Go!' })).toBeTruthy();
  });
});
