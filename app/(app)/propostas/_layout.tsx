import { Stack } from 'expo-router';
import { useTheme } from '@/theme/theme-provider';

export default function PropostasLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerTintColor: theme.colors.text,
        headerStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Propostas' }} />
      <Stack.Screen name="novo" options={{ title: 'Nova Proposta' }} />
      <Stack.Screen name="[id]" options={{ title: 'Proposta' }} />
    </Stack>
  );
}
