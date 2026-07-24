import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Tag } from 'lucide-react-native';
import { useTheme } from '@/theme/theme-provider';
import { usePrecosVigentes } from '@/features/tabela-precos/hooks';
import { formatCurrency } from '@/utils/format-currency';
import { Screen } from '@/components/screen';
import { Card } from '@/components/card';

export default function TabelaPrecosScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { data: tipos, isLoading, error } = usePrecosVigentes();

  return (
    <Screen>
      {error ? (
        <Text style={[theme.typography.body, styles.empty, { color: theme.colors.danger }]}>
          Não foi possível carregar a tabela de preços.
        </Text>
      ) : isLoading ? (
        <ActivityIndicator style={styles.loading} color={theme.colors.primary} />
      ) : (
        <FlatList
          data={tipos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/tabela-precos/${item.id}`)}>
              <Card style={styles.row}>
                <View
                  style={[
                    styles.icon,
                    { backgroundColor: `${theme.colors.primary}26`, borderRadius: theme.radii.full },
                  ]}
                >
                  <Tag color={theme.colors.primary} size={18} />
                </View>
                <Text style={[theme.typography.body, styles.name, { color: theme.colors.text }]}>
                  {item.nome}
                </Text>
                <Text
                  style={[
                    theme.typography.body,
                    { color: item.precoVigente ? theme.colors.text : theme.colors.textMuted },
                  ]}
                >
                  {item.precoVigente
                    ? formatCurrency(item.precoVigente.valor_unitario)
                    : 'Sem preço'}
                </Text>
              </Card>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={[theme.typography.body, styles.empty, { color: theme.colors.textMuted }]}>
              Nenhum tipo de persiana cadastrado
            </Text>
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    gap: 12,
    paddingBottom: 24,
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
  name: {
    flex: 1,
  },
  loading: {
    marginTop: 32,
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
  },
});
