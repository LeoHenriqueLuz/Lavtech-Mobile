-- LavTech — schema inicial
-- Entidades: usuários, clientes, persianas, tabela de preços, ordens de serviço,
-- fotos da OS, histórico de comunicação e configurações da empresa.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Função utilitária: mantém updated_at sempre atualizado
-- ---------------------------------------------------------------------------
create function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- usuarios — perfil interno vinculado ao Supabase Auth (responsáveis pela OS)
-- ---------------------------------------------------------------------------
create table usuarios (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null,
  created_at timestamptz not null default now()
);

-- cria automaticamente um perfil em `usuarios` quando um usuário se cadastra no Auth
create function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.usuarios (id, nome)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'nome', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------------
-- clientes
-- ---------------------------------------------------------------------------
create table clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  whatsapp text not null,
  email text,
  cpf_cnpj text,
  cep text,
  logradouro text,
  numero text,
  complemento text,
  bairro text,
  cidade text,
  estado text,
  observacoes text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index clientes_nome_idx on clientes (nome);
create index clientes_ativo_idx on clientes (ativo);

create trigger clientes_set_updated_at
  before update on clientes
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- ambientes e tipos_persiana — listas fechadas, editáveis sem redeploy do app
-- ---------------------------------------------------------------------------
create table ambientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  ativo boolean not null default true
);

create table tipos_persiana (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  ativo boolean not null default true
);

