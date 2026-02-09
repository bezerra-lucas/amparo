# Segurança, RBAC e RLS

## Visão geral

- Autenticação: Clerk
- Autorização: Supabase RLS + RBAC interno via tabela `app_users`

O usuário é identificado nas policies por:

- `auth.jwt()->>'sub'` (id do usuário no Clerk)

## RBAC (single-tenant)

Tabela central: `app_users`

- `user_id text primary key` (Clerk user id)
- `role text not null` em: `admin`, `nurse`, `caregiver`, `collaborator`
- `active boolean not null default true`
- `created_at`, `created_by`, `updated_at`, `updated_by`

## Perfis (primeiro corte)

- `admin`
  - acesso total (cadastros, estoque, escala, financeiro, usuários)
- `nurse`
  - residentes, evolução, prescrições, administração de medicações
  - estoque de medicações (recomendado: sim)
  - sem financeiro do residente
- `caregiver`
  - "só executa": checagem/administração (MAR), insumos do residente
- `collaborator`
  - escala: leitura do que for dele (e possíveis confirmações, se o fluxo pedir)

## Bootstrap (sem backend próprio)

Problema: como criar o primeiro admin se ninguém tem permissão ainda?

Solução recomendada:

- Policy especial em `app_users` permitindo inserir o primeiro registro quando a tabela estiver vazia:
  - `user_id` deve ser o próprio `auth.jwt()->>'sub'`
  - `role` obrigatoriamente `admin`
  - permitido apenas se `not exists (select 1 from app_users)`

Depois disso:

- Apenas `admin` pode inserir/alterar `role` e `active` de outros usuários.

Fluxo no app:

- Usuário loga
- App tenta ler `app_users` do usuário
  - existe e `active=true`: entra
  - não existe: tela `access-pending` com opção de inicializar (apenas se ainda não houver admin)

## Padrões de RLS

- RLS ativado em todas as tabelas do domínio.
- Negar tudo por padrão; liberar por operação (select/insert/update/delete) conforme role.

Regras conceituais (exemplos):

- Usuário ativo:
  - `exists (select 1 from app_users u where u.user_id = auth.jwt()->>'sub' and u.active)`
- Somente admin:
  - `exists (select 1 from app_users u where u.user_id = auth.jwt()->>'sub' and u.active and u.role = 'admin')`
- Admin ou nurse:
  - `u.role in ('admin','nurse')`

## Auditoria e rastreabilidade

- Para tabelas críticas, salvar sempre `created_by/created_at` e `updated_by/updated_at`.
- Todas as tabelas do domínio devem ter `created_at`, `updated_at` e `deleted_at` (soft delete).
- Recomendado: `audit_events` via triggers para manter uma linha do tempo do sistema (ver `docs/08-auditoria-e-timeline.md`).
