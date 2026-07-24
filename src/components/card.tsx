import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/theme/theme-provider';

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  glass?: boolean;
}

export function Card({ children, style, glass = false }: CardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        theme.shadows.card,
        {
          backgroundColor: glass ? 'transparent' : theme.colors.surfaceElevated,
          borderColor: theme.colors.border,
          borderRadius: theme.radii.lg,
        },
      ]}
    >
      {glass ? (
        <BlurView
          intensity={40}
          tint="dark"
          style={[StyleSheet.absoluteFill, { borderRadius: theme.radii.lg }]}
        />
      ) : null}
      <View style={[{ padding: theme.spacing.sm }, style]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: 'hidden',
  },
});
