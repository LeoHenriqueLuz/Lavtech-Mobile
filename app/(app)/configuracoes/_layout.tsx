import { Stack } from 'expo-router';
import { useTheme } from '@/theme/theme-provider';

export default function ConfiguracoesLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerTintColor: theme.colors.text,
        headerStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Configurações' }} />
      <Stack.Screen name="ambientes" options={{ title: 'Ambientes' }} />
      <Stack.Screen name="tipos-persiana" options={{ title: 'Tipos de Persiana' }} />
    </Stack>
  );
}
