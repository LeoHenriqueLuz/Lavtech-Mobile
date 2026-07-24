import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme/theme-provider';
import { useCatalogoItem } from '@/features/catalogos/hooks';
import { useCreatePreco, useHistoricoPrecos, useSetPrecoAtivo } from '@/features/tabela-precos/hooks';
import { precoFormDefaultValues, type PrecoFormData } from '@/features/tabela-precos/schema';
import type { Preco } from '@/features/tabela-precos/api';
import { PrecoForm } from '@/features/tabela-precos/preco-form';
import { PrecoListItem } from '@/features/tabela-precos/preco-list-item';

export default function HistoricoPrecoScreen() {
  const { tipoId } = useLocalSearchParams<{ tipoId: string }>();
  const theme = useTheme();
  const [addingNew, setAddingNew] = useState(false);

  const { data: tipo } = useCatalogoItem('tipos_persiana', tipoId);
  const { data: historico, isLoading, error } = useHistoricoPrecos(tipoId);
  const createPreco = useCreatePreco(tipoId);
  const setAtivo = useSetPrecoAtivo(tipoId);

  async function handleCreate(data: PrecoFormData) {
    try {
      await createPreco.mutateAsync(data);
      setAddingNew(false);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o preço.');
    }
  }

  function handleToggleAtivo(preco: Preco) {
    const novoStatus = !preco.ativo;
    Alert.alert(
      novoStatus ? 'Reativar preço' : 'Desativar preço',
      novoStatus
        ? 'Este preço volta a poder ser considerado vigente.'
        : 'Este preço deixa de contar no cálculo do vigente, mas o histórico é mantido.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            setAtivo.mutateAsync({ id: preco.id, ativo: novoStatus }).catch(() => {
              Alert.alert('Erro', 'Não foi possível atualizar o status do preço.');
            });
          },
        },
      ],
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ title: tipo?.nome ?? 'Histórico de Preço' }} />

      <View style={styles.header}>
        <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>
          {tipo?.nome ?? ''}
        </Text>
        {!addingNew ? (
          <TouchableOpacity onPress={() => setAddingNew(true)}>
            <Text
              style={[theme.typography.body, { color: theme.colors.primary, fontWeight: '600' }]}
            >
              + Novo preço
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {addingNew ? (
        <View style={styles.formWrapper}>
          <PrecoForm
            defaultValues={precoFormDefaultValues}
            onSubmit={handleCreate}
            onCancel={() => setAddingNew(false)}
            submitLabel="Adicionar"
          />
        </View>
      ) : null}

      {error ? (
        <Text style={[theme.typography.body, styles.empty, { color: theme.colors.danger }]}>
          Não foi possível carregar o histórico de preços.
        </Text>
      ) : isLoading ? (
        <ActivityIndicator style={styles.loading} color={theme.colors.primary} />
      ) : historico && historico.length > 0 ? (
        <View style={styles.list}>
          {historico.map((preco) => (
            <View key={preco.id} style={styles.itemWrapper}>
              <PrecoListItem preco={preco} />
              <TouchableOpacity onPress={() => handleToggleAtivo(preco)} style={styles.statusLink}>
                <Text
                  style={[
                    theme.typography.caption,
                    { color: preco.ativo ? theme.colors.danger : theme.colors.success },
                  ]}
                >
                  {preco.ativo ? 'Desativar' : 'Reativar'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : !addingNew ? (
        <Text style={[theme.typography.body, styles.empty, { color: theme.colors.textMuted }]}>
          Nenhum preço cadastrado
        </Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  formWrapper: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  list: {
    paddingHorizontal: 16,
    gap: 12,
  },
  itemWrapper: {
    gap: 4,
  },
  statusLink: {
    alignSelf: 'flex-end',
  },
  loading: {
    marginTop: 32,
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
    paddingHorizontal: 16,
  },
});
