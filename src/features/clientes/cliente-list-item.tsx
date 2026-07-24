import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/theme/theme-provider';
import { Card } from '@/components/card';
import type { Cliente } from './api';

interface ClienteListItemProps {
  cliente: Cliente;
  onPress: () => void;
}

export function ClienteListItem({ cliente, onPress }: ClienteListItemProps) {
  const theme = useTheme();
  const inicial = cliente.nome.trim().charAt(0).toUpperCase() || '?';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: `${theme.colors.primary}26`, borderRadius: theme.radii.full },
          ]}
        >
          <Text style={[theme.typography.subtitle, { color: theme.colors.primary }]}>
            {inicial}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={[theme.typography.body, { color: theme.colors.text }]}>{cliente.nome}</Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
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
            <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
              Inativo
            </Text>
          </View>
        ) : null}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
