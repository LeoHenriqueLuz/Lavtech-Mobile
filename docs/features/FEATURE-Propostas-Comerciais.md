# Feature: Propostas Comerciais

## Objetivo

Implementar um módulo de **Propostas Comerciais** para permitir a criação de orçamentos rápidos, sem necessidade de cadastrar previamente clientes, persianas ou criar uma Ordem de Serviço.

Esta funcionalidade tem como objetivo agilizar o atendimento inicial realizado pelo WhatsApp, permitindo gerar uma proposta profissional em poucos segundos.

---

# Contexto

Hoje o processo ocorre da seguinte forma:

1. O cliente entra em contato pelo WhatsApp.
2. Informa:
   - Tipo da persiana;
   - Quantidade;
   - Eventualmente alguma observação.
3. Raramente informa as medidas.
4. O orçamento é calculado manualmente.
5. O valor é enviado em uma conversa no WhatsApp.

Este processo é demorado, não fica registrado e transmite pouca padronização.

---

# Objetivo da Funcionalidade

Permitir gerar uma Proposta Comercial em menos de 1 minuto.

Fluxo esperado:

Cliente

↓

Nova Proposta

↓

Adicionar itens

↓

Cálculo automático

↓

Gerar PDF

↓

Enviar para o cliente via WhatsApp

---

# Importante

A Proposta Comercial NÃO deverá:

- cadastrar cliente;
- cadastrar persianas;
- criar Ordem de Serviço;
- alterar a Tabela de Preços.

É uma funcionalidade totalmente independente.

---

# Estrutura

Adicionar um novo módulo:

Propostas Comerciais

Na tela inicial deverá existir um acesso rápido:

+ Nova Proposta

---

# Cadastro da Proposta

Campos:

## Dados do Cliente

- Nome (opcional)
- WhatsApp (opcional)

Não criar cadastro definitivo.

---

## Itens

Cada item possui:

- Tipo da Persiana
- Quantidade
- Valor Unitário
- Valor Total

O valor unitário será obtido automaticamente da Tabela de Preços.

---

## Observações

Campo livre.

Texto sugerido:

Valores sujeitos à confirmação após visita técnica.

---

## Validade

Por padrão:

15 dias

Permitindo alteração.

---

# Cálculo

O cálculo deverá utilizar exatamente a mesma regra da Ordem de Serviço.

Não duplicar lógica.

Reutilizar o Service responsável pelos cálculos.

---

# Ajuste Manual

Assim como na Ordem de Serviço, será permitido alterar manualmente o valor de um item.

Regras:

- altera apenas a proposta;
- não altera a tabela de preços;
- motivo do ajuste obrigatório.

---

# Total

O sistema calcula automaticamente:

- Subtotal
- Desconto (opcional)
- Valor Final

---

# PDF

O sistema deverá gerar um PDF profissional.

O layout deverá seguir o padrão visual da Ordem de Serviço.

Conteúdo:

- Logo da LavTech
- Dados da empresa
- Número da proposta
- Data
- Validade
- Nome do cliente
- Lista dos serviços
- Valor total
- Observações
- Assinatura da empresa (imagem configurável)

Não deverá conter assinatura do cliente.

---

# Numeração

Criar numeração própria.

Formato:

PROP-AAAA-000001

Exemplo:

PROP-2026-000001

---

# Status

Cada proposta possui um status.

Valores:

- Rascunho
- Enviada
- Aceita
- Recusada
- Expirada

---

# Histórico

Salvar todas as propostas.

Permitir:

- pesquisar;
- visualizar;
- editar;
- duplicar;
- excluir.

---

# Compartilhamento

Após gerar o PDF:

Botão:

Baixar PDF



---

# Melhorias Futuras

Esta estrutura deverá permitir futuramente:

- Converter proposta em Ordem de Serviço.
- Cadastrar automaticamente o cliente.
- Cadastrar automaticamente as persianas.
- Aproveitar todos os itens da proposta na OS.

Essas funcionalidades NÃO deverão ser implementadas agora.

Apenas deixar a estrutura preparada.

---

# Arquitetura

Criar um novo módulo independente.

Exemplo:

modules/

    proposals/

        controllers/

        services/

        repositories/

        dto/

        validators/

        pdf/

        types/

Seguir o mesmo padrão arquitetural utilizado nas Ordens de Serviço.

---

# Reutilização

Sempre que possível reutilizar:

- componentes de UI;
- cálculo da Ordem de Serviço;
- geração de PDF;
- tabela de preços.

Evitar duplicação de código.

---

# Objetivo Final

Ao final da implementação o usuário deverá conseguir:

1. Abrir o aplicativo.
2. Criar uma nova proposta.
3. Adicionar os itens.
4. Obter o cálculo automático.
5. Gerar o PDF.
6. Baixar o PDF.

Todo esse processo deve levar menos de um minuto.

Esta funcionalidade deverá priorizar velocidade, simplicidade e excelente experiência do usuário.