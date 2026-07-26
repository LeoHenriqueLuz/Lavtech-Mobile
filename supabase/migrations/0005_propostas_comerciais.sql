-- Propostas Comerciais — orçamento rápido, independente de cliente/persiana/OS cadastrados.
-- Espelha o padrão de ordens_servico/ordens_servico_itens (0001_init.sql, 0002_...ajuste_manual.sql).

-- ---------------------------------------------------------------------------
-- propostas_comerciais
-- ---------------------------------------------------------------------------
create table propostas_comerciais (
  id uuid primary key default gen_random_uuid(),
  numero text not null unique,
  cliente_nome text,
  cliente_whatsapp text,
  responsavel_id uuid references usuarios (id),
  status text not null default 'Rascunho'
    check (status in ('Rascunho', 'Enviada', 'Aceita', 'Recusada', 'Expirada')),
  valor_subtotal numeric(10, 2) not null default 0,
  valor_desconto numeric(10, 2) not null default 0,
  valor_final numeric(10, 2) not null default 0,
  observacoes text,
  validade_dias integer not null default 15,
  data_validade date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index propostas_comerciais_status_idx on propostas_comerciais (status);

create trigger propostas_comerciais_set_updated_at
  before update on propostas_comerciais
  for each row execute function set_updated_at();

-- numeração automática PROP-AAAA-000001, sequencial por ano (mesmo padrão de gerar_numero_os)
create table numeracao_propostas (
  ano integer primary key,
  ultimo_numero integer not null default 0
);

create function gerar_numero_proposta()
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

  insert into numeracao_propostas (ano, ultimo_numero)
  values (ano_atual, 1)
  on conflict (ano) do update set ultimo_numero = numeracao_propostas.ultimo_numero + 1
  returning ultimo_numero into proximo_numero;

  new.numero := 'PROP-' || ano_atual || '-' || lpad(proximo_numero::text, 6, '0');
  return new;
end;
$$;

create trigger propostas_comerciais_gerar_numero
  before insert on propostas_comerciais
  for each row execute function gerar_numero_proposta();

-- ---------------------------------------------------------------------------
-- propostas_comerciais_itens — tipo de persiana direto (sem persiana cadastrada)
-- ---------------------------------------------------------------------------
create table propostas_comerciais_itens (
  id uuid primary key default gen_random_uuid(),
  proposta_id uuid not null references propostas_comerciais (id) on delete cascade,
  tipo_persiana_id uuid not null references tipos_persiana (id),
  quantidade integer not null check (quantidade > 0),
  valor_unitario_tabela numeric(10, 2) not null,
  valor_unitario_aplicado numeric(10, 2) not null,
  ajuste_manual boolean not null default false,
  motivo_ajuste text,
  created_at timestamptz not null default now(),
  constraint motivo_obrigatorio_se_ajuste_manual
    check (not ajuste_manual or (motivo_ajuste is not null and length(trim(motivo_ajuste)) > 0))
);

create index propostas_comerciais_itens_proposta_id_idx on propostas_comerciais_itens (proposta_id);

-- ---------------------------------------------------------------------------
-- Row Level Security — mesmo padrão das demais tabelas (app interno, mono-tenant)
-- ---------------------------------------------------------------------------
alter table propostas_comerciais enable row level security;
alter table propostas_comerciais_itens enable row level security;

create policy "usuarios_autenticados_acesso_total" on propostas_comerciais
  for all to authenticated using (true) with check (true);
create policy "usuarios_autenticados_acesso_total" on propostas_comerciais_itens
  for all to authenticated using (true) with check (true);
