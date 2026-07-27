import { useMemo } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/theme/theme-provider';
import { ClienteForm } from '@/features/clientes/cliente-form';
import { clienteToFormData } from '@/features/clientes/api';
import type { ClienteFormData } from '@/features/clientes/schema';
import { useCliente, useSetClienteAtivo, useUpdateCliente } from '@/features/clientes/hooks';
import { PersianasSection } from '@/features/persianas/persianas-section';
import { useProposta } from '@/features/propostas/hooks';
import { Screen } from '@/components/screen';
import { AppButton } from '@/components/app-button';

export default function ClienteDetailScreen() {
  const { id, propostaId } = useLocalSearchParams<{ id: string; propostaId?: string }>();
  const theme = useTheme();
  const router = useRouter();
  const { data: cliente, isLoading } = useCliente(id);
  const { data: propostaOrigem } = useProposta(propostaId ?? '');
  const updateCliente = useUpdateCliente(id);
  const setAtivo = useSetClienteAtivo(id);

  const pendentesDaProposta = useMemo(
    () =>
      propostaOrigem?.itens.map((item) => ({
        tipoId: item.tipo_persiana_id,
        tipoNome: item.tipo?.nome ?? 'Tipo',
        quantidade: item.quantidade,
      })),
    [propostaOrigem],
  );

  function handleContinuarParaOS() {
    if (!propostaId) return;
    router.replace({
      pathname: '/ordens-servico/novo',
      params: { propostaId, clienteId: id },
    });
  }

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
    <Screen padded={false}>
      <ScrollView>
        <Stack.Screen options={{ title: cliente.nome }} />
        <ClienteForm
          defaultValues={clienteToFormData(cliente)}
          onSubmit={handleSubmit}
          submitLabel="Salvar alterações"
        />
        <PersianasSection
          clienteId={id}
          pendentesDaProposta={pendentesDaProposta}
          propostaNumero={propostaOrigem?.numero}
          onTodasPendentesCadastradas={handleContinuarParaOS}
        />
        <View style={styles.footer}>
          <AppButton
            label={cliente.ativo ? 'Desativar cliente' : 'Reativar cliente'}
            onPress={handleToggleAtivo}
            variant={cliente.ativo ? 'danger' : 'secondary'}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
});
