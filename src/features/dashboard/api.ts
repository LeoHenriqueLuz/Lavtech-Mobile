import { addDays, format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import type { OrdemServicoComCliente } from '@/features/ordens-servico/api';

export interface DashboardMetrics {
  pendentes: number;
  emAndamento: number;
  faturamentoMensal: number;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);

  const [pendentesResult, andamentoResult, faturamentoResult] = await Promise.all([
    supabase
      .from('ordens_servico')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'Retirada Agendada'),
    supabase
      .from('ordens_servico')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'Agendado'),
    supabase
      .from('ordens_servico')
      .select('valor_final')
      .eq('status', 'Finalizado')
      .gte('data_finalizacao', inicioMes.toISOString()),
  ]);

  if (pendentesResult.error) throw pendentesResult.error;
  if (andamentoResult.error) throw andamentoResult.error;
  if (faturamentoResult.error) throw faturamentoResult.error;

  const faturamentoMensal = faturamentoResult.data.reduce(
    (soma, os) => soma + os.valor_final,
    0,
  );

  return {
    pendentes: pendentesResult.count ?? 0,
    emAndamento: andamentoResult.count ?? 0,
    faturamentoMensal,
  };
}

export async function getOrdensEmAberto(limit: number): Promise<OrdemServicoComCliente[]> {
  const { data, error } = await supabase
    .from('ordens_servico')
    .select('*, cliente:clientes(nome)')
    .neq('status', 'Finalizado')
    .neq('status', 'Cancelado')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function getEntregasAmanha(): Promise<OrdemServicoComCliente[]> {
  const amanha = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  const { data, error } = await supabase
    .from('ordens_servico')
    .select('*, cliente:clientes(nome)')
    .eq('status', 'Agendado')
    .eq('data_previsao_entrega', amanha);
  if (error) throw error;
  return data;
}
