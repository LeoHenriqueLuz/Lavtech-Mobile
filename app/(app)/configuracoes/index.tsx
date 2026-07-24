import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/theme-provider';

const ITENS = [
  { href: '/configuracoes/ambientes', label: 'Ambientes' },
  { href: '/configuracoes/tipos-persiana', label: 'Tipos de Persiana' },
] as const;

export default function ConfiguracoesScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {ITENS.map((item) => (
        <TouchableOpacity
          key={item.href}
          onPress={() => router.push(item.href)}
          style={[styles.row, { borderColor: theme.colors.border }]}
        >
          <Text style={[theme.typography.body, { color: theme.colors.text }]}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
});
