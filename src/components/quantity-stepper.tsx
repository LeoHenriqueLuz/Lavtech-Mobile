import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { useTheme } from '@/theme/theme-provider';

interface QuantityStepperProps {
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
}

export function QuantityStepper({ value, onChange, min = 1, max = 999 }: QuantityStepperProps) {
  const theme = useTheme();
  const numero = Number(value) || min;

  function handleDecrement() {
    onChange(String(Math.max(min, numero - 1)));
  }

  function handleIncrement() {
    onChange(String(Math.min(max, numero + 1)));
  }

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.md,
        },
      ]}
    >
      <Pressable
        onPress={handleDecrement}
        disabled={numero <= min}
        hitSlop={8}
        style={[styles.button, { opacity: numero <= min ? 0.4 : 1 }]}
      >
        <Minus color={theme.colors.text} size={16} />
      </Pressable>
      <Text style={[theme.typography.body, styles.value, { color: theme.colors.text }]}>
        {numero}
      </Text>
      <Pressable
        onPress={handleIncrement}
        disabled={numero >= max}
        hitSlop={8}
        style={[styles.button, { opacity: numero >= max ? 0.4 : 1 }]}
      >
        <Plus color={theme.colors.text} size={16} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  value: {
    minWidth: 28,
    textAlign: 'center',
  },
});
