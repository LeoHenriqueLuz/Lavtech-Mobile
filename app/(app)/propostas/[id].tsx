import { useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useTheme } from '@/theme/theme-provider';
import {
  useDeleteProposta,
  useDuplicateProposta,
  useProposta,
  useUpdateItemValorProposta,
  useUpdateStatusProposta,
} from '@/features/propostas/hooks';
import { getStatusEfetivo } from '@/features/propostas/status';
import { PropostaItemRow } from '@/features/propostas/item-row';
import { PropostaStatusBadge } from '@/features/propostas/status-badge';
import { buildPropostaPdfHtml } from '@/features/propostas/pdf';
import type { AjusteValorFormData } from '@/schemas/ajuste-valor';
import { EditarValorModal } from '@/components/editar-valor-modal';
import { useConfiguracoesEmpresa } from '@/features/empresa/hooks';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import { Card } from '@/components/card';
import { AppButton } from '@/components/app-button';

export default function PropostaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const router = useRouter();
  const [editandoItemId, setEditandoItemId] = useState<string | null>(null);
  const [baixandoPdf, setBaixandoPdf] = useState(false);

  const { data: proposta, isLoading } = useProposta(id);
  const { data: empresa } = useConfiguracoesEmpresa();
  const updateStatus = useUpdateStatusProposta(id);
  const updateItemValor = useUpdateItemValorProposta(id);
  const duplicateProposta = useDuplicateProposta();
  const deleteProposta = useDeleteProposta();

  async function handleBaixarPdf() {
    if (!proposta || !empresa) return;
    setBaixandoPdf(true);
    try {
      const html = buildPropostaPdfHtml(proposta, empresa);
      if (Platform.OS === 'web') {
        const janela = window.open('', '_blank');
        if (!janela) throw new Error('Não foi possível abrir a janela de impressão.');
        janela.document.write(html);
        janela.document.close();
        janela.focus();
        janela.print();
      } else {
        const { uri } = await Print.printToFileAsync({ html });
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Proposta ${proposta.numero}`,
        });
      }
    } catch (error) {
      console.error('Falha ao gerar/compartilhar PDF da proposta:', error);
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

  function handleMudarStatus(novoStatus: 'Enviada' | 'Aceita' | 'Recusada') {
    Alert.alert('Alterar status', `Alterar status para "${novoStatus}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        onPress: () => {
          updateStatus.mutateAsync(novoStatus).catch(() => {
            Alert.alert('Erro', 'Não foi possível atualizar o status.');
          });
        },
      },
    ]);
  }

  function handleDuplicar() {
    if (!proposta) return;
    duplicateProposta.mutateAsync(proposta.id).then(
      (nova) => router.replace(`/propostas/${nova.id}`),
      () => Alert.alert('Erro', 'Não foi possível duplicar a proposta.'),
    );
  }

  function handleExcluir() {
    if (!proposta) return;
    Alert.alert('Excluir Proposta', 'Esta ação não pode ser desfeita. Deseja continuar?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          deleteProposta.mutateAsync(proposta.id).then(
            () => router.replace('/propostas'),
            () => Alert.alert('Erro', 'Não foi possível excluir a proposta.'),
          );
        },
      },
    ]);
  }

  if (isLoading || !proposta) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  const statusEfetivo = getStatusEfetivo(proposta);
  const itemEditando = proposta.itens.find((item) => item.id === editandoItemId);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ title: proposta.numero }} />

      <View style={styles.section}>
        <View style={styles.headerRow}>
          <Text style={[theme.typography.title, { color: theme.colors.text }]}>
            {proposta.numero}
          </Text>
          <PropostaStatusBadge proposta={proposta} />
        </View>
        <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
          {proposta.cliente_nome ?? 'Sem nome'}
          {proposta.cliente_whatsapp ? ` · ${proposta.cliente_whatsapp}` : ''}
        </Text>
        <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
          Emissão: {formatDate(proposta.created_at)} · Validade: {formatDate(proposta.data_validade)}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>Itens</Text>
        <View style={styles.itemsList}>
          {proposta.itens.map((item) => (
            <PropostaItemRow key={item.id} item={item} onPress={() => setEditandoItemId(item.id)} />
          ))}
        </View>
      </View>

      <Card style={styles.valuesCard}>
        <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>Valores</Text>
        <Text style={[theme.typography.body, { color: theme.colors.text }]}>
          Subtotal: {formatCurrency(proposta.valor_subtotal)}
        </Text>
        <Text style={[theme.typography.body, { color: theme.colors.text }]}>
          Desconto: {formatCurrency(proposta.valor_desconto)}
        </Text>
        <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>
          Valor final: {formatCurrency(proposta.valor_final)}
        </Text>
      </Card>

      {proposta.observacoes ? (
        <View style={styles.section}>
          <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>
            Observações
          </Text>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
            {proposta.observacoes}
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

        {statusEfetivo === 'Rascunho' ? (
          <AppButton label='Marcar como "Enviada"' onPress={() => handleMudarStatus('Enviada')} />
        ) : null}

        {statusEfetivo === 'Enviada' ? (
          <View style={styles.statusActionsRow}>
            <AppButton
              label="Aceita"
              onPress={() => handleMudarStatus('Aceita')}
              style={styles.flex}
            />
            <AppButton
              label="Recusada"
              onPress={() => handleMudarStatus('Recusada')}
              variant="danger"
              style={styles.flex}
            />
          </View>
        ) : null}

        <AppButton label="Duplicar Proposta" onPress={handleDuplicar} variant="secondary" />

        <AppButton label="Excluir Proposta" onPress={handleExcluir} variant="danger" />
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
  statusActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  flex: {
    flex: 1,
  },
});
