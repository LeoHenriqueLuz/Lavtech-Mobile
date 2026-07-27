# LavTech

Aplicativo mobile **proprietário** de uso interno para gestão de clientes, persianas,
propostas comerciais e ordens de serviço de uma empresa especializada em limpeza e
manutenção de persianas.

> Software proprietário — uso exclusivo interno. Não distribuir.

## Stack

- [Expo](https://expo.dev) (SDK 57) + [Expo Router](https://docs.expo.dev/router/introduction/) — React Native com roteamento por arquivos
- TypeScript em modo estrito
- [Supabase](https://supabase.com) — banco de dados (Postgres), autenticação e Storage
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) — formulários e validação
- [TanStack Query](https://tanstack.com/query) — estado do servidor
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) + [Moti](https://moti.fyi) — animações
- [Lucide](https://lucide.dev) — ícones

## Funcionalidades

- Login e cadastro de usuário (Supabase Auth), cadastro protegido por código de acesso
- Cadastro de clientes com endereço (busca automática por CEP) e exclusão lógica
- Cadastro de persianas por cliente (ambiente, tipo, quantidade), com listas fechadas de
  Ambiente e Tipo
- Tabela de Preços por tipo de persiana, com histórico de preço vigente
- Propostas Comerciais (`PROP-AAAA-000001`) para orçamento rápido sem cliente/persiana
  cadastrados, com geração de PDF e conversão em Ordem de Serviço quando aceita
- Ordens de Serviço com numeração automática (`OS-AAAA-000001`), cálculo automático de
  valores a partir da Tabela de Preços e ajuste manual por item (com motivo obrigatório)
- Lembrete local (notificação push) de reinstalação agendada, 1 dia antes da previsão de entrega
- Dashboard com indicadores de OS em aberto e faturamento do dia

## Pré-requisitos

- [Node.js](https://nodejs.org) 20+
- Uma conta e projeto no [Supabase](https://supabase.com)
- [Expo Go](https://expo.dev/go) no celular (opcional, para testar em dispositivo físico)

## Configuração

1. Instale as dependências:

   ```powershell
   npm install
   ```

2. Copie o arquivo de variáveis de ambiente e preencha com as credenciais do seu projeto
   Supabase (disponíveis em *Project Settings → API*):

   ```powershell
   Copy-Item .env.example .env
   ```

   ```
   EXPO_PUBLIC_SUPABASE_URL=
   EXPO_PUBLIC_SUPABASE_ANON_KEY=
   ```

3. Aplique as migrations no projeto Supabase vinculado:

   ```powershell
   npx supabase link --project-ref <seu-project-ref>
   npx supabase db push
   ```

## Executando o projeto

```powershell
npm start        # abre o Metro Bundler (escaneie o QR code com o Expo Go)
npm run web       # roda no navegador
npm run android   # roda em emulador/dispositivo Android
npm run ios       # roda em simulador/dispositivo iOS
```

## Scripts

| Comando            | Descrição                              |
| ------------------- | --------------------------------------- |
| `npm run lint`      | ESLint                                  |
| `npm run format`    | Formata o código com Prettier           |
| `npm run typecheck` | Checagem de tipos com `tsc --noEmit`    |

Após qualquer alteração de schema no Supabase, regenere os tipos:

```powershell
npx supabase gen types typescript --linked > src\types\database.ts
```

## Estrutura do projeto

```
app/
  (auth)/                Rotas de login e cadastro
  (app)/                 Rotas autenticadas (Expo Router)
src/
  components/            Componentes de UI reutilizáveis (Screen, Card, AppButton, ...)
  features/               Lógica de negócio por domínio (cadastro, clientes, persianas,
                          tabela-precos, propostas, ordens-servico, catalogos, dashboard,
                          configuracoes, empresa)
  theme/                  Tokens de design (cores, tipografia, espaçamento)
  lib/                    Configuração de clients externos (Supabase)
  types/                  Tipos gerados/compartilhados
  utils/                  Funções utilitárias
supabase/migrations/      Migrations SQL do banco
```

## Documentação interna

- [`PROJECT.md`](./PROJECT.md) — especificação funcional completa do produto
- [`FRONTBASE.md`](./FRONTBASE.md) — guia de design visual (paleta, tipografia, componentes)
- [`CLAUDE.md`](./CLAUDE.md) — diretrizes de desenvolvimento do projeto
