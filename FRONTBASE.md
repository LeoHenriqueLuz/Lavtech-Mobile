# Refatoração Visual - Inspirada no Linear

Quero modernizar completamente a interface do aplicativo seguindo a linguagem visual do Linear Mobile.

## Objetivo

Transformar a UI atual em uma interface premium, minimalista e altamente profissional, semelhante ao app Linear.

## Diretrizes Visuais

### Tema
- Dark mode como padrão
- Fundo principal: preto profundo (#0A0A0A)
- Superfícies: cinza muito escuro (#111111, #171717)
- Bordas sutis (#262626)
- Alto contraste para leitura

### Tipografia
- Utilizar Inter
- Hierarquia clara:
  - Título: 24px semibold
  - Seções: 18px semibold
  - Conteúdo: 14-16px regular
- Muito espaçamento entre elementos

### Layout
- Design minimalista
- Muito espaço em branco
- Poucos elementos por tela
- Remover poluição visual
- Priorizar clareza e velocidade de uso

### Cards
- Bordas arredondadas (16px)
- Fundo escuro
- Sombras discretas
- Aparência "glass-like" suave

### Navegação
- Bottom Tabs moderna
- Ícones Lucide
- Indicador visual para aba ativa
- Transições suaves

### Animações
- React Native Reanimated
- Moti
- Fade In
- Slide In
- Microinterações em botões
- Feedback tátil com Expo Haptics

## Componentes

### Dashboard

Criar dashboard semelhante ao Linear:

- Saudação no topo
- Cards de métricas
- Ordens de serviço pendentes
- Ordens em andamento
- Faturamento do dia
- Atalhos rápidos

### Listas

Todas as listas devem seguir padrão Linear:

- Ícone à esquerda
- Título
- Subtítulo
- Status à direita
- Separação visual elegante

### Formulários

- Inputs modernos
- Labels discretas
- Foco com destaque visual
- Validação em tempo real

## Paleta

Primary: #6366F1
Success: #22C55E
Warning: #F59E0B
Danger: #EF4444
Background: #0A0A0A
Surface: #171717
Border: #262626
Text Primary: #FFFFFF
Text Secondary: #A1A1AA

## Tecnologias

Utilizar:

- Expo Router
- NativeWind
- React Native Reanimated
- Moti
- Expo Blur
- Expo Haptics
- Lucide React Native

## Resultado esperado

O aplicativo deve parecer um SaaS moderno de nível internacional, semelhante ao Linear, Stripe Dashboard ou Notion Mobile, mantendo foco em produtividade e rapidez operacional.
