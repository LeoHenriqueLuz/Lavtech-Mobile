import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import {
  Bell,
  Calendar,
  ClipboardList,
  FileText,
  Package,
  TrendingUp,
  UserPlus,
} from 'lucide-react-native';
import { Screen } from '@/components/screen';
import { Card } from '@/components/card';
import { AppButton } from '@/components/app-button';
import { BarChart } from '@/components/bar-chart';
import { useTheme } from '@/theme/theme-provider';
import {
  useDashboardMetrics,
  useEntregasAmanha,
  useFaturamentoPorPeriodo,
  useOrdensEmAberto,
} from '@/features/dashboard/hooks';
import { useLembretesCount } from '@/features/lembretes/hooks';
import { StatusBadge } from '@/features/ordens-servico/status-badge';
import type { StatusOS } from '@/features/ordens-servico/status';
import { formatCurrency } from '@/utils/format-currency';

export default function DashboardScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [periodoMeses, setPeriodoMeses] = useState(6);
  const { data: metrics } = useDashboardMetrics();
  const { data: ordensEmAberto, isLoading: carregandoOrdens } = useOrdensEmAberto(5);
  const { data: lembretesCount } = useLembretesCount();
  const { data: entregasAmanha } = useEntregasAmanha();
  const { data: faturamentoPeriodo } = useFaturamentoPorPeriodo(periodoMeses);

  const totalPeriodo = faturamentoPeriodo?.reduce((soma, item) => soma + item.total, 0) ?? 0;
  const faixaDatas =
    faturamentoPeriodo && faturamentoPeriodo.length > 0
      ? `${faturamentoPeriodo[0].label} ${faturamentoPeriodo[0].mes.slice(0, 4)} - ${faturamentoPeriodo[faturamentoPeriodo.length - 1].label} ${faturamentoPeriodo[faturamentoPeriodo.length - 1].mes.slice(0, 4)}`
      : '';

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

        {entregasAmanha && entregasAmanha.length > 0 && (
          <View style={styles.entregasList}>
            {entregasAmanha.map((os) => (
              <Card key={os.id} style={styles.entregaCard}>
                <View style={styles.entregaHeader}>
                  <Package color={theme.colors.primary} size={18} />
                  <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>
                    Entrega Agendada
                  </Text>
                </View>
                <Text style={[theme.typography.body, { color: theme.colors.text }]}>
                  {os.cliente?.nome ?? 'Cliente removido'} está agendado para amanhã.
                </Text>
                <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                  Programe-se para chegar ao local no horário marcado.
                </Text>
                <AppButton
                  label="Ver Ordem de Serviço"
                  variant="secondary"
                  onPress={() => router.push(`/ordens-servico/${os.id}`)}
                />
              </Card>
            ))}
          </View>
        )}

        <Card style={styles.faturamentoCard}>
          <View style={styles.faturamentoHeader}>
            <View style={styles.faturamentoTitulo}>
              <TrendingUp color={theme.colors.success} size={18} />
              <Text style={[theme.typography.subtitle, { color: theme.colors.text }]}>
                Faturamento ({periodoMeses} meses)
              </Text>
            </View>
            <View
              style={[
                styles.periodoPicker,
                {
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.radii.full,
                },
              ]}
            >
              <Picker
                selectedValue={periodoMeses}
                onValueChange={(value) => setPeriodoMeses(Number(value))}
                style={{ color: theme.colors.text }}
                dropdownIconColor={theme.colors.textMuted}
                mode="dropdown"
              >
                <Picker.Item label="3 meses" value={3} />
                <Picker.Item label="6 meses" value={6} />
                <Picker.Item label="12 meses" value={12} />
              </Picker>
            </View>
          </View>

          <Text style={[theme.typography.title, { color: theme.colors.success }]}>
            {formatCurrency(totalPeriodo)}
          </Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
            Total no período
          </Text>

          <BarChart
            data={(faturamentoPeriodo ?? []).map((item) => ({
              label: item.label,
              value: item.total,
            }))}
          />

          <View style={styles.faturamentoRodape}>
            <Calendar color={theme.colors.textMuted} size={14} />
            <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
              {faixaDatas}
            </Text>
          </View>
        </Card>

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
  entregasList: {
    gap: 12,
  },
  entregaCard: {
    gap: 8,
  },
  entregaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  faturamentoCard: {
    gap: 8,
  },
  faturamentoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faturamentoTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  periodoPicker: {
    borderWidth: 1,
    overflow: 'hidden',
    width: 130,
    height: 36,
    justifyContent: 'center',
  },
  faturamentoRodape: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
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
