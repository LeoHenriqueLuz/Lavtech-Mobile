import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme/theme-provider';

type AppButtonVariant = 'primary' | 'secondary' | 'danger';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: AppButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  disabled,
  style,
}: AppButtonProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePressIn() {
    // eslint-disable-next-line react-hooks/immutability -- mutar `.value` é a API do Reanimated
    scale.value = withTiming(0.97, { duration: 100 });
  }

  function handlePressOut() {
    // eslint-disable-next-line react-hooks/immutability -- mutar `.value` é a API do Reanimated
    scale.value = withTiming(1, { duration: 100 });
  }

  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress();
  }

  const backgroundColor =
    variant === 'primary'
      ? theme.colors.primary
      : variant === 'danger'
        ? theme.colors.danger
        : theme.colors.surfaceElevated;
  const textColor = variant === 'secondary' ? theme.colors.text : '#FFFFFF';

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.button,
        animatedStyle,
        {
          backgroundColor,
          borderColor: variant === 'secondary' ? theme.colors.border : 'transparent',
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderRadius: theme.radii.md,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <Text style={[theme.typography.body, styles.label, { color: textColor }]}>{label}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '600',
  },
});
