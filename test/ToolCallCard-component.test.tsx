import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ToolCallCard } from '../src/components/ToolCallCard';

describe('ToolCallCard', () => {
  const defaultProps = {
    toolName: 'fetchData',
    args: { query: 'test', limit: 10 },
    status: 'succeeded' as const,
    duration: 150,
  };

  it('renders basic info correctly', () => {
    const { container } = render(<ToolCallCard {...defaultProps} />);
    expect(screen.getByText('fetchData')).toBeTruthy();
    expect(screen.getByText('150ms')).toBeTruthy();
    
    const card = container.querySelector('[data-tool-call-card]');
    expect(card?.getAttribute('data-status')).toBe('succeeded');
  });

  it('renders argument chips', () => {
    render(<ToolCallCard {...defaultProps} />);
    expect(screen.getByText('test')).toBeTruthy();
    expect(screen.getByText('10')).toBeTruthy();
  });

  it('expands to show raw JSON on click', () => {
    render(<ToolCallCard {...defaultProps} />);
    
    // Initially hidden
    expect(screen.queryByText(/"query": "test"/)).toBeNull();
    
    // Click header
    const header = document.querySelector('[data-tool-call-header]');
    if (header) fireEvent.click(header);
    
    // Should be visible now
    expect(screen.getByText(/"query": "test"/)).toBeTruthy();
  });

  it('shows error excerpt when failed', () => {
    render(
      <ToolCallCard 
        toolName="badTool" 
        args={{}} 
        status="failed" 
        error="Network timeout after 30s" 
      />
    );
    expect(screen.getByText('Network timeout after 30s')).toBeTruthy();
  });
});
