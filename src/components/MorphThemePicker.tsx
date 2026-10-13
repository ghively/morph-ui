import type { ChangeEvent } from 'react';
import { MORPH_THEMES, type MorphThemeName } from '../themes';
import './MorphThemePicker.css';

export interface MorphThemePickerProps {
  value: MorphThemeName;
  onChange: (theme: MorphThemeName) => void;
  label?: string;
  className?: string;
}

/** Controlled theme selector. Connect its value to MorphRoot's `theme` prop. */
export function MorphThemePicker({ value, onChange, label = 'Color theme', className = '' }: MorphThemePickerProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as MorphThemeName);
  };

  return (
    <label className={('morph-theme-picker ' + className).trim()}>
      <span>{label}</span>
      <select aria-label={label} value={value} onChange={handleChange}>
        {MORPH_THEMES.map((theme) => (
          <option key={theme.id} value={theme.id}>{theme.label}</option>
        ))}
      </select>
    </label>
  );
}
