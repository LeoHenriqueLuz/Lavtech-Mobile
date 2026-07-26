import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useTheme } from '@/theme/theme-provider';
import { usePropostas } from '@/features/propostas/hooks';
import { PropostaStatusBadge } from '@/features/propostas/status-badge';
import { formatCurrency } from '@/utils/format-currency';
import { Screen } from '@/components/screen';
import { Card } from '@/components/card';

export default function PropostasScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { data: propostas, isLoading, error } = usePropostas();

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/propostas/novo')} hitSlop={8}>
              <Plus color={theme.colors.primary} size={22} />
            </TouchableOpacity>
          ),
        }}
      />

      {error ? (
        <Text style={[theme.typography.body, styles.empty, { color: theme.colors.danger }]}>
          Não foi possível carregar as propostas.
        </Text>
      ) : isLoading ? (
        <ActivityIndicator style={styles.loading} color={theme.colors.primary} />
      ) : (
        <FlatList
          data={propostas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/propostas/${item.id}`)}>
              <Card style={styles.row}>
                <View style={styles.info}>
                  <Text style={[theme.typography.body, { color: theme.colors.text }]}>
                    {item.numero}
                  </Text>
                  <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                    {item.cliente_nome ?? 'Sem nome'}
                  </Text>
                  <Text style={[theme.typography.body, { color: theme.colors.text }]}>
                    {formatCurrency(item.valor_final)}
                  </Text>
                </View>
                <PropostaStatusBadge proposta={item} />
              </Card>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={[theme.typography.body, styles.empty, { color: theme.colors.textMuted }]}>
              Nenhuma proposta cadastrada
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
    justifyContent: 'space-between',
    gap: 12,
  },
  info: {
    gap: 2,
  },
  loading: {
    marginTop: 32,
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
  },
});
