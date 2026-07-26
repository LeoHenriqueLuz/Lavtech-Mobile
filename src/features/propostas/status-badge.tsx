import { StyleSheet, Text, View } from 'react-native';
import { AlertCircle, CheckCircle2, FileEdit, Send, XCircle } from 'lucide-react-native';
import { useTheme } from '@/theme/theme-provider';
import { getStatusEfetivo, type StatusProposta } from './status';

interface PropostaStatusBadgeProps {
  proposta: { status: string; data_validade: string };
}

export function PropostaStatusBadge({ proposta }: PropostaStatusBadgeProps) {
  const theme = useTheme();
  const status = getStatusEfetivo(proposta);

  const config: Record<StatusProposta, { icon: typeof FileEdit; color: string }> = {
    Rascunho: { icon: FileEdit, color: theme.colors.textMuted },
    Enviada: { icon: Send, color: theme.colors.primary },
    Aceita: { icon: CheckCircle2, color: theme.colors.success },
    Recusada: { icon: XCircle, color: theme.colors.danger },
    Expirada: { icon: AlertCircle, color: theme.colors.warning },
  };

  const { icon: Icon, color } = config[status];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: `${color}1A`, borderRadius: theme.radii.full },
      ]}
    >
      <Icon color={color} size={12} />
      <Text style={[theme.typography.caption, styles.label, { color }]}>{status}</Text>
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
