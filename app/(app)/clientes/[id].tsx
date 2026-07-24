import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme/theme-provider';
import { ClienteForm } from '@/features/clientes/cliente-form';
import { clienteToFormData } from '@/features/clientes/api';
import type { ClienteFormData } from '@/features/clientes/schema';
import { useCliente, useSetClienteAtivo, useUpdateCliente } from '@/features/clientes/hooks';

export default function ClienteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { data: cliente, isLoading } = useCliente(id);
  const updateCliente = useUpdateCliente(id);
  const setAtivo = useSetClienteAtivo(id);

  async function handleSubmit(data: ClienteFormData) {
    try {
      await updateCliente.mutateAsync(data);
      Alert.alert('Sucesso', 'Cliente atualizado.');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    }
  }

  function handleToggleAtivo() {
    if (!cliente) return;
    const novoStatus = !cliente.ativo;
    Alert.alert(
      novoStatus ? 'Reativar cliente' : 'Desativar cliente',
      novoStatus
        ? 'O cliente voltará a aparecer nas buscas padrão.'
        : 'O cliente deixará de aparecer nas buscas padrão, mas o cadastro é mantido.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            setAtivo.mutateAsync(novoStatus).catch(() => {
              Alert.alert('Erro', 'Não foi possível atualizar o status do cliente.');
            });
          },
        },
      ],
    );
  }

  if (isLoading || !cliente) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: cliente.nome }} />
      <ClienteForm
        defaultValues={clienteToFormData(cliente)}
        onSubmit={handleSubmit}
        submitLabel="Salvar alterações"
      />
      <TouchableOpacity
        onPress={handleToggleAtivo}
        style={[
          styles.statusButton,
          { borderColor: cliente.ativo ? theme.colors.danger : theme.colors.success },
        ]}
      >
        <Text
          style={[
            theme.typography.body,
            { color: cliente.ativo ? theme.colors.danger : theme.colors.success },
          ]}
        >
          {cliente.ativo ? 'Desativar cliente' : 'Reativar cliente'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusButton: {
    margin: 16,
    marginTop: 0,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
});
