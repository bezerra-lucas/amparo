# Padrões de Implementação (Next.js + Supabase + Clerk)

## Objetivo

Padronizar como o app fala com o Supabase e como implementamos telas simples, responsivas e seguras.

## Cliente Supabase com Clerk

- Client-side:
  - criar Supabase client com `accessToken: () => session.getToken()`
- Server-side (SSR / Server Actions):
  - criar Supabase client com `accessToken: () => auth().getToken()`

Regra: nunca expor service role key.

## Leitura vs escrita

- Leitura (listas/detalhes): preferir Server Components para reduzir complexidade no client.
- Escrita (create/update): preferir Server Actions com:
  - validação Zod
  - chamada ao Supabase
  - refresh/revalidate

## Validação

- Schemas Zod por formulário.
- Erros:
  - mapear erros de validação para campos
  - mapear erros do Supabase (RLS/constraints) para mensagens claras

## Padrão de UI para formulários

- Inputs com labels.
- Botão primary grande, full width no mobile.
- Loading state: desabilitar botão e mostrar "Salvando...".
- Confirmação: toast ("Salvo") + atualiza lista.

## Padrão para listas (mobile-first)

- Mobile: Card list (nome grande, chips de status, 1-2 ações rápidas).
- Desktop: tabela é opcional, mas com fallback para cards em breakpoints menores.

## Soft delete (padrão)

- Não usar `delete` físico em tabelas do domínio.
- Implementar "excluir" como update setando `deleted_at = now()`.
- Listagens e selects padrão sempre usam `deleted_at is null`.
- Ações de restore (se existir) limpam `deleted_at`.

## Observabilidade mínima

- Log de erros no client e no server (console no MVP; evoluir para Sentry se preciso).
- Para ações críticas, considerar registrar evento no banco (fase posterior).

## Checklist de done (por feature)

- RLS habilitado e testado (usuário sem permissão não acessa).
- Mobile 360px funcionando (sem overflow).
- Botões >= 44px e navegação acessível.
- Estados e mensagens claras (não depender só de cor).
