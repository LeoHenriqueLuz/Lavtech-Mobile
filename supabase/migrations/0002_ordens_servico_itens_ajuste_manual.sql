-- Ajuste manual de valor por item da Ordem de Serviço.
-- valor_unitario_aplicado (já existente) passa a ser o valor efetivamente cobrado;
-- valor_unitario_tabela guarda o preço de tabela no momento em que o item foi criado,
-- preservado mesmo que a Tabela de Preços mude depois.

alter table ordens_servico_itens
  add column valor_unitario_tabela numeric(10, 2),
  add column ajuste_manual boolean not null default false,
  add column motivo_ajuste text;

update ordens_servico_itens
set valor_unitario_tabela = valor_unitario_aplicado
where valor_unitario_tabela is null;

alter table ordens_servico_itens
  alter column valor_unitario_tabela set not null;

alter table ordens_servico_itens
  add constraint motivo_obrigatorio_se_ajuste_manual
  check (not ajuste_manual or (motivo_ajuste is not null and length(trim(motivo_ajuste)) > 0));
