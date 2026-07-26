import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Calendar } from 'lucide-react-native';
import { useTheme } from '@/theme/theme-provider';
import { maskDataBr } from '@/utils/format-date';
import { CalendarPickerModal } from '@/components/calendar-picker-modal';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useSession } from '@/hooks/use-session';
import { useClientes } from '@/features/clientes/hooks';
import type { Cliente } from '@/features/clientes/api';
import { usePersianas } from '@/features/persianas/hooks';
import { usePrecosVigentes } from '@/features/tabela-precos/hooks';
import { useCreateOrdemServico, useOrdemAbertaDoCliente } from '@/features/ordens-servico/hooks';
import type { ItemParaCriar } from '@/features/ordens-servico/api';
import {
  ordemServicoFormDefaultValues,
  ordemServicoFormSchema,
  type AjusteValorFormData,
  type OrdemServicoFormData,
} from '@/features/ordens-servico/schema';
import { FormField } from '@/components/form-field';
import { Card } from '@/components/card';
import { AppButton } from '@/components/app-button';
import { Screen } from '@/components/screen';
import { PersianaSelecaoRow } from '@/features/ordens-servico/persiana-selecao-row';
import { EditarValorModal } from '@/features/ordens-servico/editar-valor-modal';

interface ItemEstado {
  selecionada: boolean;
  quantidade: string;
  valorTabela: number;
  valorAplicado: number;
  valorManutencao: number;
  ajusteManual: boolean;
  motivoAjuste: string | null;
}