-- ---------------------------------------------------------------------------
-- persianas — vinculadas a um cliente
-- ---------------------------------------------------------------------------
create table persianas (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes (id) on delete cascade,
  ambiente_id uuid not null references ambientes (id),
  tipo_id uuid not null references tipos_persiana (id),
  quantidade integer not null check (quantidade > 0),
  observacoes text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index persianas_cliente_id_idx on persianas (cliente_id);

create trigger persianas_set_updated_at
  before update on persianas
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- tabela_precos — preço vigente por tipo de persiana
-- ---------------------------------------------------------------------------
create table tabela_precos (
  id uuid primary key default gen_random_uuid(),
  tipo_id uuid not null references tipos_persiana (id),
  valor_unitario numeric(10, 2) not null check (valor_unitario >= 0),
  valor_manutencao numeric(10, 2) not null default 0 check (valor_manutencao >= 0),
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- suporta "mais de um preço por tipo; usa o mais recente entre os ativos"
create index tabela_precos_tipo_vigente_idx on tabela_precos (tipo_id, ativo, updated_at desc);

create trigger tabela_precos_set_updated_at
  before update on tabela_precos
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- ordens_servico
-- ---------------------------------------------------------------------------
create table ordens_servico (
  id uuid primary key default gen_random_uuid(),
  numero text not null unique,
  cliente_id uuid not null references clientes (id),
  responsavel_id uuid references usuarios (id),
  valor_total numeric(10, 2) not null default 0,
  valor_manutencao numeric(10, 2) not null default 0,
  valor_desconto numeric(10, 2) not null default 0,
  forma_pagamento text,
  valor_final numeric(10, 2) not null default 0,
  status text not null default 'Retirada Agendada'
    check (status in ('Retirada Agendada', 'Reinstalação Agendada', 'Finalizado', 'Cancelado')),
  data_abertura timestamptz not null default now(),
  data_previsao_entrega date,
  data_finalizacao timestamptz,
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index ordens_servico_cliente_id_idx on ordens_servico (cliente_id);
create index ordens_servico_status_idx on ordens_servico (status);

-- regra de negócio: no máximo 1 OS aberta (não finalizada/cancelada) por cliente
create unique index ordens_servico_cliente_aberta_idx
  on ordens_servico (cliente_id)
  where status not in ('Finalizado', 'Cancelado');

create trigger ordens_servico_set_updated_at
  before update on ordens_servico
  for each row execute function set_updated_at();

-- numeração automática OS-AAAA-000001, sequencial por ano
create table numeracao_os (
  ano integer primary key,
  ultimo_numero integer not null default 0
);

create function gerar_numero_os()
returns trigger
language plpgsql
as $$
declare
  ano_atual integer := extract(year from now());
  proximo_numero integer;
begin
  if new.numero is not null then
    return new;
  end if;

  insert into numeracao_os (ano, ultimo_numero)
  values (ano_atual, 1)
  on conflict (ano) do update set ultimo_numero = numeracao_os.ultimo_numero + 1
  returning ultimo_numero into proximo_numero;

  new.numero := 'OS-' || ano_atual || '-' || lpad(proximo_numero::text, 6, '0');
  return new;
end;
$$;

create trigger ordens_servico_gerar_numero
  before insert on ordens_servico
  for each row execute function gerar_numero_os();

-- ---------------------------------------------------------------------------
-- ordens_servico_itens — persianas incluídas em cada OS
-- ---------------------------------------------------------------------------
create table ordens_servico_itens (
  id uuid primary key default gen_random_uuid(),
  ordem_servico_id uuid not null references ordens_servico (id) on delete cascade,
  persiana_id uuid not null references persianas (id),
  quantidade integer not null check (quantidade > 0),
  valor_unitario_aplicado numeric(10, 2) not null,
  valor_manutencao_aplicado numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);

create index ordens_servico_itens_ordem_servico_id_idx on ordens_servico_itens (ordem_servico_id);

-- ---------------------------------------------------------------------------
-- fotos_ordem_servico — antes/depois na retirada e na recolocação
-- ---------------------------------------------------------------------------
create table fotos_ordem_servico (
  id uuid primary key default gen_random_uuid(),
  ordem_servico_id uuid not null references ordens_servico (id) on delete cascade,
  etapa text not null check (etapa in ('retirada', 'recolocacao')),
  momento text not null check (momento in ('antes', 'depois')),
  url text not null,
  created_at timestamptz not null default now()
);

create index fotos_ordem_servico_ordem_servico_id_idx on fotos_ordem_servico (ordem_servico_id);

-- ---------------------------------------------------------------------------
-- comunicacoes — histórico de envio (WhatsApp) por cliente/OS
-- ---------------------------------------------------------------------------
create table comunicacoes (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes (id),
  ordem_servico_id uuid references ordens_servico (id),
  canal text not null default 'whatsapp',
  status text not null check (status in ('sucesso', 'falha')),
  mensagem_erro text,
  enviado_em timestamptz not null default now()
);

create index comunicacoes_cliente_id_idx on comunicacoes (cliente_id);
create index comunicacoes_ordem_servico_id_idx on comunicacoes (ordem_servico_id);

-- ---------------------------------------------------------------------------
-- configuracoes_empresa — linha única (singleton)
-- ---------------------------------------------------------------------------
create table configuracoes_empresa (
  id smallint primary key default 1 check (id = 1),
  logo_url text,
  nome_fantasia text,
  razao_social text,
  cnpj text,
  telefone text,
  whatsapp text,
  email text,
  endereco text,
  horario_funcionamento text,
  rodape_pdf text,
  cor_principal text not null default '#1E90FF',
  updated_at timestamptz not null default now()
);

create trigger configuracoes_empresa_set_updated_at
  before update on configuracoes_empresa
  for each row execute function set_updated_at();

insert into configuracoes_empresa (id) values (1);

-- ---------------------------------------------------------------------------
-- Row Level Security — acesso liberado apenas a usuários autenticados
-- (app interno, mono-tenant: todos os usuários internos veem os mesmos dados)
-- ---------------------------------------------------------------------------
alter table usuarios enable row level security;
alter table clientes enable row level security;
alter table ambientes enable row level security;
alter table tipos_persiana enable row level security;
alter table persianas enable row level security;
alter table tabela_precos enable row level security;
alter table ordens_servico enable row level security;
alter table ordens_servico_itens enable row level security;
alter table fotos_ordem_servico enable row level security;
alter table comunicacoes enable row level security;
alter table configuracoes_empresa enable row level security;

create policy "usuarios_autenticados_acesso_total" on usuarios
  for all to authenticated using (true) with check (true);
create policy "usuarios_autenticados_acesso_total" on clientes
  for all to authenticated using (true) with check (true);
create policy "usuarios_autenticados_acesso_total" on ambientes
  for all to authenticated using (true) with check (true);
create policy "usuarios_autenticados_acesso_total" on tipos_persiana
  for all to authenticated using (true) with check (true);
create policy "usuarios_autenticados_acesso_total" on persianas
  for all to authenticated using (true) with check (true);
create policy "usuarios_autenticados_acesso_total" on tabela_precos
  for all to authenticated using (true) with check (true);
create policy "usuarios_autenticados_acesso_total" on ordens_servico
  for all to authenticated using (true) with check (true);
create policy "usuarios_autenticados_acesso_total" on ordens_servico_itens
  for all to authenticated using (true) with check (true);
create policy "usuarios_autenticados_acesso_total" on fotos_ordem_servico
  for all to authenticated using (true) with check (true);
create policy "usuarios_autenticados_acesso_total" on comunicacoes
  for all to authenticated using (true) with check (true);
create policy "usuarios_autenticados_acesso_total" on configuracoes_empresa
  for all to authenticated using (true) with check (true);
