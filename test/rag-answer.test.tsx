import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
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
  it('numbers by position and reports selection', () => {
    const onSelect = vi.fn();
    render(<CitationPills citations={[{ id: 'a' }, { id: 'b', index: 7 }]} activeId="b" onSelect={onSelect} />);
    expect(screen.getByRole('button', { name: 'Source 1' })).toBeTruthy();
    const seven = screen.getByRole('button', { name: 'Source 7' });
    expect(seven.hasAttribute('data-active')).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Source 1' }));
    expect(onSelect).toHaveBeenCalledWith('a');
  });

  it('renders nothing without citations', () => {
    const { container } = render(<CitationPills citations={[]} />);
    expect(container.querySelector('[data-citations]')).toBeNull();
  });
});

describe('SourceCardList', () => {
  const SOURCES = [
    { id: 's1', title: 'Policy', excerpt: 'Excerpt one', department: 'Support', score: 0.9 },
    { id: 's2', title: 'Review', excerpt: 'Excerpt two' },
  ];

  it('marks the active card and shows scores', () => {
    const onSelect = vi.fn();
    const { container } = render(<SourceCardList sources={SOURCES} activeId="s1" onSelect={onSelect} />);
    expect(container.querySelector('[data-sourcecard][data-active]')).toBeTruthy();
    expect(screen.getByText('90%')).toBeTruthy();
    fireEvent.click(screen.getByText('Review'));
    expect(onSelect).toHaveBeenCalledWith('s2');
  });

  it('empty state text', () => {
    render(<SourceCardList sources={[]} />);
    expect(screen.getByText('No sources retrieved.')).toBeTruthy();
  });
});

describe('RetrievalInspector', () => {
  it('sorts by score desc and flags below-threshold chunks', () => {
    const { container } = render(
      <RetrievalInspector
        threshold={0.7}
        chunks={[
          { id: 'low', title: 'Old note', excerpt: '…', score: 0.4 },
          { id: 'high', title: 'Policy', excerpt: '…', score: 0.9 },
        ]}
      />,
    );
    const titles = Array.from(container.querySelectorAll('[data-chunktitle]')).map((el) => el.textContent);
    expect(titles).toEqual(['Policy', 'Old note']);
    expect(container.querySelector('[data-chunk][data-below]')).toBeTruthy();
    expect(screen.getByText('below 0.70 threshold')).toBeTruthy();
  });
});

describe('GroundingBadge', () => {
  it('announces verdict via status role', () => {
    render(<GroundingBadge verdict="partial" detail="3 of 5 cited" />);
    const badge = screen.getByRole('status');
    expect(badge.textContent).toContain('Partially grounded');
    expect(badge.textContent).toContain('3 of 5 cited');
    expect(badge.getAttribute('data-verdict')).toBe('partial');
  });
});

describe('StreamingStageIndicator', () => {
  it('marks past/current/todo stages', () => {
    const { container } = render(<StreamingStageIndicator stage="reading" />);
    const stages = container.querySelectorAll('[data-stage]');
    expect(stages[0]?.getAttribute('data-state')).toBe('done');
    expect(stages[1]?.getAttribute('data-state')).toBe('active');
    expect(stages[2]?.getAttribute('data-state')).toBe('todo');
    expect(container.querySelector('[role="status"]')?.getAttribute('aria-label')).toContain('Reading');
  });

  it('renders nothing once settled', () => {
    const { container } = render(<StreamingStageIndicator streaming={false} />);
    expect(container.querySelector('[data-stages]')).toBeNull();
  });
});

describe('ContextAttributionList', () => {
  it('totals tokens and scales the budget bar', () => {
    render(<ContextAttributionList budget={100000} entries={[{ source: 'Tickets', tokens: 25000 }]} />);
    expect(screen.getByText(/25,000 tokens of 100,000/)).toBeTruthy();
    expect(screen.getByRole('progressbar', { name: 'Context window usage' }).getAttribute('aria-valuenow')).toBe('25000');
  });
});

describe('AnswerFeedback', () => {
  it('submits praise in one click path', () => {
    const onSubmit = vi.fn();
    render(<AnswerFeedback onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: 'Good answer' }));
    fireEvent.click(screen.getByRole('button', { name: 'Send praise' }));
    expect(onSubmit).toHaveBeenCalledWith({ rating: 'up', reasons: [], correction: '' });
    expect(screen.getByRole('status').textContent).toMatch(/improves future answers/);
  });

  it('collects reasons + correction on thumbs-down', () => {
    const onSubmit = vi.fn();
    render(<AnswerFeedback onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: 'Bad answer' }));
    fireEvent.click(screen.getByRole('button', { name: 'Stale source' }));
    fireEvent.change(screen.getByPlaceholderText('Optional correction…'), { target: { value: 'Use the March policy.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send report' }));
    expect(onSubmit).toHaveBeenCalledWith({
      rating: 'down',
      reasons: ['Stale source'],
      correction: 'Use the March policy.',
    });
  });
});

describe('FollowUpChips', () => {
  it('picks a suggestion', () => {
    const onPick = vi.fn();
    render(<FollowUpChips suggestions={['Break it down', 'Show tickets']} onPick={onPick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Show tickets' }));
    expect(onPick).toHaveBeenCalledWith('Show tickets');
  });
});

describe('VariablePromptInput', () => {
  it('derives fields from {{slots}} and previews the fill', () => {
    const onRun = vi.fn();
    function Controlled() {
      const [template, setTemplate] = useState('Summarize {{topic}} for {{audience}}.');
      return <VariablePromptInput id="vp" template={template} onTemplateChange={setTemplate} onRun={onRun} />;
    }
    const { container } = render(<Controlled />);
    fireEvent.change(screen.getByLabelText('Value for topic'), { target: { value: 'refunds' } });
    fireEvent.change(screen.getByLabelText('Value for audience'), { target: { value: 'support' } });
    expect(container.querySelector('[data-varpreview]')?.textContent).toBe('Summarize refunds for support.');
    fireEvent.click(screen.getByRole('button', { name: 'Run' }));
    expect(onRun).toHaveBeenCalledWith('Summarize refunds for support.', { topic: 'refunds', audience: 'support' });
  });
});
