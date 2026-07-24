import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/theme-provider';
import { usePrecosVigentes } from '@/features/tabela-precos/hooks';
import { formatCurrency } from '@/utils/format-currency';

export default function TabelaPrecosScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { data: tipos, isLoading, error } = usePrecosVigentes();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
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
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/tabela-precos/${item.id}`)}
              style={[styles.row, { borderColor: theme.colors.border }]}
            >
              <Text style={[theme.typography.body, { color: theme.colors.text }]}>{item.nome}</Text>
              <Text
                style={[
                  theme.typography.body,
                  { color: item.precoVigente ? theme.colors.text : theme.colors.textMuted },
                ]}
              >
                {item.precoVigente
                  ? formatCurrency(item.precoVigente.valor_unitario)
                  : 'Sem preço definido'}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={[theme.typography.body, styles.empty, { color: theme.colors.textMuted }]}>
              Nenhum tipo de persiana cadastrado
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  loading: {
    marginTop: 32,
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
  },
});
