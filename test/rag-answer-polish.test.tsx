import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CitationPills } from '../src/components/CitationPills';
import { SourceCardList } from '../src/components/SourceCardList';
import { RetrievalInspector } from '../src/components/RetrievalInspector';
import { GroundingBadge } from '../src/components/GroundingBadge';
import { StreamingStageIndicator } from '../src/components/StreamingStageIndicator';
import { ContextAttributionList } from '../src/components/ContextAttributionList';
import { AnswerFeedback } from '../src/components/AnswerFeedback';
import { FollowUpChips } from '../src/components/FollowUpChips';
import { VariablePromptInput } from '../src/components/VariablePromptInput';

describe('CitationPills', () => {
  it('selects, labels with title and roves with arrows', () => {
    const onSelect = vi.fn();
    const { container } = render(<CitationPills citations={[{ id: 'a', title: 'Doc A' }, { id: 'b' }]} activeId="a" onSelect={onSelect} />);
    const pills = container.querySelectorAll('[data-cite]');
    expect(pills[0]!.getAttribute('aria-label')).toBe('Source 1: Doc A');
    expect(pills[0]!.hasAttribute('data-active')).toBe(true);
    (pills[0] as HTMLElement).focus();
    fireEvent.keyDown(pills[0]!, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(pills[1]);
    fireEvent.click(pills[1]!);
    expect(onSelect).toHaveBeenCalledWith('b');
  });
  it('renders nothing when empty', () => {
    const { container } = render(<CitationPills citations={[]} />);
    expect(container.firstChild).toBeNull();
  });
});

describe('SourceCardList', () => {
  it('keeps the Open link outside the row button', () => {
    const { container } = render(<SourceCardList sources={[{ id: 's1', title: 'T', excerpt: 'E', url: 'https://wiki.example/x', score: 0.9 }]} />);
    const link = container.querySelector('a')!;
    expect(link.closest('button')).toBeNull();
    expect(screen.getByText('wiki.example')).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Relevance 90 percent' })).toBeTruthy();
  });
  it('shows the empty text', () => {
    render(<SourceCardList sources={[]} emptyText="none" />);
    expect(screen.getByText('none')).toBeTruthy();
  });
});

describe('RetrievalInspector', () => {
  const chunks = [{ id: 'lo', title: 'Low', excerpt: 'x', score: 0.4 }, { id: 'hi', title: 'High', excerpt: 'y', score: 0.9, tokens: 1200 }];
  it('ranks, draws the threshold cut and toggles rows', () => {
    const { container } = render(<RetrievalInspector chunks={chunks} threshold={0.7} />);
    const rows = container.querySelectorAll('[data-chunk]');
    expect(rows[0]!.textContent).toContain('High');
    expect(rows[1]!.hasAttribute('data-below')).toBe(true);
    expect(screen.getByText('threshold 0.70')).toBeTruthy();
    const btn = rows[0]!.querySelector('[data-chunkbtn]')!;
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(btn);
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });
});

describe('GroundingBadge', () => {
  it('derives detail from cited/total', () => {
    render(<GroundingBadge verdict="partial" cited={3} total={5} />);
    expect(screen.getByRole('status').getAttribute('aria-label')).toBe('Partially grounded, 3 of 5 claims cited');
  });
});

describe('StreamingStageIndicator', () => {
  it('marks stages and hides when settled without doneLabel', () => {
    const { container, rerender } = render(<StreamingStageIndicator stage="reading" />);
    expect(screen.getByRole('status').getAttribute('aria-label')).toBe('Working: Reading…');
    rerender(<StreamingStageIndicator streaming={false} />);
    expect(container.firstChild).toBeNull();
    rerender(<StreamingStageIndicator streaming={false} doneLabel="Answered" />);
    expect(screen.getByText('Answered')).toBeTruthy();
  });
});

describe('ContextAttributionList', () => {
  it('sorts by tokens and escalates near the budget', () => {
    const { container } = render(<ContextAttributionList budget={10000} entries={[{ source: 'small', tokens: 1000 }, { source: 'big', tokens: 8000 }]} />);
    expect(container.querySelector('tbody tr')!.textContent).toContain('big');
    expect(container.querySelector('[data-attribution]')!.getAttribute('data-level')).toBe('warn');
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('9000');
  });
});

describe('AnswerFeedback', () => {
  it('submits reasons and correction once', () => {
    const onSubmit = vi.fn();
    render(<AnswerFeedback onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText('Not helpful'));
    fireEvent.click(screen.getByRole('checkbox', { name: /Stale source/ }));
    fireEvent.change(screen.getByPlaceholderText(/What should it have said/), { target: { value: ' fix ' } });
    fireEvent.click(screen.getByText(/Report · 1/));
    expect(onSubmit).toHaveBeenCalledWith({ rating: 'down', reasons: ['Stale source'], correction: 'fix' });
    expect(screen.getByRole('status').textContent).toContain('FEEDBACK_LOGGED');
  });
  it('toggles a rating off when clicked again', () => {
    render(<AnswerFeedback />);
    const up = screen.getByText('Helpful');
    fireEvent.click(up);
    expect(up.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(up);
    expect(up.getAttribute('aria-pressed')).toBe('false');
  });
});

describe('FollowUpChips', () => {
  it('picks and roves', () => {
    const onPick = vi.fn();
    const { container } = render(<FollowUpChips suggestions={['one', 'two']} onPick={onPick} />);
    const items = container.querySelectorAll('[data-followup]');
    (items[0] as HTMLElement).focus();
    fireEvent.keyDown(items[0]!, { key: 'End' });
    expect(document.activeElement).toBe(items[1]);
    fireEvent.click(items[1]!);
    expect(onPick).toHaveBeenCalledWith('two');
  });
});

describe('VariablePromptInput', () => {
  it('disables Run until every slot is filled', () => {
    const onRun = vi.fn();
    render(<VariablePromptInput id="p" template="Hi {{name}} from {{team}}" onRun={onRun} />);
    const run = screen.getByRole('button', { name: /Run/ }) as HTMLButtonElement;
    expect(run.disabled).toBe(true);
    fireEvent.change(screen.getByLabelText('Value for name'), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByLabelText('Value for team'), { target: { value: 'Ops' } });
    expect(run.disabled).toBe(false);
    fireEvent.click(run);
    expect(onRun).toHaveBeenCalledWith('Hi Ana from Ops', { name: 'Ana', team: 'Ops' });
  });
});
