import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmptyState } from '../src/components/EmptyState';

describe('EmptyState', () => {
  it('renders title inside [data-emptyeyebrow]', () => {
    const { container } = render(<EmptyState title="Nothing here" />);
    const eyebrow = container.querySelector('[data-emptyeyebrow]');
    expect(eyebrow).toBeTruthy();
    expect(eyebrow!.textContent).toBe('Nothing here');
  });

  it('no children -> body div absent', () => {
    const { container } = render(<EmptyState title="Empty" />);
    const bodyDiv = container.querySelector('[data-empty] > div:not([data-emptytile]):not([data-emptyeyebrow])');
    expect(bodyDiv).toBeNull();
  });

  it('children -> body div present', () => {
    const { container } = render(<EmptyState title="Empty">Body content</EmptyState>);
    const bodyDiv = container.querySelector('[data-empty] > div:not([data-emptytile]):not([data-emptyeyebrow])');
    expect(bodyDiv).toBeTruthy();
    expect(bodyDiv!.textContent).toBe('Body content');
  });

  it('framed -> [data-notconfigured] wrapper with exact attributes', () => {
    const { container, rerender } = render(<EmptyState title="Empty" framed />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.getAttribute('data-notconfigured')).toBe('');
    expect(wrapper.getAttribute('data-emptycard')).toBe('');
    expect(wrapper.getAttribute('data-pad')).toBe('roomy');
    
    rerender(<EmptyState title="Empty" />);
    const wrapperUnframed = container.firstChild as HTMLElement;
    expect(wrapperUnframed.getAttribute('data-notconfigured')).toBeNull();
  });

  it('live -> [data-emptydot] has data-live attribute', () => {
    const { container } = render(<EmptyState title="Loading" live />);
    const dot = container.querySelector('[data-emptydot]');
    expect(dot).toBeTruthy();
    expect(dot!.getAttribute('data-live')).toBe('');
  });

  it('icon supplied -> replaces [data-emptydot]', () => {
    const { container } = render(<EmptyState title="Empty" icon={<span data-my-icon="1" />} />);
    const tile = container.querySelector('[data-emptytile]');
    expect(tile!.querySelector('[data-emptydot]')).toBeNull();
    expect(tile!.querySelector('[data-my-icon]')).toBeTruthy();
  });

  it('action node renders as a sibling of the body', () => {
    const { container } = render(
      <EmptyState title="Empty" action={<button data-action-btn="1">Action</button>}>
        Body content
      </EmptyState>
    );
    const emptyContainer = container.querySelector('[data-empty]');
    const actionBtn = emptyContainer!.querySelector('[data-action-btn]');
    expect(actionBtn).toBeTruthy();
    expect(actionBtn!.parentElement).toBe(emptyContainer);
  });
});
