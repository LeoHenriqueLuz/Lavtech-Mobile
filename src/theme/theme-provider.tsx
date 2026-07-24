import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { defaultColors, radii, spacing, typography, type Colors } from './tokens';
import { cardShadow } from './shadows';

interface Theme {
  colors: Colors;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
  shadows: { card: typeof cardShadow };
}

const ThemeContext = createContext<Theme | null>(null);

interface ThemeProviderProps {
  /** Cor principal vinda de `configuracoes_empresa`; usa o padrão do app se ausente. */
  corPrincipal?: string;
  children: ReactNode;
}

export function ThemeProvider({ corPrincipal, children }: ThemeProviderProps) {
  const theme = useMemo<Theme>(
    () => ({
      colors: { ...defaultColors, primary: corPrincipal ?? defaultColors.primary },
      spacing,
      radii,
      typography,
      shadows: { card: cardShadow },
    }),
    [corPrincipal],
  );

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider.');
  }
  return theme;
}
