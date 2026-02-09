# Stack e Arquitetura

## Premissas

- Single-tenant: uma única ILPI.
- Sem backend próprio: sem API customizada para regras de negócio; Supabase (Postgres + RLS + triggers/funções) cobre persistência e autorização.
- Next.js é usado para UI e orquestração (SSR/RSC + Server Actions quando fizer sentido).

## Stack

- Next.js (App Router) + TypeScript
- Supabase
  - Postgres como fonte de verdade
  - Row Level Security (RLS) em todas as tabelas do domínio
  - triggers/constraints para integridade e rastreabilidade
  - views para dashboards/alertas quando ajudar
- Clerk
  - autenticação
  - token do Clerk aceito no Supabase via Third-party Auth (Clerk)
- UI
  - Tailwind CSS (recomendado)
  - componentes acessíveis (Radix/shadcn como base)
  - design system mínimo com tamanhos grandes e consistentes

## Direção visual

- Cores intencionais com tokens via CSS variables.
- Cor principal do projeto: `rgba(113, 69, 40, 0.95)`.

## Estratégia de dados no front

- Leitura: preferir Server Components (SSR) para telas de consulta.
- Escrita: preferir Server Actions para mutações com validação (Zod) e revalidação de rotas.
- Telas operacionais (checagem): client-side é aceitável quando melhora a velocidade, mantendo RLS como fonte de segurança.

## Observações de segurança

- Nunca usar service role key no browser.
- Nunca confiar em checagens de role no frontend como segurança; o que manda é RLS.
