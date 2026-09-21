import { render, fireEvent, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { MorphWizard } from '../src/components/MorphWizard';

beforeAll(() => {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('MorphWizard', () => {
  it('renders correctly and navigates steps', async () => {
    const steps = [
      { id: '1', title: 'Step 1', content: <div>Content 1</div> },
      { id: '2', title: 'Step 2', content: <div>Content 2</div> },
    ];
    const onComplete = vi.fn();
    
    render(<MorphWizard steps={steps} onComplete={onComplete} />);
    
    expect(screen.getByText('Step 1')).toBeTruthy();
    expect(screen.getByText('Content 1')).toBeTruthy();
    expect(screen.getByText('Next')).toBeTruthy();
    
    const backBtn = screen.getByText('Back') as HTMLButtonElement;
    expect(backBtn.disabled).toBe(true);

    const nextBtn = screen.getByText('Next');
    fireEvent.click(nextBtn);

    expect(screen.getByText('Step 2')).toBeTruthy();
    expect(screen.getByText('Content 2')).toBeTruthy();
    expect(screen.getByText('Complete')).toBeTruthy();

    const completeBtn = screen.getByText('Complete');
    fireEvent.click(completeBtn);
    expect(onComplete).toHaveBeenCalled();
  });

  it('handles validation', async () => {
    const mockValidate = vi.fn().mockResolvedValue(false);
    const steps = [
      { id: '1', title: 'Step 1', content: <div>Content 1</div>, onValidate: mockValidate },
      { id: '2', title: 'Step 2', content: <div>Content 2</div> },
    ];
    
    render(<MorphWizard steps={steps} />);
    
    const nextBtn = screen.getByText('Next');
    await act(async () => {
      fireEvent.click(nextBtn);
    });

    expect(mockValidate).toHaveBeenCalled();
    expect(screen.getByText('Validation failed')).toBeTruthy();
  });
});
