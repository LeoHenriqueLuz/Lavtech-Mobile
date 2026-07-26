import { useEffect } from 'react';
import { Redirect, Tabs } from 'expo-router';
import { ClipboardList, FileText, LayoutDashboard, Settings, Tag, Users } from 'lucide-react-native';
import { useSession } from '@/hooks/use-session';
import { useTheme } from '@/theme/theme-provider';
import { configurarNotificacoes } from '@/lib/notifications';

export default function AppLayout() {
  const { session, isLoading } = useSession();
  const theme = useTheme();

  useEffect(() => {
    configurarNotificacoes();
  }, []);

  if (isLoading) return null;
  if (!session) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        headerTintColor: theme.colors.text,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Início',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="clientes"
        options={{
          title: 'Clientes',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="ordens-servico"
        options={{
          title: 'Ordens de Serviço',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="propostas"
        options={{
          title: 'Propostas',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <FileText color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="tabela-precos"
        options={{
          title: 'Tabela de Preços',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Tag color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="configuracoes"
        options={{
          title: 'Configurações',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
