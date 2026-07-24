import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/theme/theme-provider';
import type { PersianaComNomes } from './api';

interface PersianaListItemProps {
  persiana: PersianaComNomes;
  onPress: () => void;
}

export function PersianaListItem({ persiana, onPress }: PersianaListItemProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, { borderColor: theme.colors.border }]}>
      <View style={styles.info}>
        <Text style={[theme.typography.body, { color: theme.colors.text }]}>
          {persiana.ambiente?.nome ?? '—'} · {persiana.tipo?.nome ?? '—'}
        </Text>
        <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
          Quantidade: {persiana.quantidade}
        </Text>
      </View>
      {!persiana.ativo ? (
        <View
          style={[
            styles.badge,
            { backgroundColor: theme.colors.surface, borderRadius: theme.radii.full },
          ]}
        >
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>Inativo</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  info: {
    gap: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
