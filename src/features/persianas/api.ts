import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';
import type { PersianaFormData } from './schema';

export type Persiana = Database['public']['Tables']['persianas']['Row'];

export interface PersianaComNomes extends Persiana {
  ambiente: { nome: string } | null;
  tipo: { nome: string } | null;
}

interface ListPersianasParams {
  includeInactive?: boolean;
}

export async function listPersianasByCliente(
  clienteId: string,
  { includeInactive }: ListPersianasParams = {},
): Promise<PersianaComNomes[]> {
  let query = supabase
    .from('persianas')
    .select('*, ambiente:ambientes(nome), tipo:tipos_persiana(nome)')
    .eq('cliente_id', clienteId)
    .order('created_at', { ascending: true });

  if (!includeInactive) {
    query = query.eq('ativo', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

function toPersianaInput(
  clienteId: string,
  form: PersianaFormData,
): Database['public']['Tables']['persianas']['Insert'] {
  return {
    cliente_id: clienteId,
    ambiente_id: form.ambienteId,
    ambiente_outro_descricao: form.ambienteOutroDescricao || null,
    tipo_id: form.tipoId,
    quantidade: Number(form.quantidade),
    observacoes: form.observacoes || null,
  };
}

export async function createPersiana(clienteId: string, form: PersianaFormData): Promise<Persiana> {
  const { data, error } = await supabase
    .from('persianas')
    .insert(toPersianaInput(clienteId, form))
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePersiana(
  id: string,
  clienteId: string,
  form: PersianaFormData,
): Promise<Persiana> {
  const { data, error } = await supabase
    .from('persianas')
    .update(toPersianaInput(clienteId, form))
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function setPersianaAtivo(id: string, ativo: boolean): Promise<Persiana> {
  const { data, error } = await supabase
    .from('persianas')
    .update({ ativo })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export function persianaToFormData(persiana: Persiana): PersianaFormData {
  return {
    ambienteId: persiana.ambiente_id,
    ambienteOutroDescricao: persiana.ambiente_outro_descricao ?? '',
    tipoId: persiana.tipo_id,
    quantidade: String(persiana.quantidade),
    observacoes: persiana.observacoes ?? '',
  };
}

/** "Outro" não tem valor próprio — mostra a descrição livre no lugar do nome do catálogo. */
export function formatAmbiente(
  nome: string | undefined,
  descricaoOutro: string | null | undefined,
): string {
  if (!nome) return '—';
  if (nome === 'Outro' && descricaoOutro) return descricaoOutro;
  return nome;
}
