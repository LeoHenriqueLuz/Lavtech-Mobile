import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/theme/theme-provider';
import type { Cliente } from './api';

interface ClienteListItemProps {
  cliente: Cliente;
  onPress: () => void;
}

export function ClienteListItem({ cliente, onPress }: ClienteListItemProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, { borderColor: theme.colors.border }]}
    >
      <View style={styles.info}>
        <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>{cliente.nome}</Text>
        <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
          {cliente.whatsapp}
        </Text>
      </View>
      {!cliente.ativo ? (
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  info: {
    gap: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
