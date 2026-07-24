import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { MotiView } from 'moti';
import { useTheme } from '@/theme/theme-provider';

interface ScreenProps {
  children: ReactNode;
  /** Aplica padding base ao conteúdo. Desative em telas com listas que precisam ir até a borda. */
  padded?: boolean;
}

export function Screen({ children, padded = true }: ScreenProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <MotiView
        style={[styles.container, padded && { padding: theme.spacing.md }]}
        from={{ opacity: 0, translateY: 12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 250 }}
      >
        {children}
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
