import { supabase } from '@/lib/supabase';
import type { CadastroFormData } from './schema';

async function extrairMensagemErro(error: unknown): Promise<string> {
  if (error && typeof error === 'object' && 'context' in error) {
    try {
      const body = await (error as { context: Response }).context.json();
      if (body?.error) return body.error as string;
    } catch {
      // ignora e cai no fallback abaixo
    }
  }
  return 'Não foi possível concluir o cadastro.';
}

export async function cadastrarUsuario(form: CadastroFormData): Promise<void> {
  const { data, error } = await supabase.functions.invoke<{ error?: string }>(
    'cadastrar-usuario',
    {
      body: {
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        codigoAcesso: form.codigoAcesso,
      },
    },
  );

  if (error) throw new Error(await extrairMensagemErro(error));
  if (data?.error) throw new Error(data.error);
}
