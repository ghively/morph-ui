import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchMorphInput } from '../src/components/SearchMorphInput';

describe('SearchMorphInput', () => {
  it('renders collapsed initially', () => {
    const { container } = render(<SearchMorphInput />);
    const wrapper = container.querySelector('.search-morph-wrapper');
    expect(wrapper?.getAttribute('data-expanded')).toBe('false');
  });

  it('expands on click and hides placeholder when typing', () => {
    const { container } = render(<SearchMorphInput />);
    
    const btn = screen.getByRole('button', { name: 'Open search' });
    fireEvent.click(btn);
    
    const wrapper = container.querySelector('.search-morph-wrapper');
    expect(wrapper?.getAttribute('data-expanded')).toBe('true');
    
    const input = screen.getByRole('textbox', { name: 'Search input' });
    fireEvent.change(input, { target: { value: 'test query' } });
    
    expect((input as HTMLInputElement).value).toBe('test query');
  });

  it('calls onSearch when Enter is pressed', () => {
    const onSearch = vi.fn();
    render(<SearchMorphInput onSearch={onSearch} />);
    
    const btn = screen.getByRole('button', { name: 'Open search' });
    fireEvent.click(btn);
    
    const input = screen.getByRole('textbox', { name: 'Search input' });
    fireEvent.change(input, { target: { value: 'test query' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(onSearch).toHaveBeenCalledWith('test query');
  });

  it('collapses on Escape if input is empty', () => {
    const { container } = render(<SearchMorphInput />);
    
    const btn = screen.getByRole('button', { name: 'Open search' });
    fireEvent.click(btn);
    
    const wrapper = container.querySelector('.search-morph-wrapper');
    expect(wrapper?.getAttribute('data-expanded')).toBe('true');
    
    const input = screen.getByRole('textbox', { name: 'Search input' });
    fireEvent.keyDown(input, { key: 'Escape' });
    
    expect(wrapper?.getAttribute('data-expanded')).toBe('false');
  });
});
