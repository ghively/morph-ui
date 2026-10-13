export const MORPH_THEMES = [
  { id: 'lively-sage', label: 'Lively Sage' },
  { id: 'jade-citrus', label: 'Jade + Citrus' },
  { id: 'genehively-terminal', label: 'GeneHively Terminal' },
] as const;

export type MorphThemeName = (typeof MORPH_THEMES)[number]['id'];
