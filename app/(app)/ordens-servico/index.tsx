import { useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useTheme } from '@/theme/theme-provider';
import { useOrdensServico } from '@/features/ordens-servico/hooks';
import { sincronizarLembretesReinstalacao } from '@/features/ordens-servico/notifications';
import { StatusBadge } from '@/features/ordens-servico/status-badge';
import type { StatusOS } from '@/features/ordens-servico/status';
import { formatCurrency } from '@/utils/format-currency';
import { Screen } from '@/components/screen';
import { Card } from '@/components/card';

export default function OrdensServicoScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { data: ordens, isLoading, error } = useOrdensServico();

  useEffect(() => {
    if (ordens) {
      sincronizarLembretesReinstalacao(ordens);
    }
  }, [ordens]);

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/ordens-servico/novo')} hitSlop={8}>
              <Plus color={theme.colors.primary} size={22} />
            </TouchableOpacity>
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
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/ordens-servico/${item.id}`)}>
              <Card style={styles.row}>
                <View style={styles.info}>
                  <Text style={[theme.typography.body, { color: theme.colors.text }]}>
                    {item.numero}
                  </Text>
                  <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                    {item.cliente?.nome ?? 'Cliente removido'}
                  </Text>
                  <Text style={[theme.typography.body, { color: theme.colors.text }]}>
                    {formatCurrency(item.valor_final)}
                  </Text>
                </View>
                <StatusBadge status={item.status as StatusOS} />
              </Card>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={[theme.typography.body, styles.empty, { color: theme.colors.textMuted }]}>
              Nenhuma ordem de serviço cadastrada
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
