import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

export type CatalogoTabela = 'ambientes' | 'tipos_persiana';
export type ItemCatalogo = Database['public']['Tables']['ambientes']['Row'];

interface ListItensParams {
  includeInactive?: boolean;
}

export async function listItens(
  tabela: CatalogoTabela,
  { includeInactive }: ListItensParams = {},
): Promise<ItemCatalogo[]> {
  let query = supabase.from(tabela).select('*').order('nome', { ascending: true });

  if (!includeInactive) {
    query = query.eq('ativo', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createItem(tabela: CatalogoTabela, nome: string): Promise<ItemCatalogo> {
  const { data, error } = await supabase.from(tabela).insert({ nome }).select().single();
  if (error) throw error;
  return data;
}

export async function setItemAtivo(
  tabela: CatalogoTabela,
  id: string,
  ativo: boolean,
): Promise<ItemCatalogo> {
  const { data, error } = await supabase
    .from(tabela)
    .update({ ativo })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
