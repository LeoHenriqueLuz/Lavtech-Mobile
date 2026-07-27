# Feature: Lembretes

## Objetivo

Implementar um módulo de **Lembretes** para identificar automaticamente clientes cuja última Ordem de Serviço foi finalizada há **10 meses ou mais**, permitindo que o usuário envie manualmente uma mensagem de recomendação de nova lavagem pelo WhatsApp.

O objetivo é incentivar o retorno dos clientes para uma nova lavagem das persianas.

Esta funcionalidade não realizará envios automáticos.

---

# Funcionamento

Ao abrir o aplicativo ou acessar o módulo **Lembretes**, o sistema deverá localizar automaticamente todos os clientes elegíveis.

Critérios:

- Possuir pelo menos uma Ordem de Serviço.
- Considerar apenas a Ordem de Serviço mais recente com status **Finalizado**.
- A última lavagem deve ter ocorrido há **10 meses ou mais**.

Ignorar:

- Ordens de Serviço Canceladas.
- Ordens de Serviço em andamento.
- Ordens de Serviço Agendadas.

---

# Módulo

Criar um módulo chamado:

**Lembretes**

Na tela deverá ser exibida uma lista dos clientes aptos a receber o lembrete.

Cada card deverá conter:

- Nome do cliente
- WhatsApp
- Data da última lavagem
- Tempo desde a última lavagem
- Botão **Enviar lembrete**

Exemplo:

-------------------------------------------------

João Silva

Última lavagem:
15/08/2025

Tempo desde a lavagem:
11 meses

[ Enviar lembrete ]

-------------------------------------------------

Maria Oliveira

Última lavagem:
02/07/2025

Tempo desde a lavagem:
1 ano e 1 mês

[ Enviar lembrete ]

-------------------------------------------------

---

# Mensagem

Ao clicar em **Enviar lembrete**, o sistema deverá montar automaticamente a seguinte mensagem:

Olá, {{nome}}!

Passando para lembrar que já faz algum tempo desde a última lavagem das suas persianas.

Mesmo quando parecem limpas, elas acumulam poeira, ácaros e outras impurezas que podem comprometer a durabilidade do tecido e a qualidade do ambiente.

Se desejar solicitar um novo orçamento, estamos à disposição.

https://SEUSITE.com.br

Equipe LavTech.

O sistema deverá substituir automaticamente **{{nome}}** pelo nome do cliente.

---

# Envio

Ao clicar em **Enviar lembrete**, o sistema deverá:

- Montar automaticamente a mensagem.
- Substituir o nome do cliente.
- Utilizar a integração existente com a WhatsApp Business Cloud API.
- Registrar o resultado do envio no Histórico de Comunicações.

O envio será sempre manual.

Não implementar envio automático.

---

# Histórico de Comunicações

Criar um módulo chamado:

**Histórico de Comunicações**

Este módulo será responsável por registrar todas as comunicações enviadas pelo aplicativo.

Tipos de comunicação:

- Ordem de Serviço
- Proposta
- Lembrete de Nova Lavagem

Cada registro deverá conter:

- Cliente
- Ordem de Serviço (quando existir)
- Proposta (quando existir)
- Tipo da comunicação
- Canal (WhatsApp)
- Data e hora do envio
- Status (Sucesso ou Falha)
- Conteúdo da mensagem enviada
- Erro retornado pela API (quando existir)

Exemplo:

-------------------------------------------------

15/07/2026 14:32

Tipo:
Lembrete de Nova Lavagem

Canal:
WhatsApp

Status:
Sucesso

-------------------------------------------------

---

# Regras

O sistema deverá verificar se já existe um lembrete enviado com sucesso referente à última Ordem de Serviço Finalizada do cliente.

Caso já exista:

- O cliente não deverá aparecer novamente na lista de lembretes.

Caso seja criada uma nova Ordem de Serviço e ela seja finalizada, um novo ciclo será iniciado.

Após completar novamente 10 meses desde essa nova Ordem de Serviço Finalizada, o cliente voltará a aparecer na lista de lembretes.

Cada Ordem de Serviço poderá gerar apenas um lembrete de nova lavagem.

---

# Dashboard

Adicionar um card na tela inicial.

Título:

**Lembretes**

Exemplo:

🔔 Lembretes

5 clientes aguardando contato.

Ao tocar no card, abrir o módulo **Lembretes**.

Caso não existam clientes elegíveis, exibir:

Nenhum lembrete pendente.

---

# Arquitetura

Criar um módulo próprio para gerenciamento dos lembretes.

Reutilizar obrigatoriamente os módulos existentes:

- Clientes
- Ordens de Serviço
- WhatsApp Business Service
- Histórico de Comunicações

Não duplicar regras de negócio.

Seguir a arquitetura existente do projeto.

---

# Fluxo

Abrir aplicativo

↓

Visualizar card **Lembretes**

↓

Abrir módulo **Lembretes**

↓

Selecionar cliente

↓

Clicar em **Enviar lembrete**

↓

Enviar mensagem pelo WhatsApp

↓

Registrar envio no Histórico de Comunicações

↓

Remover cliente da lista

---

# Objetivo Final

Ao final da implementação o usuário deverá conseguir:

- Visualizar rapidamente todos os clientes que estão há 10 meses ou mais sem realizar uma nova lavagem.
- Enviar um lembrete personalizado com apenas um clique.
- Registrar automaticamente o envio no Histórico de Comunicações.
- Evitar o envio duplicado de lembretes para a mesma Ordem de Serviço.

A implementação deverá ser simples, intuitiva e de fácil manutenção.