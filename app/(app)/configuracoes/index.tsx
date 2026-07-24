import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Home, Layers } from 'lucide-react-native';
import { useTheme } from '@/theme/theme-provider';
import { Screen } from '@/components/screen';
import { Card } from '@/components/card';

const ITENS = [
  { href: '/configuracoes/ambientes', label: 'Ambientes', icon: Home },
  { href: '/configuracoes/tipos-persiana', label: 'Tipos de Persiana', icon: Layers },
] as const;

export default function ConfiguracoesScreen() {
  const theme = useTheme();
  const router = useRouter();

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
});
