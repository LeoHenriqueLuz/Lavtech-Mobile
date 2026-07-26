import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/theme/theme-provider';
import { Card } from '@/components/card';
import { formatCurrency } from '@/utils/format-currency';
import type { ItemComTipo } from './api';

interface PropostaItemRowProps {
  item: ItemComTipo;
  onPress: () => void;
}

export function PropostaItemRow({ item, onPress }: PropostaItemRowProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={[theme.typography.body, { color: theme.colors.text }]}>
            {item.tipo?.nome ?? '—'}
          </Text>
          <Text style={[theme.typography.body, { color: theme.colors.text }]}>
            {formatCurrency(item.valor_unitario_aplicado)}
          </Text>
        </View>
        <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
          Quantidade: {item.quantidade}
        </Text>

        {item.ajuste_manual ? (
          <View style={styles.ajusteBox}>
            <Text style={[theme.typography.caption, { color: theme.colors.warning }]}>
              ⚠ Valor ajustado manualmente
            </Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
              Valor padrão: {formatCurrency(item.valor_unitario_tabela)}
            </Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
              Valor aplicado: {formatCurrency(item.valor_unitario_aplicado)}
            </Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
              Motivo: {item.motivo_ajuste}
            </Text>
          </View>
        ) : null}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ajusteBox: {
    marginTop: 4,
    gap: 2,
  },
});
