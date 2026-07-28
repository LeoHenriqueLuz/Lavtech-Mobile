import { useEffect, useState } from 'react';
import { Redirect, Tabs } from 'expo-router';
import { ClipboardList, LayoutDashboard, Menu } from 'lucide-react-native';
import { useSession } from '@/hooks/use-session';
import { useTheme } from '@/theme/theme-provider';
import { configurarNotificacoes } from '@/lib/notifications';
import { MenuBottomSheet } from '@/components/menu-bottom-sheet';

export default function AppLayout() {
  const { session, isLoading } = useSession();
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    configurarNotificacoes();
  }, []);

  if (isLoading) return null;
  if (!session) return <Redirect href="/(auth)/login" />;

  return (
    <>
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
          name="ordens-servico"
          options={{
            title: 'Ordens',
            headerShown: false,
            tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            title: 'Menu',
            headerShown: false,
            tabBarIcon: ({ color, size }) => <Menu color={color} size={size} />,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setMenuVisible(true);
            },
          }}
        />
        <Tabs.Screen name="clientes" options={{ href: null, headerShown: false }} />
        <Tabs.Screen name="propostas" options={{ href: null, headerShown: false }} />
        <Tabs.Screen name="lembretes" options={{ href: null, headerShown: false }} />
        <Tabs.Screen name="tabela-precos" options={{ href: null, headerShown: false }} />
        <Tabs.Screen name="configuracoes" options={{ href: null, headerShown: false }} />
      </Tabs>
      <MenuBottomSheet visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </>
  );
}
