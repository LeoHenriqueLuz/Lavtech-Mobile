import { StyleSheet, Text, View } from 'react-native';
import { CheckCircle2, Clock, RefreshCw, XCircle } from 'lucide-react-native';
import { useTheme } from '@/theme/theme-provider';
import type { StatusOS } from './status';

interface StatusBadgeProps {
  status: StatusOS;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const theme = useTheme();

  const config = {
    'Retirada Agendada': { icon: Clock, color: theme.colors.warning },
    Agendado: { icon: RefreshCw, color: theme.colors.primary },
    Finalizado: { icon: CheckCircle2, color: theme.colors.success },
    Cancelado: { icon: XCircle, color: theme.colors.textMuted },
  }[status];

  const Icon = config.icon;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: `${config.color}1A`, borderRadius: theme.radii.full },
      ]}
    >
      <Icon color={config.color} size={12} />
      <Text style={[theme.typography.caption, styles.label, { color: config.color }]}>
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: '600',
  },
});
