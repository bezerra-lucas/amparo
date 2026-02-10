# Rotas e Navegação

## Objetivo de navegação

- Menos itens, mais claros.
- Mobile-first: navegação pelo polegar.
- Telas operacionais (checagem/evolução) com a ação principal sempre visível.

## Mapa de rotas (sugestão)

Públicas:

- `/sign-in`
- `/sign-up`

Protegidas:

- `/shift` (tela inicial operacional para enfermagem/cuidadora)
- `/shift/[id]` (tela operacional do residente no turno)
- `/dashboard`
- `/residents`
- `/residents/[id]`
  - seções/abas:
    - Admissão
    - Insumos
    - Evolução (Dia/Noite)
    - Prescrições
    - Checagem hoje (MAR)
    - Financeiro (admin)
- `/medications`
- `/schedule`
- `/admin/users` (admin)
- `/access-pending` (usuário sem permissão/role)

## Navegação responsiva

Mobile:

- Bottom navigation (máx 5 itens):
  - Dashboard
  - Residentes
  - Checagem (atalho para "hoje")
  - Escala
  - Mais (medicações/admin/etc)

Desktop:

- Sidebar fixa com os mesmos itens.
- Conteúdo com largura máxima para evitar linhas longas.

## Padrões por tela

- Listas no mobile: cards, não tabelas.
- Detalhes: tabs viram segmented control/pills no mobile.
- Ações críticas: confirmação clara e feedback rápido (toast).
