import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';
import type { EmpresaFormData } from './schema';

export type ConfiguracoesEmpresa = Database['public']['Tables']['configuracoes_empresa']['Row'];

export async function getConfiguracoesEmpresa(): Promise<ConfiguracoesEmpresa> {
  const { data, error } = await supabase
    .from('configuracoes_empresa')
    .select('*')
    .eq('id', 1)
    .single();
  if (error) throw error;
  return data;
}

function toEmpresaInput(
  form: EmpresaFormData,
): Database['public']['Tables']['configuracoes_empresa']['Update'] {
  return {
    nome_fantasia: form.nomeFantasia || null,
    razao_social: form.razaoSocial || null,
    cnpj: form.cnpj || null,
    telefone: form.telefone || null,
    whatsapp: form.whatsapp || null,
    email: form.email || null,
    endereco: form.endereco || null,
    horario_funcionamento: form.horarioFuncionamento || null,
    rodape_pdf: form.rodapePdf || null,
    cor_principal: form.corPrincipal,
  };
}

export async function updateConfiguracoesEmpresa(
  form: EmpresaFormData,
): Promise<ConfiguracoesEmpresa> {
  const { data, error } = await supabase
    .from('configuracoes_empresa')
    .update(toEmpresaInput(form))
    .eq('id', 1)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export function empresaToFormData(empresa: ConfiguracoesEmpresa): EmpresaFormData {
  return {
    nomeFantasia: empresa.nome_fantasia ?? '',
    razaoSocial: empresa.razao_social ?? '',
    cnpj: empresa.cnpj ?? '',
    telefone: empresa.telefone ?? '',
    whatsapp: empresa.whatsapp ?? '',
    email: empresa.email ?? '',
    endereco: empresa.endereco ?? '',
    horarioFuncionamento: empresa.horario_funcionamento ?? '',
    rodapePdf: empresa.rodape_pdf ?? '',
    corPrincipal: empresa.cor_principal,
  };
}

/** Envia a imagem do logo (URI local do image-picker) para o bucket `empresa` e retorna a URL pública. */
export async function uploadLogo(uri: string): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  // Deriva a extensão do content-type real do arquivo — o URI (blob:/file:/data:) nem sempre tem uma.
  const contentType = blob.type || 'image/jpeg';
  const extensao = contentType.split('/').pop() ?? 'jpg';
  const path = `logo-${Date.now()}.${extensao}`;

  const { error } = await supabase.storage.from('empresa').upload(path, blob, {
    contentType,
    upsert: true,
  });
  if (error) throw error;

  const { data } = supabase.storage.from('empresa').getPublicUrl(path);
  return data.publicUrl;
}

export async function updateLogoUrl(logoUrl: string): Promise<ConfiguracoesEmpresa> {
  const { data, error } = await supabase
    .from('configuracoes_empresa')
    .update({ logo_url: logoUrl })
    .eq('id', 1)
    .select()
    .single();
  if (error) throw error;
  return data;
}
