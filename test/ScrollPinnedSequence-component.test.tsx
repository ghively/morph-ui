import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ScrollPinnedSequence } from '../src/components/ScrollPinnedSequence';

describe('ScrollPinnedSequence', () => {
  const steps = [
    { id: 's1', title: 'Step 1', content: <div>Content 1</div> },
    { id: 's2', title: 'Step 2', content: <div>Content 2</div> },
    { id: 's3', title: 'Step 3', content: <div>Content 3</div> }
  ];

  it('renders all steps and indicators', () => {
    const { getByText, container } = render(<ScrollPinnedSequence steps={steps} />);
    
    expect(getByText('Step 1')).toBeTruthy();
    expect(getByText('Step 2')).toBeTruthy();
    expect(getByText('Step 3')).toBeTruthy();

    const indicators = container.querySelectorAll('.scroll-pinned-sequence-indicator');
    expect(indicators.length).toBe(3);
  });

  it('initially sets first step as active', () => {
    const { container } = render(<ScrollPinnedSequence steps={steps} />);
    
    const indicators = container.querySelectorAll('.scroll-pinned-sequence-indicator');
    expect(indicators[0].getAttribute('data-active')).toBe('true');
    expect(indicators[1].getAttribute('data-active')).toBe('false');
  });

  it('updates active step on scroll event', () => {
    const { container } = render(<ScrollPinnedSequence steps={steps} />);
    
    // Mock getBoundingClientRect for container
    const seqContainer = container.querySelector('.scroll-pinned-sequence') as HTMLElement;
    Object.defineProperty(seqContainer, 'getBoundingClientRect', {
      value: () => ({ top: -1500, height: 3000 })
    });
    
    Object.defineProperty(window, 'innerHeight', { value: 1000 });

    // Trigger scroll
    fireEvent.scroll(window);

    const indicators = container.querySelectorAll('.scroll-pinned-sequence-indicator');
    // We expect it to have moved past the first step based on mock values
    expect(indicators[0].getAttribute('data-active')).toBe('false');
  });
});
