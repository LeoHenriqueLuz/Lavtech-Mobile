import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, ClipboardList, FileText, UserPlus } from 'lucide-react-native';
import { Screen } from '@/components/screen';
import { Card } from '@/components/card';
import { useTheme } from '@/theme/theme-provider';
import { useDashboardMetrics, useOrdensEmAberto } from '@/features/dashboard/hooks';
import { useLembretesCount } from '@/features/lembretes/hooks';
import { StatusBadge } from '@/features/ordens-servico/status-badge';
import type { StatusOS } from '@/features/ordens-servico/status';
import { formatCurrency } from '@/utils/format-currency';

export default function DashboardScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { data: metrics } = useDashboardMetrics();
  const { data: ordensEmAberto, isLoading: carregandoOrdens } = useOrdensEmAberto(5);
  const { data: lembretesCount } = useLembretesCount();

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.metricsRow}>
          <Card style={styles.metricCard}>
            <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
              Pendentes
            </Text>
            <Text style={[theme.typography.title, styles.metricValue, { color: theme.colors.warning }]}>
              {metrics?.pendentes ?? '—'}
            </Text>
          </Card>
          <Card style={styles.metricCard}>
            <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
              Em andamento
            </Text>
            <Text style={[theme.typography.title, styles.metricValue, { color: theme.colors.primary }]}>
              {metrics?.emAndamento ?? '—'}
            </Text>
          </Card>
          <Card style={styles.metricCard}>
            <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
              Faturamento mensal
            </Text>
            <Text
              style={[theme.typography.subtitle, styles.metricValue, { color: theme.colors.success }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {metrics ? formatCurrency(metrics.faturamentoMensal) : '—'}
            </Text>
          </Card>
        </View>

        <TouchableOpacity onPress={() => router.push('/lembretes')}>
          <Card style={styles.lembretesCard}>
            <View style={styles.lembretesHeader}>
              <Bell color={theme.colors.warning} size={18} />
              <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>
                Lembretes
              </Text>
            </View>
            <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
              {lembretesCount === undefined
                ? '—'
                : lembretesCount === 0
                  ? 'Nenhum lembrete pendente.'
                  : `${lembretesCount} ${lembretesCount === 1 ? 'cliente aguardando' : 'clientes aguardando'} contato.`}
            </Text>
          </Card>
        </TouchableOpacity>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>
              Ordens em aberto
            </Text>
            <TouchableOpacity onPress={() => router.push('/ordens-servico')}>
              <Text style={[theme.typography.caption, { color: theme.colors.primary }]}>
                Ver todas
              </Text>
            </TouchableOpacity>
          </View>

          {carregandoOrdens ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : ordensEmAberto && ordensEmAberto.length > 0 ? (
            <View style={styles.ordensList}>
              {ordensEmAberto.map((os) => (
                <TouchableOpacity
                  key={os.id}
                  onPress={() => router.push(`/ordens-servico/${os.id}`)}
                >
                  <Card style={styles.ordemRow}>
                    <View style={styles.ordemInfo}>
                      <Text style={[theme.typography.body, { color: theme.colors.text }]}>
                        {os.numero}
                      </Text>
                      <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                        {os.cliente?.nome ?? 'Cliente removido'}
                      </Text>
                    </View>
                    <StatusBadge status={os.status as StatusOS} />
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
              Nenhuma ordem de serviço em aberto
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>
            Atalhos rápidos
          </Text>
          <View style={styles.shortcutsRow}>
            <TouchableOpacity
              style={styles.shortcutFlex}
              onPress={() => router.push('/ordens-servico/novo')}
            >
              <Card style={styles.shortcutCard}>
                <ClipboardList color={theme.colors.primary} size={20} />
                <Text style={[theme.typography.caption, { color: theme.colors.text }]}>
                  Nova Ordem de Serviço
                </Text>
              </Card>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shortcutFlex} onPress={() => router.push('/clientes/novo')}>
              <Card style={styles.shortcutCard}>
                <UserPlus color={theme.colors.primary} size={20} />
                <Text style={[theme.typography.caption, { color: theme.colors.text }]}>
                  Novo Cliente
                </Text>
              </Card>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shortcutFlex} onPress={() => router.push('/propostas/novo')}>
              <Card style={styles.shortcutCard}>
                <FileText color={theme.colors.primary} size={20} />
                <Text style={[theme.typography.caption, { color: theme.colors.text }]}>
                  Nova Proposta
                </Text>
              </Card>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 24,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    gap: 4,
  },
  metricValue: {
    fontSize: 20,
  },
  lembretesCard: {
    gap: 4,
  },
  lembretesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ordensList: {
    gap: 8,
  },
  ordemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  ordemInfo: {
    gap: 2,
  },
  shortcutsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  shortcutFlex: {
    flexBasis: '47%',
    flexGrow: 1,
  },
  shortcutCard: {
    alignItems: 'center',
    gap: 8,
  },
});
