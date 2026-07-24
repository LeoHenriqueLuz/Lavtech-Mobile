import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/theme/theme-provider';
import {
  useOrdemServico,
  useUpdateItemValor,
  useUpdateStatusOrdemServico,
} from '@/features/ordens-servico/hooks';
import { isStatusAberto, PROXIMO_STATUS, type StatusOS } from '@/features/ordens-servico/status';
import { ItemRow } from '@/features/ordens-servico/item-row';
import { EditarValorModal } from '@/features/ordens-servico/editar-valor-modal';
import type { AjusteValorFormData } from '@/features/ordens-servico/schema';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';

export default function OrdemServicoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const [editandoItemId, setEditandoItemId] = useState<string | null>(null);

  const { data: os, isLoading } = useOrdemServico(id);
  const updateStatus = useUpdateStatusOrdemServico(id);
  const updateItemValor = useUpdateItemValor(id);

  async function handleSalvarValor(data: AjusteValorFormData) {
    if (!editandoItemId) return;
    try {
      await updateItemValor.mutateAsync({ itemId: editandoItemId, form: data });
      setEditandoItemId(null);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o novo valor.');
    }
  }

  function handleAvancarStatus() {
    if (!os) return;
    const proximo = PROXIMO_STATUS[os.status as StatusOS];
    if (!proximo) return;
    Alert.alert('Avançar status', `Alterar status para "${proximo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        onPress: () => {
          updateStatus.mutateAsync(proximo).catch(() => {
            Alert.alert('Erro', 'Não foi possível atualizar o status.');
          });
        },
      },
    ]);
  }

  function handleCancelar() {
    Alert.alert(
      'Cancelar Ordem de Serviço',
      'Esta ação mantém o registro, apenas altera o status. Deseja continuar?',
      [
        { text: 'Voltar', style: 'cancel' },
        {
          text: 'Cancelar OS',
          style: 'destructive',
          onPress: () => {
            updateStatus.mutateAsync('Cancelado').catch(() => {
              Alert.alert('Erro', 'Não foi possível cancelar a ordem de serviço.');
            });
          },
        },
      ],
    );
  }

  if (isLoading || !os) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  const status = os.status as StatusOS;
  const proximoStatus = PROXIMO_STATUS[status];
  const itemEditando = os.itens.find((item) => item.id === editandoItemId);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ title: os.numero }} />

      <View style={styles.section}>
        <Text style={[theme.typography.title, { color: theme.colors.text }]}>{os.numero}</Text>
        <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
          {os.cliente?.nome ?? 'Cliente removido'}
        </Text>
        <Text style={[theme.typography.body, { color: theme.colors.text }]}>Status: {status}</Text>
        <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
          Abertura: {formatDate(os.data_abertura)}
          {os.data_previsao_entrega ? ` · Previsão: ${formatDate(os.data_previsao_entrega)}` : ''}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>Itens</Text>
        <View style={styles.itemsList}>
          {os.itens.map((item) => (
            <ItemRow key={item.id} item={item} onPress={() => setEditandoItemId(item.id)} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>Valores</Text>
        <Text style={[theme.typography.body, { color: theme.colors.text }]}>
          Total: {formatCurrency(os.valor_total)}
        </Text>
        <Text style={[theme.typography.body, { color: theme.colors.text }]}>
          Manutenção: {formatCurrency(os.valor_manutencao)}
        </Text>
        <Text style={[theme.typography.body, { color: theme.colors.text }]}>
          Desconto: {formatCurrency(os.valor_desconto)}
        </Text>
        <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>
          Valor final: {formatCurrency(os.valor_final)}
        </Text>
        {os.forma_pagamento ? (
          <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
            Forma de pagamento: {os.forma_pagamento}
          </Text>
        ) : null}
      </View>

      {os.observacoes ? (
        <View style={styles.section}>
          <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>Observações</Text>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
            {os.observacoes}
          </Text>
        </View>
      ) : null}

      {proximoStatus ? (
        <TouchableOpacity
          onPress={handleAvancarStatus}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
        >
          <Text style={styles.buttonText}>Avançar para &quot;{proximoStatus}&quot;</Text>
        </TouchableOpacity>
      ) : null}

      {isStatusAberto(status) ? (
        <TouchableOpacity
          onPress={handleCancelar}
          style={[styles.button, styles.cancelButton, { borderColor: theme.colors.danger }]}
        >
          <Text style={[theme.typography.body, { color: theme.colors.danger }]}>Cancelar OS</Text>
        </TouchableOpacity>
      ) : null}

      {itemEditando ? (
        <EditarValorModal
          visible={Boolean(editandoItemId)}
          valorTabela={itemEditando.valor_unitario_tabela}
          valorAtual={itemEditando.valor_unitario_aplicado}
          motivoAtual={itemEditando.motivo_ajuste}
          onSalvar={handleSalvarValor}
          onCancelar={() => setEditandoItemId(null)}
        />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 20,
    gap: 4,
  },
  itemsList: {
    gap: 8,
    marginTop: 8,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  cancelButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
