import { Stack } from 'expo-router';
import { useTheme } from '@/theme/theme-provider';

export default function TabelaPrecosLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerTintColor: theme.colors.text,
        headerStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Tabela de Preços' }} />
      <Stack.Screen name="[tipoId]" options={{ title: 'Histórico de Preço' }} />
    </Stack>
  );
}
