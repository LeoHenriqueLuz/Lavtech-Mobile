-- Renomeia o status de OS "Reinstalação Agendada" para "Agendado".
alter table ordens_servico drop constraint if exists ordens_servico_status_check;

update ordens_servico set status = 'Agendado' where status = 'Reinstalação Agendada';

alter table ordens_servico add constraint ordens_servico_status_check
  check (status in ('Retirada Agendada', 'Agendado', 'Finalizado', 'Cancelado'));
