import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useTheme } from '@/theme/theme-provider';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useClientes } from '@/features/clientes/hooks';
import { ClienteListItem } from '@/features/clientes/cliente-list-item';
import { Screen } from '@/components/screen';
import { Card } from '@/components/card';

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
    <Screen>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/clientes/novo')} hitSlop={8}>
              <Plus color={theme.colors.primary} size={22} />
            </TouchableOpacity>
          ),
        }}
      />

      <Card style={styles.filters}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por nome, WhatsApp ou e-mail"
          placeholderTextColor={theme.colors.textMuted}
          style={[
            theme.typography.body,
            styles.search,
            {
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderRadius: theme.radii.md,
            },
          ]}
        />
        <View style={styles.switchRow}>
          <Text style={[theme.typography.body, { color: theme.colors.text }]}>
            Mostrar inativos
          </Text>
          <Switch
            value={includeInactive}
            onValueChange={setIncludeInactive}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          />
        </View>
      </Card>

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
          contentContainerStyle={styles.listContent}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListEmptyComponent={
            <Text style={[theme.typography.body, styles.empty, { color: theme.colors.textMuted }]}>
              Nenhum cliente encontrado
            </Text>
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: {
    gap: 12,
    marginBottom: 16,
  },
  search: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listContent: {
    gap: 12,
    paddingBottom: 24,
  },
  loading: {
    marginTop: 32,
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
  },
});
