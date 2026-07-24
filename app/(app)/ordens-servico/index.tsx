import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTheme } from '@/theme/theme-provider';
import { useOrdensServico } from '@/features/ordens-servico/hooks';
import { formatCurrency } from '@/utils/format-currency';

export default function OrdensServicoScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { data: ordens, isLoading, error } = useOrdensServico();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Text
              onPress={() => router.push('/ordens-servico/novo')}
              style={[styles.addButton, { color: theme.colors.primary }]}
            >
              + Nova
            </Text>
          ),
        }}
      />

      {error ? (
        <Text style={[theme.typography.body, styles.empty, { color: theme.colors.danger }]}>
          Não foi possível carregar as ordens de serviço.
        </Text>
      ) : isLoading ? (
        <ActivityIndicator style={styles.loading} color={theme.colors.primary} />
      ) : (
        <FlatList
          data={ordens}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/ordens-servico/${item.id}`)}
              style={[styles.row, { borderColor: theme.colors.border }]}
            >
              <View>
                <Text style={[theme.typography.body, { color: theme.colors.text }]}>
                  {item.numero}
                </Text>
                <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                  {item.cliente?.nome ?? 'Cliente removido'} · {item.status}
                </Text>
              </View>
              <Text style={[theme.typography.body, { color: theme.colors.text }]}>
                {formatCurrency(item.valor_final)}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={[theme.typography.body, styles.empty, { color: theme.colors.textMuted }]}>
              Nenhuma ordem de serviço cadastrada
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
  addButton: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
  },
  loading: {
    marginTop: 32,
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
  },
});
