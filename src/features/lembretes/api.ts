import { differenceInMonths, parseISO } from 'date-fns';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

const MESES_PARA_LEMBRETE = 10;
const TIPO_LEMBRETE_LAVAGEM = 'lembrete_lavagem';

export interface ClienteParaLembrete {
  ordemServicoId: string;
  clienteId: string;
  clienteNome: string;
  clienteWhatsapp: string;
  dataFinalizacao: string;
}

export async function listClientesParaLembrete(): Promise<ClienteParaLembrete[]> {
  const { data, error } = await supabase
    .from('ordens_servico')
    .select('id, cliente_id, data_finalizacao, cliente:clientes(id, nome, whatsapp)')
    .eq('status', 'Finalizado')
    .not('data_finalizacao', 'is', null)
    .order('data_finalizacao', { ascending: false });
  if (error) throw error;

  const ultimaOsPorCliente = new Map<string, (typeof data)[number]>();
  for (const os of data) {
    if (!ultimaOsPorCliente.has(os.cliente_id)) {
      ultimaOsPorCliente.set(os.cliente_id, os);
    }
  }

  const candidatas = Array.from(ultimaOsPorCliente.values()).filter(
    (os) =>
      os.data_finalizacao !== null &&
      differenceInMonths(new Date(), parseISO(os.data_finalizacao)) >= MESES_PARA_LEMBRETE,
  );
  if (candidatas.length === 0) return [];

  const { data: lembretesEnviados, error: comunicacoesError } = await supabase
    .from('comunicacoes')
    .select('ordem_servico_id')
    .eq('tipo', TIPO_LEMBRETE_LAVAGEM)
    .eq('status', 'sucesso')
    .in(
      'ordem_servico_id',
      candidatas.map((os) => os.id),
    );
  if (comunicacoesError) throw comunicacoesError;

  const osComLembreteEnviado = new Set(lembretesEnviados.map((c) => c.ordem_servico_id));

  return candidatas
    .filter((os) => !osComLembreteEnviado.has(os.id) && os.cliente !== null)
    .map((os) => ({
      ordemServicoId: os.id,
      clienteId: os.cliente_id,
      clienteNome: os.cliente!.nome,
      clienteWhatsapp: os.cliente!.whatsapp,
      dataFinalizacao: os.data_finalizacao!,
    }))
    .sort((a, b) => a.dataFinalizacao.localeCompare(b.dataFinalizacao));
}

export interface RegistrarEnvioLembreteInput {
  clienteId: string;
  ordemServicoId: string;
  mensagem: string;
  status: 'sucesso' | 'falha';
  mensagemErro?: string | null;
}

export async function registrarEnvioLembrete(input: RegistrarEnvioLembreteInput): Promise<void> {
  const novaComunicacao = {
    cliente_id: input.clienteId,
    ordem_servico_id: input.ordemServicoId,
    tipo: TIPO_LEMBRETE_LAVAGEM,
    status: input.status,
    mensagem: input.mensagem,
    mensagem_erro: input.mensagemErro ?? null,
  } satisfies Database['public']['Tables']['comunicacoes']['Insert'];

  const { error } = await supabase.from('comunicacoes').insert(novaComunicacao);
  if (error) throw error;
}
