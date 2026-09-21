import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SkeletonWrapper } from '../src/components/SkeletonWrapper';

describe('SkeletonWrapper', () => {
  it('renders children wrapped in skeleton by default', () => {
    const { container } = render(
      <SkeletonWrapper>
        <div data-testid="child">Loading...</div>
      </SkeletonWrapper>
    );
    const wrapper = container.querySelector('[data-skeleton-wrapper]');
    expect(wrapper).toBeTruthy();
    expect(wrapper?.getAttribute('aria-busy')).toBe('true');
    expect(container.querySelector('[data-testid="child"]')).toBeTruthy();
  });

  it('renders only children when isLoading is false', () => {
    const { container } = render(
      <SkeletonWrapper isLoading={false}>
        <div data-testid="child">Loaded content</div>
      </SkeletonWrapper>
    );
    const wrapper = container.querySelector('[data-skeleton-wrapper]');
    expect(wrapper).toBeNull();
    expect(container.querySelector('[data-testid="child"]')).toBeTruthy();
  });
});
