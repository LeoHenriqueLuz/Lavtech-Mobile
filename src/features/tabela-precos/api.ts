import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';
import { listItens, type ItemCatalogo } from '@/features/catalogos/api';
import type { PrecoFormData } from './schema';

export type Preco = Database['public']['Tables']['tabela_precos']['Row'];

export interface TipoComPrecoVigente extends ItemCatalogo {
  precoVigente: Preco | null;
}

async function listPrecosAtivosOrdenados(): Promise<Preco[]> {
  const { data, error } = await supabase
    .from('tabela_precos')
    .select('*')
    .eq('ativo', true)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function listPrecosVigentes(): Promise<TipoComPrecoVigente[]> {
  const [tipos, precosAtivos] = await Promise.all([
    listItens('tipos_persiana'),
    listPrecosAtivosOrdenados(),
  ]);

  const vigentePorTipo = new Map<string, Preco>();
  for (const preco of precosAtivos) {
    if (!vigentePorTipo.has(preco.tipo_id)) {
      vigentePorTipo.set(preco.tipo_id, preco);
    }
  }

  return tipos.map((tipo) => ({
    ...tipo,
    precoVigente: vigentePorTipo.get(tipo.id) ?? null,
  }));
}

export async function listHistoricoPorTipo(tipoId: string): Promise<Preco[]> {
  const { data, error } = await supabase
    .from('tabela_precos')
    .select('*')
    .eq('tipo_id', tipoId)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createPreco(tipoId: string, form: PrecoFormData): Promise<Preco> {
  const { data, error } = await supabase
    .from('tabela_precos')
    .insert({
      tipo_id: tipoId,
      valor_unitario: Number(form.valorUnitario.replace(',', '.')),
      valor_manutencao: form.valorManutencao ? Number(form.valorManutencao.replace(',', '.')) : 0,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function setPrecoAtivo(id: string, ativo: boolean): Promise<Preco> {
  const { data, error } = await supabase
    .from('tabela_precos')
    .update({ ativo })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
