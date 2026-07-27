# LavTech

## Visão Geral

**LavTech** é uma aplicação Mobile desenvolvida exclusivamente para uso interno da LavTech.

O sistema centraliza o cadastro de clientes e persianas, a criação de Propostas Comerciais e Ordens de Serviço com cálculo automático de valores, a geração de PDF e o envio por WhatsApp, Foto de antes e Depois na retirada da persiana e recolocação, 

O projeto será desenvolvido utilizando Claude Code como assistente de desenvolvimento.

---

# Objetivos

O sistema permite:

* Gerenciar clientes.(Cadastro, editar, excluir)
* Tabela de Preços para Cadastro de persianas e seus valores.
* Gerenciar persianas, vinculadas a cada cliente.
* Criar Propostas Comerciais (orçamento rápido, sem exigir cliente/persiana cadastrados).
* Gerenciar Ordens de Serviço, do registro até a finalização.
* Calcular automaticamente os valores dos serviços a partir da Tabela de Preços.
* Gerar Ordem de Serviço e Proposta Comercial em PDF.
* Enviar a Ordem de Serviço por WhatsApp para o Cliente, com o PDF anexado.

---

## Cadastro de Clientes

O sistema permite:

* Cadastro, edição, pesquisa e filtro por nome/WhatsApp/e-mail.
* Exclusão lógica (campo `ativo`), preservando o registro e permitindo reativação.
* Observações livres.
* Preenchimento automático de endereço a partir do CEP (integração com API de CEP).

Campos: nome, WhatsApp, e-mail, CPF/CNPJ, endereço completo (CEP, logradouro, número, complemento, bairro, cidade, estado), observações.

---

## Cadastro de Persianas

Cada cliente pode possuir várias persianas, cadastradas na própria tela de detalhe do cliente.

Campos:

* Ambiente
* Tipo
* Quantidade
* Observações

Ambiente e Tipo são listas fechadas, validadas na aplicação.

Exclusão lógica (campo `ativo`).

---

## Ordem de Serviço

Cada Ordem de Serviço possui:

* Número automático no formato `OS-AAAA-000001`
* Cliente
* Persianas (itens com quantidade)
* Valores (total, manutenção, desconto, forma de pagamento, valor final)
* Responsável
* Datas (abertura, previsão de entrega, finalização)
* Status
* Observações

Status possíveis: Retirada Agendada, Agendado, Finalizado, Cancelado.

Funcionalidades:

* Cálculo automático do valor a partir da Tabela de Preços (o usuário pode ajustar manualmente).
* Geração de PDF.
* Cancelamento (mantém o registro, altera o status).
* Bloqueio de mais de uma Ordem de Serviço em aberto por cliente.
* Envio da Ordem de Serviço por WhatsApp, com o PDF anexado, disparado manualmente pelo usuário na tela de detalhe.

---

## Propostas Comerciais

Orçamento rápido para o atendimento inicial (ex.: pelo WhatsApp), sem exigir cliente ou
persiana já cadastrados.

Cada proposta possui:

* Número automático no formato `PROP-AAAA-000001`
* Nome e WhatsApp do cliente (texto livre, opcional — não cria cadastro)
* Itens (tipo de persiana, quantidade, valor unitário obtido da Tabela de Preços vigente,
  com possibilidade de ajuste manual e motivo obrigatório)
* Subtotal, desconto e valor final calculados automaticamente
* Validade em dias (padrão 15, editável)
* Observações (sugestão padrão: "Valores sujeitos à confirmação após visita técnica.")
* Status: Rascunho, Enviada, Aceita, Recusada, Expirada (expirada é calculada pela data de
  validade, não alterada no banco)

Funcionalidades:

