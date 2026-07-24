import { Stack } from 'expo-router';
import { useTheme } from '@/theme/theme-provider';

export default function OrdensServicoLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerTintColor: theme.colors.text,
        headerStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Ordens de Serviço' }} />
      <Stack.Screen name="novo" options={{ title: 'Nova Ordem de Serviço' }} />
      <Stack.Screen name="[id]" options={{ title: 'Ordem de Serviço' }} />
    </Stack>
  );
}
