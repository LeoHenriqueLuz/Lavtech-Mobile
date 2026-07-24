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
import { Stack } from 'expo-router';
import { useTheme } from '@/theme/theme-provider';
import { useCatalogo, useCreateItemCatalogo, useSetItemCatalogoAtivo } from './hooks';
import type { CatalogoTabela } from './api';

interface CatalogoScreenProps {
  tabela: CatalogoTabela;
  titulo: string;
}

export function CatalogoScreen({ tabela, titulo }: CatalogoScreenProps) {
  const theme = useTheme();
  const [novoNome, setNovoNome] = useState('');
  const { data: itens, isLoading, error } = useCatalogo(tabela, true);
  const createItem = useCreateItemCatalogo(tabela);
  const setAtivo = useSetItemCatalogoAtivo(tabela);

  async function handleAdicionar() {
    const nome = novoNome.trim();
    if (!nome) return;
    await createItem.mutateAsync(nome);
    setNovoNome('');
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ title: titulo }} />
      <View style={styles.addRow}>
        <TextInput
          value={novoNome}
          onChangeText={setNovoNome}
          placeholder="Novo item"
          placeholderTextColor={theme.colors.textMuted}
          style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
        />
        <TouchableOpacity
          onPress={handleAdicionar}
          disabled={createItem.isPending}
          style={[
            styles.addButton,
            { backgroundColor: theme.colors.primary, opacity: createItem.isPending ? 0.6 : 1 },
          ]}
        >
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <Text style={[theme.typography.body, styles.empty, { color: theme.colors.danger }]}>
          Não foi possível carregar a lista.
        </Text>
      ) : isLoading ? (
        <ActivityIndicator style={styles.loading} color={theme.colors.primary} />
      ) : (
        <FlatList
          data={itens}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.row, { borderColor: theme.colors.border }]}>
              <Text
                style={[
                  theme.typography.body,
                  { color: item.ativo ? theme.colors.text : theme.colors.textMuted },
                ]}
              >
                {item.nome}
              </Text>
              <Switch
                value={item.ativo}
                onValueChange={(ativo) => setAtivo.mutate({ id: item.id, ativo })}
              />
            </View>
          )}
          ListEmptyComponent={
            <Text style={[theme.typography.body, styles.empty, { color: theme.colors.textMuted }]}>
              Nenhum item cadastrado
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
  addRow: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  addButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
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
