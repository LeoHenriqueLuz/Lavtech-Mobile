import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTheme } from '@/theme/theme-provider';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useClientes } from '@/features/clientes/hooks';
import { ClienteListItem } from '@/features/clientes/cliente-list-item';

export default function ClientesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [includeInactive, setIncludeInactive] = useState(false);
  const debouncedSearch = useDebouncedValue(search, 300);

  const {
    data: clientes,
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useClientes({ search: debouncedSearch, includeInactive });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Text
              onPress={() => router.push('/clientes/novo')}
              style={[styles.addButton, { color: theme.colors.primary }]}
            >
              + Novo
            </Text>
          ),
        }}
      />

      <View style={styles.filters}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por nome, WhatsApp ou e-mail"
          placeholderTextColor={theme.colors.textMuted}
          style={[styles.search, { borderColor: theme.colors.border, color: theme.colors.text }]}
        />
        <View style={styles.switchRow}>
          <Text style={[theme.typography.body, { color: theme.colors.text }]}>Mostrar inativos</Text>
          <Switch value={includeInactive} onValueChange={setIncludeInactive} />
        </View>
      </View>

      {error ? (
        <Text style={[theme.typography.body, styles.empty, { color: theme.colors.danger }]}>
          Não foi possível carregar os clientes.
        </Text>
      ) : isLoading ? (
        <ActivityIndicator style={styles.loading} color={theme.colors.primary} />
      ) : (
        <FlatList
          data={clientes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ClienteListItem cliente={item} onPress={() => router.push(`/clientes/${item.id}`)} />
          )}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListEmptyComponent={
            <Text style={[theme.typography.body, styles.empty, { color: theme.colors.textMuted }]}>
              Nenhum cliente encontrado
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
  filters: {
    padding: 16,
    gap: 12,
  },
  search: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
