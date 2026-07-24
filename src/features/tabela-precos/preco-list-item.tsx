import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/theme-provider';
import { Card } from '@/components/card';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import type { Preco } from './api';

interface PrecoListItemProps {
  preco: Preco;
}

export function PrecoListItem({ preco }: PrecoListItemProps) {
  const theme = useTheme();

  return (
    <Card style={styles.card}>
      <View style={styles.info}>
        <Text style={[theme.typography.body, { color: theme.colors.text }]}>
          {formatCurrency(preco.valor_unitario)}
          {preco.valor_manutencao > 0
            ? ` · manutenção ${formatCurrency(preco.valor_manutencao)}`
            : ''}
        </Text>
        <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
          Atualizado em {formatDate(preco.updated_at)}
        </Text>
      </View>
      {!preco.ativo ? (
        <View
          style={[
            styles.badge,
            { backgroundColor: theme.colors.surface, borderRadius: theme.radii.full },
          ]}
        >
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
            Inativo
          </Text>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    gap: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
