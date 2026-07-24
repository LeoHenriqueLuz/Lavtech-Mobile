import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/theme/theme-provider';
import { useCreatePersiana, usePersianas, useSetPersianaAtivo, useUpdatePersiana } from './hooks';
import { persianaFormDefaultValues, type PersianaFormData } from './schema';
import { persianaToFormData, type PersianaComNomes } from './api';
import { PersianaForm } from './persiana-form';
import { PersianaListItem } from './persiana-list-item';

interface PersianasSectionProps {
  clienteId: string;
}

export function PersianasSection({ clienteId }: PersianasSectionProps) {
  const theme = useTheme();
  const [addingNew, setAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: persianas, isLoading, error } = usePersianas(clienteId, true);
  const createPersiana = useCreatePersiana(clienteId);
  const updatePersiana = useUpdatePersiana(clienteId, editingId ?? '');
  const setAtivo = useSetPersianaAtivo(clienteId);

  async function handleCreate(data: PersianaFormData) {
    try {
      await createPersiana.mutateAsync(data);
      setAddingNew(false);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a persiana.');
    }
  }

  async function handleUpdate(data: PersianaFormData) {
    try {
      await updatePersiana.mutateAsync(data);
      setEditingId(null);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    }
  }

  function handleToggleAtivo(persiana: PersianaComNomes) {
    const novoStatus = !persiana.ativo;
    Alert.alert(
      novoStatus ? 'Reativar persiana' : 'Desativar persiana',
      novoStatus
        ? 'A persiana voltará a aparecer na lista padrão.'
        : 'A persiana deixará de aparecer na lista padrão, mas o cadastro é mantido.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            setAtivo.mutateAsync({ id: persiana.id, ativo: novoStatus }).catch(() => {
              Alert.alert('Erro', 'Não foi possível atualizar o status da persiana.');
            });
          },
        },
      ],
    );
  }

  const editingPersiana = persianas?.find((persiana) => persiana.id === editingId);

  return (
    <View style={[styles.container, { padding: theme.spacing.md, gap: theme.spacing.sm }]}>
      <View style={styles.header}>
        <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>Persianas</Text>
        {!addingNew && !editingId ? (
          <TouchableOpacity onPress={() => setAddingNew(true)}>
            <Text style={[theme.typography.body, { color: theme.colors.primary, fontWeight: '600' }]}>
              + Adicionar
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {addingNew ? (
        <PersianaForm
          defaultValues={persianaFormDefaultValues}
          onSubmit={handleCreate}
          onCancel={() => setAddingNew(false)}
          submitLabel="Adicionar"
        />
      ) : null}

      {error ? (
        <Text style={[theme.typography.body, { color: theme.colors.danger }]}>
          Não foi possível carregar as persianas.
        </Text>
      ) : isLoading ? (
        <ActivityIndicator color={theme.colors.primary} />
      ) : persianas && persianas.length > 0 ? (
        <View style={styles.list}>
          {persianas.map((persiana) =>
            editingId === persiana.id && editingPersiana ? (
              <PersianaForm
                key={persiana.id}
                defaultValues={persianaToFormData(editingPersiana)}
                onSubmit={handleUpdate}
                onCancel={() => setEditingId(null)}
                submitLabel="Salvar"
              />
            ) : (
              <View key={persiana.id} style={styles.itemWrapper}>
                <PersianaListItem persiana={persiana} onPress={() => setEditingId(persiana.id)} />
                <TouchableOpacity
                  onPress={() => handleToggleAtivo(persiana)}
                  style={styles.statusLink}
                >
                  <Text
                    style={[
                      theme.typography.caption,
                      { color: persiana.ativo ? theme.colors.danger : theme.colors.success },
                    ]}
                  >
                    {persiana.ativo ? 'Desativar' : 'Reativar'}
                  </Text>
                </TouchableOpacity>
              </View>
            ),
          )}
        </View>
      ) : !addingNew ? (
        <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
          Nenhuma persiana cadastrada
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  list: {
    gap: 8,
  },
  itemWrapper: {
    gap: 4,
  },
  statusLink: {
    alignSelf: 'flex-end',
  },
});
