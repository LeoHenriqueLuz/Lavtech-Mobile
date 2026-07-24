import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';
import type { ClienteFormData } from './schema';

export type Cliente = Database['public']['Tables']['clientes']['Row'];

interface ListClientesParams {
  search?: string;
  includeInactive?: boolean;
}

export async function listClientes({ search, includeInactive }: ListClientesParams): Promise<Cliente[]> {
  let query = supabase.from('clientes').select('*').order('nome', { ascending: true }).limit(100);

  if (!includeInactive) {
    query = query.eq('ativo', true);
  }

  if (search) {
    const termo = `%${search}%`;
    query = query.or(`nome.ilike.${termo},whatsapp.ilike.${termo},email.ilike.${termo}`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getCliente(id: string): Promise<Cliente> {
  const { data, error } = await supabase.from('clientes').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

function toClienteInput(form: ClienteFormData): Database['public']['Tables']['clientes']['Insert'] {
  return {
    nome: form.nome,
    whatsapp: form.whatsapp,
    email: form.email || null,
    cpf_cnpj: form.cpfCnpj || null,
    cep: form.cep || null,
    logradouro: form.logradouro || null,
    numero: form.numero || null,
    complemento: form.complemento || null,
    bairro: form.bairro || null,
    cidade: form.cidade || null,
    estado: form.estado || null,
    observacoes: form.observacoes || null,
  };
}

export async function createCliente(form: ClienteFormData): Promise<Cliente> {
  const { data, error } = await supabase.from('clientes').insert(toClienteInput(form)).select().single();
  if (error) throw error;
  return data;
}

export async function updateCliente(id: string, form: ClienteFormData): Promise<Cliente> {
  const { data, error } = await supabase
    .from('clientes')
    .update(toClienteInput(form))
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function setClienteAtivo(id: string, ativo: boolean): Promise<Cliente> {
  const { data, error } = await supabase
    .from('clientes')
    .update({ ativo })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export function clienteToFormData(cliente: Cliente): ClienteFormData {
  return {
    nome: cliente.nome,
    whatsapp: cliente.whatsapp,
    email: cliente.email ?? '',
    cpfCnpj: cliente.cpf_cnpj ?? '',
    cep: cliente.cep ?? '',
    logradouro: cliente.logradouro ?? '',
    numero: cliente.numero ?? '',
    complemento: cliente.complemento ?? '',
    bairro: cliente.bairro ?? '',
    cidade: cliente.cidade ?? '',
    estado: cliente.estado ?? '',
    observacoes: cliente.observacoes ?? '',
  };
}