* Geração de PDF, no mesmo padrão visual da Ordem de Serviço.
* **Gerar OS**: com a proposta em status "Aceita", converte os dados em uma nova Ordem de
  Serviço, aproveitando cliente e persianas já negociados.
  * Se não existir cliente com o WhatsApp da proposta, a tela de cadastro de cliente abre
    pré-preenchida antes de continuar.
  * Se faltar alguma persiana do tipo da proposta para o cliente, a tela de detalhe do
    cliente pede o Ambiente (único dado que a proposta não guarda) antes de seguir para a OS.

---

## Tabela de Preços

O sistema permite configurar preços por:

* Tipo da persiana
* Valor unitário (cobrança por unidade/peça)
* Valor de manutenção (caso a persiana precise de algum concerto)

Regras:

* O cálculo da Ordem de Serviço é automático, com base no tipo de cada persiana.
* O usuário pode editar manualmente o valor final.
* É permitido mais de um preço cadastrado para o mesmo tipo; o cálculo usa o mais recentemente atualizado entre os ativos.

---

## Comunicação (WhatsApp)

Integração: WhatsApp Business Cloud API (oficial, Meta).

Funcionalidade implementada:

* Envio manual da Ordem de Serviço por WhatsApp, a partir da tela de detalhe da OS.
* O PDF é enviado como documento anexado, com uma mensagem de texto fixa como legenda (não configurável pela interface).
* Todo envio (sucesso ou falha) é registrado no histórico de comunicação do cliente, vinculado à Ordem de Serviço.

Limitação conhecida: em contas de WhatsApp Business em produção, mensagens iniciadas pela empresa só são entregues dentro da janela de 24h após o cliente ter mandado mensagem, ou por meio de um Message Template pré-aprovado pela Meta — isso deve ser implementado.

---

## Acesso ao Sistema

Autenticação via Supabase Auth (e-mail/senha).

* Login com e-mail e senha numérica de 6 dígitos.
* Cadastro de novo usuário protegido por código de acesso (só quem tem o código da empresa
  consegue criar uma conta).

---

## Configurações da Empresa

O sistema permite configurar:

* Logo
* Nome Fantasia
* Razão Social
* CNPJ (com máscara `00.000.000/0000-00` na interface)
* Telefone
* WhatsApp
* Email
* Endereço
* Horário de funcionamento
* Rodapé do PDF
* Cor principal

---

## PDF da Ordem de Serviço

Os PDFs possuem:

* Logo
* Dados da empresa
* Número da OS
* Dados do cliente
* Persianas
* Valores
* Espaço para assinaturas (linhas em branco, para assinatura física ou digital)
* Rodapé personalizado

---

#---

---

# Regras Gerais de Desenvolvimento

Todas as implementações devem obedecer às seguintes regras:

* Utilizar TypeScript em 100% do projeto.
* Evitar duplicação de código.
* Componentes pequenos e reutilizáveis.
* Tipagem obrigatória.
* Tratamento de erros.
* Validação de entradas.
* Código limpo.
* Comentários apenas quando realmente necessários.
* Nomenclatura consistente.

---

# Fluxo Principal

Cliente

↓

Cadastro das Persianas

↓

Ordem de Serviço (status acompanha a etapa do atendimento)

↓

Geração de PDF

↓

Envio por WhatsApp

↓

Finalização

---

# Convenções

## Número da Ordem de Serviço e da Proposta Comercial

Formato:

OS-AAAA-000001 / PROP-AAAA-000001

Exemplo:

OS-2026-000001 / PROP-2026-000001

Numeração sequencial por ano, gerada automaticamente pelo banco (uma tabela de contador por
ano para cada numeração).

---

## Datas

Formato interno:

ISO 8601

Formato exibido ao usuário:

dd/MM/yyyy

---

## Valores

Moeda:

Real (BRL)

Separador decimal:

Vírgula

---

# Objetivo do Projeto

Este projeto prioriza:

* Simplicidade de uso
* Organização
* Performance
* Facilidade de manutenção
* Escalabilidade
* Boa experiência do usuário

Toda nova funcionalidade deve seguir os padrões definidos neste documento.
