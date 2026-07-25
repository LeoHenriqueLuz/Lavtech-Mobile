import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Building2, ChevronRight, Home, Layers } from 'lucide-react-native';
import { useTheme } from '@/theme/theme-provider';
import { Screen } from '@/components/screen';
import { Card } from '@/components/card';
import { AppButton } from '@/components/app-button';
import { supabase } from '@/lib/supabase';

const ITENS = [
  { href: '/configuracoes/empresa', label: 'Dados da Empresa', icon: Building2 },
  { href: '/configuracoes/ambientes', label: 'Ambientes', icon: Home },
  { href: '/configuracoes/tipos-persiana', label: 'Tipos de Persiana', icon: Layers },
] as const;

export default function ConfiguracoesScreen() {
  const theme = useTheme();
  const router = useRouter();

  function handleSignOut() {
    Alert.alert('Sair', 'Deseja encerrar sua sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          supabase.auth.signOut().catch(() => {
            Alert.alert('Erro', 'Não foi possível encerrar a sessão.');
          });
        },
      },
    ]);
  }

  return (
    <Screen>
      <View style={styles.list}>
        {ITENS.map((item) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity key={item.href} onPress={() => router.push(item.href)}>
              <Card style={styles.row}>
                <View
                  style={[
                    styles.icon,
                    {
                      backgroundColor: `${theme.colors.primary}26`,
                      borderRadius: theme.radii.full,
                    },
                  ]}
                >
                  <Icon color={theme.colors.primary} size={18} />
                </View>
                <Text style={[theme.typography.body, styles.label, { color: theme.colors.text }]}>
                  {item.label}
                </Text>
                <ChevronRight color={theme.colors.textMuted} size={18} />
              </Card>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footer}>
        <AppButton label="Sair" onPress={handleSignOut} variant="danger" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
  },
  footer: {
    marginTop: 24,
  },
});
