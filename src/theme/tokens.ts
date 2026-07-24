export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radii = {
  sm: 4,
  md: 8,
  lg: 16,
  full: 999,
} as const;

export const typography = {
  title: { fontSize: 20, fontWeight: '700' as const },
  subtitle: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
};

export interface Colors {
  primary: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
}

export const defaultColors: Colors = {
  primary: '#1E90FF',
  background: '#FFFFFF',
  surface: '#F5F6F8',
  text: '#1A1A1A',
  textMuted: '#6B7280',
  border: '#E2E4E9',
  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',
};
