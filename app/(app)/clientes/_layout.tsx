import { Stack } from 'expo-router';
import { useTheme } from '@/theme/theme-provider';

export default function ClientesLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerTintColor: theme.colors.text,
        headerStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Clientes' }} />
      <Stack.Screen name="novo" options={{ title: 'Novo Cliente' }} />
      <Stack.Screen name="[id]" options={{ title: 'Editar Cliente' }} />
    </Stack>
  );
}
