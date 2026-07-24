export const spacing = {
  xs: 8,
  sm: 12,
  md: 20,
  lg: 32,
  xl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
} as const;

export const typography = {
  title: { fontSize: 24, fontWeight: '600' as const, fontFamily: 'Inter_600SemiBold' },
  subtitle: { fontSize: 18, fontWeight: '600' as const, fontFamily: 'Inter_600SemiBold' },
  body: { fontSize: 15, fontWeight: '400' as const, fontFamily: 'Inter_400Regular' },
  caption: { fontSize: 13, fontWeight: '400' as const, fontFamily: 'Inter_400Regular' },
};

export interface Colors {
  primary: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
}

export const defaultColors: Colors = {
  primary: '#6366F1',
  background: '#0A0A0A',
  surface: '#111111',
  surfaceElevated: '#171717',
  text: '#FFFFFF',
  textMuted: '#A1A1AA',
  border: '#262626',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
};
