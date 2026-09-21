import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ApprovalGate } from '../src/components/ApprovalGate';

describe('ApprovalGate', () => {
  const defaultProps = {
    title: 'Deploy to Production',
    description: 'This action will deploy the current build.',
    riskLevel: 'high' as const,
    actionSummary: 'kubectl apply -f deployment.yaml',
  };

  it('renders correctly with high risk', () => {
    const { container } = render(<ApprovalGate {...defaultProps} onResolve={() => {}} />);
    expect(screen.getByText('Deploy to Production')).toBeTruthy();
    expect(screen.getByText('HIGH RISK')).toBeTruthy();
    expect(screen.getByText('kubectl apply -f deployment.yaml')).toBeTruthy();
    
    const gate = container.querySelector('[data-approval-gate]');
    expect(gate?.getAttribute('data-risk')).toBe('high');
  });

  it('shows comment field only for medium/high risk', () => {
    const { rerender } = render(<ApprovalGate {...defaultProps} riskLevel="low" onResolve={() => {}} />);
    expect(screen.queryByPlaceholderText('Optional comment...')).toBeNull();

    rerender(<ApprovalGate {...defaultProps} riskLevel="medium" onResolve={() => {}} />);
    expect(screen.getByPlaceholderText('Optional comment...')).toBeTruthy();
  });

  it('calls onResolve on approve/deny and locks further actions', () => {
    const onResolve = vi.fn();
    render(<ApprovalGate {...defaultProps} onResolve={onResolve} />);
    
    // Add comment
    const input = screen.getByPlaceholderText('Optional comment...');
    fireEvent.change(input, { target: { value: 'Looks good' } });

    // Approve
    const approveBtn = screen.getByText('Approve');
    fireEvent.click(approveBtn);

    expect(onResolve).toHaveBeenCalledWith(true, 'Looks good');
    
    // Check locked state
    expect(approveBtn.hasAttribute('disabled')).toBeTruthy();
    const denyBtn = screen.getByText('Deny');
    expect(denyBtn.hasAttribute('disabled')).toBeTruthy();
    
    // Ensure onResolve not called again
    fireEvent.click(denyBtn);
    expect(onResolve).toHaveBeenCalledTimes(1);
  });
});
