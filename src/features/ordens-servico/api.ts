import { format as formatDateFns, parse } from 'date-fns';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';
import type { AjusteValorFormData } from '@/schemas/ajuste-valor';
import { somarItens } from '@/utils/calcular-totais';
import type { OrdemServicoFormData } from './schema';
import type { StatusOS } from './status';

export type OrdemServico = Database['public']['Tables']['ordens_servico']['Row'];
export type OrdemServicoItem = Database['public']['Tables']['ordens_servico_itens']['Row'];
export type Cliente = Database['public']['Tables']['clientes']['Row'];

export interface OrdemServicoComCliente extends OrdemServico {
  cliente: { nome: string } | null;
}

export interface ItemComPersiana extends OrdemServicoItem {
  persiana: {
    id: string;
    quantidade: number;
    ambiente_outro_descricao: string | null;
    ambiente: { nome: string } | null;
    tipo: { nome: string } | null;
  } | null;
}

export interface OrdemServicoDetalhe extends OrdemServico {
  cliente: Cliente | null;
  responsavel: { nome: string } | null;
  itens: ItemComPersiana[];
}

export interface ItemParaCriar {
  persianaId: string;
  quantidade: number;
  valorUnitarioTabela: number;
  valorUnitarioAplicado: number;
  valorManutencaoAplicado: number;
  ajusteManual: boolean;
  motivoAjuste: string | null;
}

export async function listOrdensServico(): Promise<OrdemServicoComCliente[]> {
  const { data, error } = await supabase
    .from('ordens_servico')
    .select('*, cliente:clientes(nome)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getOrdemAbertaPorCliente(clienteId: string): Promise<OrdemServico | null> {
  const { data, error } = await supabase
    .from('ordens_servico')
    .select('*')
    .eq('cliente_id', clienteId)
    .neq('status', 'Finalizado')
    .neq('status', 'Cancelado')
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getOrdemServico(id: string): Promise<OrdemServicoDetalhe> {
  const { data: os, error } = await supabase
    .from('ordens_servico')
    .select('*, cliente:clientes(*), responsavel:usuarios(nome)')
    .eq('id', id)
    .single();
  if (error) throw error;

  const { data: itens, error: itensError } = await supabase
    .from('ordens_servico_itens')
    .select(
      '*, persiana:persianas(id, quantidade, ambiente_outro_descricao, ambiente:ambientes(nome), tipo:tipos_persiana(nome))',
    )
    .eq('ordem_servico_id', id)
    .order('created_at', { ascending: true });
  if (itensError) throw itensError;

  return { ...os, itens };
}

function calcularTotais(itens: ItemParaCriar[]) {
  const valorTotal = somarItens(itens);
  const valorManutencao = somarItens(
    itens.map((item) => ({
      quantidade: item.quantidade,
      valorUnitarioAplicado: item.valorManutencaoAplicado,
    })),
  );
  return { valorTotal, valorManutencao };
}

function parseDataBr(data: string | undefined): string | null {
  if (!data) return null;
  const parsed = parse(data, 'dd/MM/yyyy', new Date());
  return formatDateFns(parsed, 'yyyy-MM-dd');
}

export async function createOrdemServico(
  clienteId: string,
  responsavelId: string,
  itens: ItemParaCriar[],
  form: OrdemServicoFormData,
): Promise<OrdemServico> {
  const desconto = form.desconto ? Number(form.desconto.replace(',', '.')) : 0;
  const { valorTotal, valorManutencao } = calcularTotais(itens);
  const valorFinal = valorTotal + valorManutencao - desconto;

  // `numero` é preenchido pelo trigger `gerar_numero_os` (ver 0001_init.sql) quando omitido;
  // o tipo gerado marca a coluna como obrigatória por não haver DEFAULT no schema.
  const novaOrdemServico = {
    cliente_id: clienteId,
    responsavel_id: responsavelId,
    forma_pagamento: form.formaPagamento || null,
    valor_desconto: desconto,
    valor_total: valorTotal,
    valor_manutencao: valorManutencao,
    valor_final: valorFinal,
    data_previsao_entrega: parseDataBr(form.dataPrevisaoEntrega),
    observacoes: form.observacoes || null,
  } as unknown as Database['public']['Tables']['ordens_servico']['Insert'];

  const { data: os, error } = await supabase
    .from('ordens_servico')
    .insert(novaOrdemServico)
    .select()
    .single();
  if (error) throw error;

  const { error: itensError } = await supabase.from('ordens_servico_itens').insert(
    itens.map((item) => ({
      ordem_servico_id: os.id,
      persiana_id: item.persianaId,
      quantidade: item.quantidade,
      valor_unitario_tabela: item.valorUnitarioTabela,
      valor_unitario_aplicado: item.valorUnitarioAplicado,
      valor_manutencao_aplicado: item.valorManutencaoAplicado,
      ajuste_manual: item.ajusteManual,
      motivo_ajuste: item.motivoAjuste,
    })),
  );

  if (itensError) {
    await supabase.from('ordens_servico').delete().eq('id', os.id);
    throw itensError;
  }

  return os;
}

export async function updateStatus(id: string, status: StatusOS): Promise<OrdemServico> {
  const { data, error } = await supabase
    .from('ordens_servico')
    .update({
      status,
      data_finalizacao: status === 'Finalizado' ? new Date().toISOString() : null,
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function recalcularTotaisOrdemServico(ordemServicoId: string): Promise<void> {
  const { data: itens, error } = await supabase
    .from('ordens_servico_itens')
    .select('quantidade, valor_unitario_aplicado, valor_manutencao_aplicado')
    .eq('ordem_servico_id', ordemServicoId);
  if (error) throw error;

  const { data: os, error: osError } = await supabase
    .from('ordens_servico')
    .select('valor_desconto')
    .eq('id', ordemServicoId)
    .single();
  if (osError) throw osError;

  const valorTotal = somarItens(
    itens.map((item) => ({
      quantidade: item.quantidade,
      valorUnitarioAplicado: item.valor_unitario_aplicado,
    })),
  );
  const valorManutencao = somarItens(
    itens.map((item) => ({
      quantidade: item.quantidade,
      valorUnitarioAplicado: item.valor_manutencao_aplicado,
    })),
  );
  const valorFinal = valorTotal + valorManutencao - os.valor_desconto;

  const { error: updateError } = await supabase
    .from('ordens_servico')
    .update({ valor_total: valorTotal, valor_manutencao: valorManutencao, valor_final: valorFinal })
    .eq('id', ordemServicoId);
  if (updateError) throw updateError;
}

export async function updateItemValor(
  itemId: string,
  ordemServicoId: string,
  form: AjusteValorFormData,
): Promise<OrdemServicoItem> {
  const { data, error } = await supabase
    .from('ordens_servico_itens')
    .update({
      valor_unitario_aplicado: Number(form.novoValor.replace(',', '.')),
      ajuste_manual: true,
      motivo_ajuste: form.motivo,
    })
    .eq('id', itemId)
    .select()
    .single();
  if (error) throw error;

  await recalcularTotaisOrdemServico(ordemServicoId);
  return data;
}
