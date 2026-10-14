import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { InboxTriage } from '../src/components/InboxTriage';

const ITEMS = [
  { id: 'q1', title: 'Grant email', tone: 'danger' as const },
  { id: 'q2', title: 'Approve deletion', tone: 'warn' as const },
  { id: 'q3', title: 'Confirm swap' },
];

afterEach(() => vi.useRealTimers());

describe('InboxTriage', () => {
  it('renders all pending rows with counts', () => {
    render(<InboxTriage items={ITEMS} />);
    expect(screen.getByText('Grant email')).toBeTruthy();
    expect(screen.getByText('3 pending')).toBeTruthy();
  });

  it('accept fires the callback and the row leaves the queue', async () => {
    const onAccept = vi.fn();
    render(<InboxTriage items={ITEMS} onAccept={onAccept} />);
    fireEvent.click(screen.getByRole('button', { name: 'Accept: Grant email' }));
    expect(onAccept).toHaveBeenCalledWith(expect.objectContaining({ id: 'q1' }));
    await waitFor(() => expect(screen.queryByText('Grant email')).toBeNull());
    expect(screen.getByText('2 pending')).toBeTruthy();
    expect(screen.getByText('1 done')).toBeTruthy();
  });

  it('snooze uses the first option and reports it', async () => {
    const onSnooze = vi.fn();
    render(<InboxTriage items={ITEMS} onSnooze={onSnooze} snoozeOptions={['tomorrow', 'next week']} />);
    fireEvent.click(screen.getByRole('button', { name: 'Snooze: Confirm swap' }));
    expect(onSnooze).toHaveBeenCalledWith(expect.objectContaining({ id: 'q3' }), 'tomorrow');
    await waitFor(() => expect(screen.getByText('1 snoozed')).toBeTruthy());
  });

  it('decline counts separately', async () => {
    const onDecline = vi.fn();
    render(<InboxTriage items={ITEMS} onDecline={onDecline} />);
    fireEvent.click(screen.getByRole('button', { name: 'Decline: Approve deletion' }));
    expect(onDecline).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.getByText('1 dropped')).toBeTruthy());
  });

  it('shows the empty state once everything is triaged', async () => {
    render(<InboxTriage items={[ITEMS[0]!]} emptyText="All clear." />);
    fireEvent.click(screen.getByRole('button', { name: 'Accept: Grant email' }));
    await waitFor(() => expect(screen.getByText('All clear.')).toBeTruthy());
  });
});
