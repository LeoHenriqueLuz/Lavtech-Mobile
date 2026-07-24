-- Descrição livre para quando o Ambiente da persiana for a opção "Outro"
-- (preenchida apenas nesse caso; validação de obrigatoriedade fica no app,
-- já que o id da linha "Outro" em `ambientes` não é fixo).

alter table persianas add column ambiente_outro_descricao text;
