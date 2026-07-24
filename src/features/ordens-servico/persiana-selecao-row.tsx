import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/theme/theme-provider';
import { Card } from '@/components/card';
import { QuantityStepper } from '@/components/quantity-stepper';
import { formatCurrency } from '@/utils/format-currency';
import { formatAmbiente, type PersianaComNomes } from '@/features/persianas/api';

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
    <Card style={styles.container}>
      <View style={styles.header}>
        <Switch
          value={selecionada}
          onValueChange={onToggleSelecionar}
          disabled={semPreco}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
        />
        <View style={styles.info}>
          <Text style={[theme.typography.body, { color: theme.colors.text }]}>
            {formatAmbiente(persiana.ambiente?.nome, persiana.ambiente_outro_descricao)} ·{' '}
            {persiana.tipo?.nome ?? '—'}
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
            <QuantityStepper value={quantidade} onChange={onChangeQuantidade} />
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
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
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
    gap: 2,
  },
  valorButton: {
    alignItems: 'flex-end',
  },
});
