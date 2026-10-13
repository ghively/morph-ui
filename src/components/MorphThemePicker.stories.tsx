import { useState } from 'react';
import { MorphThemePicker } from './MorphThemePicker';
import type { MorphThemeName } from '../themes';

export default {
  title: 'MorphThemePicker',
  component: MorphThemePicker,
};

export const Default = () => {
  const [theme, setTheme] = useState<MorphThemeName>('lively-sage');
  return <MorphThemePicker value={theme} onChange={setTheme} />;
};
