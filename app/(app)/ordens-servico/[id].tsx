import { useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useTheme } from '@/theme/theme-provider';
import {
  useOrdemServico,
  useUpdateItemValor,
  useUpdateStatusOrdemServico,
} from '@/features/ordens-servico/hooks';
import { isStatusAberto, PROXIMO_STATUS, type StatusOS } from '@/features/ordens-servico/status';
import { ItemRow } from '@/features/ordens-servico/item-row';
import { StatusBadge } from '@/features/ordens-servico/status-badge';
import { EditarValorModal } from '@/features/ordens-servico/editar-valor-modal';
import { buildOrdemServicoPdfHtml } from '@/features/ordens-servico/pdf';
import type { AjusteValorFormData } from '@/features/ordens-servico/schema';
import { useConfiguracoesEmpresa } from '@/features/empresa/hooks';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import { Card } from '@/components/card';
import { AppButton } from '@/components/app-button';

export default function OrdemServicoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const [editandoItemId, setEditandoItemId] = useState<string | null>(null);
  const [baixandoPdf, setBaixandoPdf] = useState(false);

  const { data: os, isLoading } = useOrdemServico(id);
  const { data: empresa } = useConfiguracoesEmpresa();
  const updateStatus = useUpdateStatusOrdemServico(id);
  const updateItemValor = useUpdateItemValor(id);

  async function handleBaixarPdf() {
    if (!os || !empresa) return;
    setBaixandoPdf(true);
    try {
      const html = buildOrdemServicoPdfHtml(os, empresa);
      if (Platform.OS === 'web') {
        await Print.printAsync({ html });
      } else {
        const { uri } = await Print.printToFileAsync({ html });
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `OS ${os.numero}`,
        });
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível gerar o PDF.');
    } finally {
      setBaixandoPdf(false);
    }
  }

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
        <View style={styles.headerRow}>
          <Text style={[theme.typography.title, { color: theme.colors.text }]}>{os.numero}</Text>
          <StatusBadge status={status} />
        </View>
        <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
          {os.cliente?.nome ?? 'Cliente removido'}
        </Text>
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

      <Card style={styles.valuesCard}>
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
      </Card>

      {os.observacoes ? (
        <View style={styles.section}>
          <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>
            Observações
          </Text>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
            {os.observacoes}
          </Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <AppButton
          label={baixandoPdf ? 'Gerando PDF...' : 'Baixar PDF'}
          onPress={handleBaixarPdf}
          variant="secondary"
          disabled={baixandoPdf || !empresa}
        />

        {proximoStatus ? (
          <AppButton
            label={`Avançar para "${proximoStatus}"`}
            onPress={handleAvancarStatus}
          />
        ) : null}

        {isStatusAberto(status) ? (
          <AppButton label="Cancelar OS" onPress={handleCancelar} variant="danger" />
        ) : null}
      </View>

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
    padding: 20,
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemsList: {
    gap: 8,
    marginTop: 8,
  },
  valuesCard: {
    gap: 4,
    marginBottom: 20,
  },
  actions: {
    gap: 12,
    marginBottom: 32,
  },
});
