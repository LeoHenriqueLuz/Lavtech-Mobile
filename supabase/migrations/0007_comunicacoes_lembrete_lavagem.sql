-- Adiciona tipo e conteúdo da mensagem em comunicacoes, para suportar o registro de Lembretes de Nova Lavagem.
alter table comunicacoes add column tipo text not null check (tipo in ('lembrete_lavagem'));
alter table comunicacoes add column mensagem text;
