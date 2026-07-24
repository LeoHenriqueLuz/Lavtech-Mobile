import { StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/theme/theme-provider';
import { formatCurrency } from '@/utils/format-currency';
import type { PersianaComNomes } from '@/features/persianas/api';

interface PersianaSelecaoRowProps {
  persiana: PersianaComNomes;
  precoVigente: number | null;
  selecionada: boolean;
  quantidade: string;
  valorAplicado: number;
  ajusteManual: boolean;
  onToggleSelecionar: () => void;
  onChangeQuantidade: (value: string) => void;
  onEditarValor: () => void;
}

export function PersianaSelecaoRow({
  persiana,
  precoVigente,
  selecionada,
  quantidade,
  valorAplicado,
  ajusteManual,
  onToggleSelecionar,
  onChangeQuantidade,
  onEditarValor,
}: PersianaSelecaoRowProps) {
  const theme = useTheme();
  const semPreco = precoVigente === null;

  return (
    <View style={[styles.container, { borderColor: theme.colors.border }]}>
      <View style={styles.header}>
        <Switch value={selecionada} onValueChange={onToggleSelecionar} disabled={semPreco} />
        <View style={styles.info}>
          <Text style={[theme.typography.body, { color: theme.colors.text }]}>
            {persiana.ambiente?.nome ?? '—'} · {persiana.tipo?.nome ?? '—'}
          </Text>
          {semPreco ? (
            <Text style={[theme.typography.caption, { color: theme.colors.danger }]}>
              Sem preço definido — cadastre em Tabela de Preços
            </Text>
          ) : null}
        </View>
      </View>

      {selecionada && !semPreco ? (
        <View style={styles.details}>
          <View style={styles.quantidadeField}>
            <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>Qtd.</Text>
            <TextInput
              value={quantidade}
              onChangeText={onChangeQuantidade}
              keyboardType="numeric"
              style={[
                styles.quantidadeInput,
                { borderColor: theme.colors.border, color: theme.colors.text },
              ]}
            />
          </View>
          <TouchableOpacity onPress={onEditarValor} style={styles.valorButton}>
            <Text style={[theme.typography.body, { color: theme.colors.text }]}>
              {formatCurrency(valorAplicado)}
            </Text>
            <Text style={[theme.typography.caption, { color: theme.colors.primary }]}>
              {ajusteManual ? '✎ Ajustado' : '✎ Editar valor'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 52,
  },
  quantidadeField: {
    width: 70,
    gap: 2,
  },
  quantidadeInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
  },
  valorButton: {
    alignItems: 'flex-end',
  },
});
