import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MorphRoot } from '../src/components/MorphRoot';
import { MorphThemePicker } from '../src/components/MorphThemePicker';

describe('MorphThemePicker', () => {
  it('changes the MorphRoot theme immediately when selected', () => {
    function ThemeableApp() {
      const [theme, setTheme] = useState<'lively-sage' | 'jade-citrus' | 'genehively-terminal'>('lively-sage');
      return (
        <MorphRoot data-testid="root" theme={theme}>
          <MorphThemePicker value={theme} onChange={setTheme} />
        </MorphRoot>
      );
    }
    render(<ThemeableApp />);
    fireEvent.change(screen.getByRole('combobox', { name: 'Color theme' }), { target: { value: 'genehively-terminal' } });
    expect(screen.getByTestId('root').getAttribute('data-theme')).toBe('genehively-terminal');
  });

  it('lists the three built-in themes and reports a selection', () => {
    const onChange = vi.fn();
    render(<MorphThemePicker value="lively-sage" onChange={onChange} />);
    const select = screen.getByRole('combobox', { name: 'Color theme' });
    expect(screen.getAllByRole('option')).toHaveLength(3);
    fireEvent.change(select, { target: { value: 'jade-citrus' } });
    expect(onChange).toHaveBeenCalledWith('jade-citrus');
  });
});
