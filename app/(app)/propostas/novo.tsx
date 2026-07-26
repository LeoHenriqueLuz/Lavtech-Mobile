import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/theme-provider';
import { useSession } from '@/hooks/use-session';
import { usePrecosVigentes } from '@/features/tabela-precos/hooks';
import { useCreateProposta } from '@/features/propostas/hooks';
import type { ItemPropostaParaCriar } from '@/features/propostas/api';
import {
  propostaFormDefaultValues,
  propostaFormSchema,
  type PropostaFormData,
} from '@/features/propostas/schema';
import type { AjusteValorFormData } from '@/schemas/ajuste-valor';
import { FormField } from '@/components/form-field';
import { Card } from '@/components/card';
import { AppButton } from '@/components/app-button';
import { Screen } from '@/components/screen';
import { EditarValorModal } from '@/components/editar-valor-modal';
import { TipoSelecaoRow } from '@/features/propostas/tipo-selecao-row';

interface ItemEstado {
  selecionado: boolean;
  quantidade: string;
  valorTabela: number;
  valorAplicado: number;
  ajusteManual: boolean;
  motivoAjuste: string | null;
}

export default function NovaPropostaScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { session } = useSession();

  const [itens, setItens] = useState<Record<string, ItemEstado>>({});
  const [editandoValorId, setEditandoValorId] = useState<string | null>(null);

  const { data: tiposComPreco, isLoading: carregandoTipos } = usePrecosVigentes();
  const createProposta = useCreateProposta();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PropostaFormData>({
    resolver: zodResolver(propostaFormSchema),
    defaultValues: propostaFormDefaultValues,
  });

  function handleToggle(tipoId: string) {
    setItens((prev) => {
      const atual = prev[tipoId];
      if (atual) {
        return { ...prev, [tipoId]: { ...atual, selecionado: !atual.selecionado } };
      }
      const tipo = tiposComPreco?.find((t) => t.id === tipoId);
      if (!tipo || !tipo.precoVigente) return prev;
      return {
        ...prev,
        [tipoId]: {
          selecionado: true,
          quantidade: '1',
          valorTabela: tipo.precoVigente.valor_unitario,
          valorAplicado: tipo.precoVigente.valor_unitario,
          ajusteManual: false,
          motivoAjuste: null,
        },
      };
    });
  }

  function handleChangeQuantidade(tipoId: string, value: string) {
    setItens((prev) =>
      prev[tipoId] ? { ...prev, [tipoId]: { ...prev[tipoId], quantidade: value } } : prev,
    );
  }

  function handleSalvarValor(data: AjusteValorFormData) {
    if (!editandoValorId) return;
    setItens((prev) => ({
      ...prev,
      [editandoValorId]: {
        ...prev[editandoValorId],
        valorAplicado: Number(data.novoValor.replace(',', '.')),
        ajusteManual: true,
        motivoAjuste: data.motivo,
      },
    }));
    setEditandoValorId(null);
  }

  async function handleSalvarProposta(form: PropostaFormData) {
    const itensSelecionados = Object.entries(itens).filter(([, item]) => item.selecionado);

    if (itensSelecionados.length === 0) {
      Alert.alert('Atenção', 'Selecione ao menos um tipo de persiana.');
      return;
    }

    if (!session?.user.id) {
      Alert.alert('Erro', 'Sessão inválida. Faça login novamente.');
      return;
    }

    const itensParaCriar: ItemPropostaParaCriar[] = itensSelecionados.map(([tipoId, item]) => ({
      tipoPersianaId: tipoId,
      quantidade: Number(item.quantidade) || 1,
      valorUnitarioTabela: item.valorTabela,
      valorUnitarioAplicado: item.valorAplicado,
      ajusteManual: item.ajusteManual,
      motivoAjuste: item.motivoAjuste,
    }));

    try {
      const proposta = await createProposta.mutateAsync({
        responsavelId: session.user.id,
        itens: itensParaCriar,
        form,
      });
      router.replace(`/propostas/${proposta.id}`);
    } catch {
      Alert.alert('Erro', 'Não foi possível criar a proposta.');
    }
  }

  const itemEditando = editandoValorId ? itens[editandoValorId] : null;

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.formScroll}>
        <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>Cliente</Text>
        <Card style={styles.form}>
          <FormField
            control={control}
            name="clienteNome"
            label="Nome (opcional)"
            error={errors.clienteNome?.message}
          />
          <FormField
            control={control}
            name="clienteWhatsapp"
            label="WhatsApp (opcional)"
            error={errors.clienteWhatsapp?.message}
            keyboardType="phone-pad"
          />
        </Card>

        <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>Itens</Text>

        {carregandoTipos ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : tiposComPreco && tiposComPreco.length > 0 ? (
          <View style={styles.itensList}>
            {tiposComPreco.map((tipo) => {
              const item = itens[tipo.id];
              return (
                <TipoSelecaoRow
                  key={tipo.id}
                  tipo={tipo}
                  selecionado={item?.selecionado ?? false}
                  quantidade={item?.quantidade ?? '1'}
                  valorAplicado={item?.valorAplicado ?? tipo.precoVigente?.valor_unitario ?? 0}
                  ajusteManual={item?.ajusteManual ?? false}
                  onToggleSelecionar={() => handleToggle(tipo.id)}
                  onChangeQuantidade={(value) => handleChangeQuantidade(tipo.id, value)}
                  onEditarValor={() => setEditandoValorId(tipo.id)}
                />
              );
            })}
          </View>
        ) : (
          <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
            Nenhum tipo de persiana com preço cadastrado.
          </Text>
        )}

        <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>
          Dados da Proposta
        </Text>
        <Card style={styles.form}>
          <FormField
            control={control}
            name="desconto"
            label="Desconto (R$)"
            error={errors.desconto?.message}
            keyboardType="numeric"
          />
          <FormField
            control={control}
            name="validadeDias"
            label="Validade (dias)"
            error={errors.validadeDias?.message}
            keyboardType="numeric"
          />
          <FormField
            control={control}
            name="observacoes"
            label="Observações"
            error={errors.observacoes?.message}
            multiline
          />
        </Card>

        <AppButton
          label={isSubmitting ? 'Salvando...' : 'Criar Proposta'}
          onPress={handleSubmit(handleSalvarProposta)}
          disabled={isSubmitting}
        />
      </ScrollView>

      {itemEditando ? (
        <EditarValorModal
          visible={Boolean(editandoValorId)}
          valorTabela={itemEditando.valorTabela}
          valorAtual={itemEditando.valorAplicado}
          motivoAtual={itemEditando.motivoAjuste}
          onSalvar={handleSalvarValor}
          onCancelar={() => setEditandoValorId(null)}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  itensList: {
    gap: 8,
  },
  form: {
    gap: 12,
  },
  formScroll: {
    padding: 20,
    gap: 16,
  },
});
