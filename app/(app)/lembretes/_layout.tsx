import { Stack } from 'expo-router';
import { useTheme } from '@/theme/theme-provider';

export default function LembretesLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerTintColor: theme.colors.text,
        headerStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Lembretes' }} />
    </Stack>
  );
}
