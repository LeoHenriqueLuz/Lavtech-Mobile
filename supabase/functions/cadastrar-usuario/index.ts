// Cria um novo usuário do app (auth + tabela `usuarios`), protegido por um código de
// acesso compartilhado (CADASTRO_CODIGO_ACESSO) — evita que qualquer pessoa que abra o
// app crie uma conta sozinha, já que o LavTech é interno e lida com dados de clientes.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function jsonResponse(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Método não permitido.' }, 405);
  }

  let body: { nome?: string; email?: string; senha?: string; codigoAcesso?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Corpo da requisição inválido.' }, 400);
  }

  const { nome, email, senha, codigoAcesso } = body;

  const codigoEsperado = Deno.env.get('CADASTRO_CODIGO_ACESSO');
  if (!codigoEsperado || codigoAcesso !== codigoEsperado) {
    return jsonResponse({ error: 'Código de acesso inválido.' }, 403);
  }

  if (!nome?.trim() || !email?.trim() || !senha) {
    return jsonResponse({ error: 'Preencha nome, e-mail e senha.' }, 400);
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  // O trigger `on_auth_user_created` (ver migration 0001) já cria a linha em `usuarios`
  // automaticamente a partir de `user_metadata.nome` — não inserir de novo aqui.
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
    user_metadata: { nome: nome.trim() },
  });

  if (authError || !authData.user) {
    return jsonResponse({ error: authError?.message ?? 'Não foi possível criar o usuário.' }, 400);
  }

  return jsonResponse({ success: true }, 200);
});
