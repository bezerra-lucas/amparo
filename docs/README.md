# Docs

Este diretório documenta o planejamento e as decisões do "Sistema de Gestão Assistencial para ILPI / Residencial".

## Leitura recomendada (ordem)

1. `docs/00-visao-geral.md`
2. `docs/01-stack-e-arquitetura.md`
3. `docs/02-seguranca-rbac-rls.md`
4. `docs/03-modelo-de-dados.md`
5. `docs/04-rotas-e-navegacao.md`
6. `docs/05-ux-ui-responsivo-acessibilidade.md`
7. `docs/06-roadmap-fases.md`
8. `docs/07-padroes-de-implementacao-next-supabase.md`
9. `docs/08-auditoria-e-timeline.md`
10. `docs/09-principios-de-design.md`
11. `docs/10-identidade-visual.md`
12. `docs/11-plano-execucao-redesign-interface.md`

## Princípios do produto

- Simples e rápido para rotina assistencial (menos cliques, mais clareza).
- Perfeitamente responsivo (mobile-first), com botões grandes e acessíveis.
- Rastreabilidade: toda ação relevante registra responsável e horário.
- Sem backend próprio: persistência e segurança no Supabase (Postgres + RLS), autenticação no Clerk.
