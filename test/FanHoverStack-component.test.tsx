import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FanHoverStack } from '../src/components/FanHoverStack';

describe('FanHoverStack', () => {
  const items = [
    { id: 1, content: <span>Card 1</span> },
    { id: 2, content: <span>Card 2</span> },
    { id: 3, content: <span>Card 3</span> },
  ];

  it('renders correctly', () => {
    const { getByTestId, getByText } = render(<FanHoverStack items={items} />);
    expect(getByTestId('fan-hover-stack')).toBeTruthy();
    expect(getByText('Card 1')).toBeTruthy();
  });

  it('fans out on hover and lifts active item', () => {
    const { getByTestId } = render(<FanHoverStack items={items} />);
    const stack = getByTestId('fan-hover-stack');
    const card2 = getByTestId('fan-hover-stack-item-2');

    fireEvent.mouseEnter(card2);
    expect(stack.classList.contains('is-fanned')).toBe(true);
    expect(card2.classList.contains('is-active')).toBe(true);

    fireEvent.mouseLeave(stack);
    expect(stack.classList.contains('is-fanned')).toBe(false);
    expect(card2.classList.contains('is-active')).toBe(false);
  });

  it('handles keyboard focus', () => {
    const { getByTestId } = render(<FanHoverStack items={items} />);
    const stack = getByTestId('fan-hover-stack');
    const card1 = getByTestId('fan-hover-stack-item-1');

    fireEvent.focus(card1);
    expect(stack.classList.contains('is-fanned')).toBe(true);
    expect(card1.classList.contains('is-active')).toBe(true);

    fireEvent.blur(card1);
    expect(stack.classList.contains('is-fanned')).toBe(false);
  });
});