export default function NovaOrdemServicoScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { session } = useSession();

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [buscaCliente, setBuscaCliente] = useState('');
  const buscaClienteDebounced = useDebouncedValue(buscaCliente, 300);
  const [itens, setItens] = useState<Record<string, ItemEstado>>({});
  const [editandoValorId, setEditandoValorId] = useState<string | null>(null);
  const [calendarioVisivel, setCalendarioVisivel] = useState(false);

  const { data: clientesEncontrados, isLoading: carregandoClientes } = useClientes({
    search: buscaClienteDebounced,
  });
  const { data: ordemAberta, isLoading: verificandoOrdemAberta } = useOrdemAbertaDoCliente(
    cliente?.id ?? '',
  );
  const { data: persianas, isLoading: carregandoPersianas } = usePersianas(cliente?.id ?? '');
  const { data: tiposComPreco } = usePrecosVigentes();
  const createOrdemServico = useCreateOrdemServico();

  const precoPorTipoId = useMemo(() => {
    const mapa = new Map<string, { valor_unitario: number; valor_manutencao: number } | null>();
    tiposComPreco?.forEach((tipo) => {
      mapa.set(tipo.id, tipo.precoVigente);
    });
    return mapa;
  }, [tiposComPreco]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OrdemServicoFormData>({
    resolver: zodResolver(ordemServicoFormSchema),
    defaultValues: ordemServicoFormDefaultValues,
  });

  const dataPrevisaoEntrega = watch('dataPrevisaoEntrega');

  function handleSelecionarDataPrevisao(dataBr: string) {
    setValue('dataPrevisaoEntrega', dataBr, { shouldValidate: true });
    setCalendarioVisivel(false);
  }

  function handleLimparDataPrevisao() {
    setValue('dataPrevisaoEntrega', '', { shouldValidate: true });
    setCalendarioVisivel(false);
  }

  function handleToggle(persianaId: string) {
    setItens((prev) => {
      const atual = prev[persianaId];
      if (atual) {
        return { ...prev, [persianaId]: { ...atual, selecionada: !atual.selecionada } };
      }
      const persiana = persianas?.find((p) => p.id === persianaId);
      const precoVigente = persiana ? precoPorTipoId.get(persiana.tipo_id) : null;
      if (!persiana || !precoVigente) return prev;
      return {
        ...prev,
        [persianaId]: {
          selecionada: true,
          quantidade: String(persiana.quantidade),
          valorTabela: precoVigente.valor_unitario,
          valorAplicado: precoVigente.valor_unitario,
          valorManutencao: precoVigente.valor_manutencao,
          ajusteManual: false,
          motivoAjuste: null,
        },
      };
    });
  }

  function handleChangeQuantidade(persianaId: string, value: string) {
    setItens((prev) =>
      prev[persianaId]
        ? { ...prev, [persianaId]: { ...prev[persianaId], quantidade: value } }
        : prev,
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

  async function handleSalvarOrdemServico(form: OrdemServicoFormData) {
    if (!cliente) return;
    const itensSelecionados = Object.entries(itens).filter(([, item]) => item.selecionada);

    if (itensSelecionados.length === 0) {
      Alert.alert('Atenção', 'Selecione ao menos uma persiana.');
      return;
    }

    if (!session?.user.id) {
      Alert.alert('Erro', 'Sessão inválida. Faça login novamente.');
      return;
    }

    const itensParaCriar: ItemParaCriar[] = itensSelecionados.map(([persianaId, item]) => ({
      persianaId,
      quantidade: Number(item.quantidade) || 1,
      valorUnitarioTabela: item.valorTabela,
      valorUnitarioAplicado: item.valorAplicado,
      valorManutencaoAplicado: item.valorManutencao,
      ajusteManual: item.ajusteManual,
      motivoAjuste: item.motivoAjuste,
    }));

    try {
      const ordemServico = await createOrdemServico.mutateAsync({
        clienteId: cliente.id,
        responsavelId: session.user.id,
        itens: itensParaCriar,
        form,
      });
      router.replace(`/ordens-servico/${ordemServico.id}`);
    } catch {
      Alert.alert('Erro', 'Não foi possível criar a ordem de serviço.');
    }
  }

  const itemEditando = editandoValorId ? itens[editandoValorId] : null;

  if (!cliente) {
    return (
      <Screen>
        <TextInput
          value={buscaCliente}
          onChangeText={setBuscaCliente}
          placeholder="Buscar cliente por nome, WhatsApp ou e-mail"
          placeholderTextColor={theme.colors.textMuted}
          style={[
            theme.typography.body,
            styles.search,
            {
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderRadius: theme.radii.md,
            },
          ]}
        />
        {carregandoClientes ? (
          <ActivityIndicator style={styles.loading} color={theme.colors.primary} />
        ) : (
          <ScrollView contentContainerStyle={styles.clienteList}>
            {clientesEncontrados?.map((c) => (
              <TouchableOpacity key={c.id} onPress={() => setCliente(c)}>
                <Card>
                  <Text style={[theme.typography.body, { color: theme.colors.text }]}>
                    {c.nome}
                  </Text>
                  <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                    {c.whatsapp}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </Screen>
    );
  }

  if (verificandoOrdemAberta) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  if (ordemAberta) {
    return (
      <Screen>
        <View style={styles.avisoContainer}>
          <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>
            {cliente.nome} já possui uma ordem de serviço em aberto
          </Text>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
            Finalize ou cancele a {ordemAberta.numero} antes de criar uma nova para este cliente.
          </Text>
          <AppButton
            label={`Abrir ${ordemAberta.numero}`}
            onPress={() => router.push(`/ordens-servico/${ordemAberta.id}`)}
          />
          <TouchableOpacity onPress={() => setCliente(null)}>
            <Text style={[theme.typography.body, { color: theme.colors.primary }]}>
              Trocar cliente
            </Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.formScroll}>
        <View style={styles.clienteSelecionado}>
          <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>
            {cliente.nome}
          </Text>
          <TouchableOpacity onPress={() => setCliente(null)}>
            <Text style={[theme.typography.caption, { color: theme.colors.primary }]}>Trocar</Text>
          </TouchableOpacity>
        </View>

        <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>Persianas</Text>

        {carregandoPersianas ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : persianas && persianas.length > 0 ? (
          <View style={styles.persianasList}>
            {persianas.map((persiana) => {
              const item = itens[persiana.id];
              const precoVigente = precoPorTipoId.get(persiana.tipo_id) ?? null;
              return (
                <PersianaSelecaoRow
                  key={persiana.id}
                  persiana={persiana}
                  precoVigente={precoVigente ? precoVigente.valor_unitario : null}
                  selecionada={item?.selecionada ?? false}
                  quantidade={item?.quantidade ?? String(persiana.quantidade)}
                  valorAplicado={item?.valorAplicado ?? precoVigente?.valor_unitario ?? 0}
                  ajusteManual={item?.ajusteManual ?? false}
                  onToggleSelecionar={() => handleToggle(persiana.id)}
                  onChangeQuantidade={(value) => handleChangeQuantidade(persiana.id, value)}
                  onEditarValor={() => setEditandoValorId(persiana.id)}
                />
              );
            })}
          </View>
        ) : (
          <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
            Este cliente não possui persianas ativas cadastradas.
          </Text>
        )}

        <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>Dados da OS</Text>
        <Card style={styles.form}>
          <FormField
            control={control}
            name="formaPagamento"
            label="Forma de pagamento"
            error={errors.formaPagamento?.message}
          />
          <FormField
            control={control}
            name="desconto"
            label="Desconto (R$)"
            error={errors.desconto?.message}
            keyboardType="numeric"
          />
          <FormField
            control={control}
            name="dataPrevisaoEntrega"
            label="Previsão de entrega (dd/mm/aaaa)"
            error={errors.dataPrevisaoEntrega?.message}
            keyboardType="numeric"
            formatValue={maskDataBr}
            maxLength={10}
            rightAccessory={
              <Pressable
                onPress={() => setCalendarioVisivel(true)}
                hitSlop={8}
                style={[
                  styles.calendarioButton,
                  {
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.surface,
                    borderRadius: theme.radii.md,
                  },
                ]}
              >
                <Calendar color={theme.colors.textMuted} size={20} />
              </Pressable>
            }
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
          label={isSubmitting ? 'Salvando...' : 'Criar Ordem de Serviço'}
          onPress={handleSubmit(handleSalvarOrdemServico)}
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

      <CalendarPickerModal
        visible={calendarioVisivel}
        value={dataPrevisaoEntrega}
        onSelect={handleSelecionarDataPrevisao}
        onClear={dataPrevisaoEntrega ? handleLimparDataPrevisao : undefined}
        onClose={() => setCalendarioVisivel(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  loading: {
    marginTop: 32,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clienteList: {
    gap: 12,
  },
  avisoContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 12,
  },
  clienteSelecionado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  persianasList: {
    gap: 8,
  },
  form: {
    gap: 12,
  },
  formScroll: {
    padding: 20,
    gap: 16,
  },
  calendarioButton: {
    borderWidth: 1,
    padding: 10,
  },
});
