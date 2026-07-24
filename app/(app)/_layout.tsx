import { Redirect, Tabs } from 'expo-router';
import { useSession } from '@/hooks/use-session';
import { useTheme } from '@/theme/theme-provider';

export default function AppLayout() {
  const { session, isLoading } = useSession();
  const theme = useTheme();

  if (isLoading) return null;
  if (!session) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        headerTintColor: theme.colors.text,
      }}
    >
      <Tabs.Screen name="clientes" options={{ title: 'Clientes', headerShown: false }} />
      <Tabs.Screen name="ordens-servico/index" options={{ title: 'Ordens de Serviço' }} />
      <Tabs.Screen name="tabela-precos/index" options={{ title: 'Tabela de Preços' }} />
      <Tabs.Screen name="configuracoes/index" options={{ title: 'Configurações' }} />
    </Tabs>
  );
}
