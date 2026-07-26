import { addDays, format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';
import type { AjusteValorFormData } from '@/schemas/ajuste-valor';
import { somarItens } from '@/utils/calcular-totais';
import type { PropostaFormData } from './schema';
import type { StatusProposta } from './status';

export type Proposta = Database['public']['Tables']['propostas_comerciais']['Row'];
export type PropostaItem = Database['public']['Tables']['propostas_comerciais_itens']['Row'];

export interface ItemComTipo extends PropostaItem {
  tipo: { nome: string } | null;
}

export interface PropostaDetalhe extends Proposta {
  itens: ItemComTipo[];
}

export interface ItemPropostaParaCriar {
  tipoPersianaId: string;
  quantidade: number;
  valorUnitarioTabela: number;
  valorUnitarioAplicado: number;
  ajusteManual: boolean;
  motivoAjuste: string | null;
}

export async function listPropostas(): Promise<Proposta[]> {
  const { data, error } = await supabase
    .from('propostas_comerciais')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getProposta(id: string): Promise<PropostaDetalhe> {
  const { data: proposta, error } = await supabase
    .from('propostas_comerciais')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;

  const { data: itens, error: itensError } = await supabase
    .from('propostas_comerciais_itens')
    .select('*, tipo:tipos_persiana(nome)')
    .eq('proposta_id', id)
    .order('created_at', { ascending: true });
  if (itensError) throw itensError;

  return { ...proposta, itens };
}

function calcularDataValidade(validadeDias: number): string {
  return format(addDays(new Date(), validadeDias), 'yyyy-MM-dd');
}

export async function createProposta(
  responsavelId: string,
  itens: ItemPropostaParaCriar[],
  form: PropostaFormData,
): Promise<Proposta> {
  const desconto = form.desconto ? Number(form.desconto.replace(',', '.')) : 0;
  const validadeDias = Number(form.validadeDias);
  const valorSubtotal = somarItens(itens);
  const valorFinal = valorSubtotal - desconto;

  const novaProposta = {
    cliente_nome: form.clienteNome || null,
    cliente_whatsapp: form.clienteWhatsapp || null,
    responsavel_id: responsavelId,
    valor_subtotal: valorSubtotal,
    valor_desconto: desconto,
    valor_final: valorFinal,
    observacoes: form.observacoes || null,
    validade_dias: validadeDias,
    data_validade: calcularDataValidade(validadeDias),
  } as unknown as Database['public']['Tables']['propostas_comerciais']['Insert'];

  const { data: proposta, error } = await supabase
    .from('propostas_comerciais')
    .insert(novaProposta)
    .select()
    .single();
  if (error) throw error;

  const { error: itensError } = await supabase.from('propostas_comerciais_itens').insert(
    itens.map((item) => ({
      proposta_id: proposta.id,
      tipo_persiana_id: item.tipoPersianaId,
      quantidade: item.quantidade,
      valor_unitario_tabela: item.valorUnitarioTabela,
      valor_unitario_aplicado: item.valorUnitarioAplicado,
      ajuste_manual: item.ajusteManual,
      motivo_ajuste: item.motivoAjuste,
    })),
  );

  if (itensError) {
    await supabase.from('propostas_comerciais').delete().eq('id', proposta.id);
    throw itensError;
  }

  return proposta;
}

export async function updateStatusProposta(id: string, status: StatusProposta): Promise<Proposta> {
  const { data, error } = await supabase
    .from('propostas_comerciais')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function recalcularTotaisProposta(propostaId: string): Promise<void> {
  const { data: itens, error } = await supabase
    .from('propostas_comerciais_itens')
    .select('quantidade, valor_unitario_aplicado')
    .eq('proposta_id', propostaId);
  if (error) throw error;

  const { data: proposta, error: propostaError } = await supabase
    .from('propostas_comerciais')
    .select('valor_desconto')
    .eq('id', propostaId)
    .single();
  if (propostaError) throw propostaError;

  const valorSubtotal = somarItens(
    itens.map((item) => ({
      quantidade: item.quantidade,
      valorUnitarioAplicado: item.valor_unitario_aplicado,
    })),
  );
  const valorFinal = valorSubtotal - proposta.valor_desconto;

  const { error: updateError } = await supabase
    .from('propostas_comerciais')
    .update({ valor_subtotal: valorSubtotal, valor_final: valorFinal })
    .eq('id', propostaId);
  if (updateError) throw updateError;
}

export async function updateItemValorProposta(
  itemId: string,
  propostaId: string,
  form: AjusteValorFormData,
): Promise<PropostaItem> {
  const { data, error } = await supabase
    .from('propostas_comerciais_itens')
    .update({
      valor_unitario_aplicado: Number(form.novoValor.replace(',', '.')),
      ajuste_manual: true,
      motivo_ajuste: form.motivo,
    })
    .eq('id', itemId)
    .select()
    .single();
  if (error) throw error;

  await recalcularTotaisProposta(propostaId);
  return data;
}

export async function duplicateProposta(id: string): Promise<Proposta> {
  const original = await getProposta(id);

  const novaProposta = {
    cliente_nome: original.cliente_nome,
    cliente_whatsapp: original.cliente_whatsapp,
    responsavel_id: original.responsavel_id,
    valor_subtotal: original.valor_subtotal,
    valor_desconto: original.valor_desconto,
    valor_final: original.valor_final,
    observacoes: original.observacoes,
    validade_dias: original.validade_dias,
    data_validade: calcularDataValidade(original.validade_dias),
  } as unknown as Database['public']['Tables']['propostas_comerciais']['Insert'];

  const { data: proposta, error } = await supabase
    .from('propostas_comerciais')
    .insert(novaProposta)
    .select()
    .single();
  if (error) throw error;

  const { error: itensError } = await supabase.from('propostas_comerciais_itens').insert(
    original.itens.map((item) => ({
      proposta_id: proposta.id,
      tipo_persiana_id: item.tipo_persiana_id,
      quantidade: item.quantidade,
      valor_unitario_tabela: item.valor_unitario_tabela,
      valor_unitario_aplicado: item.valor_unitario_aplicado,
      ajuste_manual: item.ajuste_manual,
      motivo_ajuste: item.motivo_ajuste,
    })),
  );

  if (itensError) {
    await supabase.from('propostas_comerciais').delete().eq('id', proposta.id);
    throw itensError;
  }

  return proposta;
}

export async function deleteProposta(id: string): Promise<void> {
  const { error } = await supabase.from('propostas_comerciais').delete().eq('id', id);
  if (error) throw error;
}
