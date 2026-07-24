import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Switch, Text, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '@/theme/theme-provider';
import { Card } from '@/components/card';
import { AppButton } from '@/components/app-button';
import { Screen } from '@/components/screen';
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
    <Screen>
      <Stack.Screen options={{ title: titulo }} />
      <Card style={styles.addRow}>
        <TextInput
          value={novoNome}
          onChangeText={setNovoNome}
          placeholder="Novo item"
          placeholderTextColor={theme.colors.textMuted}
          style={[
            theme.typography.body,
            styles.input,
            {
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderRadius: theme.radii.md,
            },
          ]}
        />
        <AppButton
          label="Adicionar"
          onPress={handleAdicionar}
          disabled={createItem.isPending}
          style={styles.addButton}
        />
      </Card>

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
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Card style={styles.row}>
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
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              />
            </Card>
          )}
          ListEmptyComponent={
            <Text style={[theme.typography.body, styles.empty, { color: theme.colors.textMuted }]}>
              Nenhum item cadastrado
            </Text>
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  addRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  addButton: {
    paddingHorizontal: 20,
  },
  listContent: {
    gap: 12,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loading: {
    marginTop: 32,
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
  },
});
