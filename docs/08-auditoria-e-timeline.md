# Auditoria e Linha do Tempo

## Objetivo

Garantir que o admin consiga visualizar uma auditoria geral do sistema, com uma linha do tempo de altera\c{c}\~oes realizadas por todos os usuarios:

- quem fez (usuario)
- o que mudou (tabela/registro/campos)
- quando mudou
- qual foi a acao (create/update/soft-delete)

## Requisito de timestamps (todas as tabelas)

Todas as tabelas do dominio devem conter:

- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `deleted_at timestamptz null`

Recomendado (para completar o rastro):

- `created_by text null` (Clerk user id)
- `updated_by text null`
- `deleted_by text null`

### Soft delete

Nao apagar registros com `delete` no MVP. Em vez disso:

- "remover" = `deleted_at = now()` (e opcionalmente `deleted_by = current_user_id()`)
- consultas padrao sempre filtram `deleted_at is null`

Beneficios:

- auditoria e rastreabilidade
- menor risco de perda acidental
- possibilidade de restaurar (limpando `deleted_at`)

## Linha do tempo (audit log)

Timestamps por si so indicam _quando_ algo foi criado/alterado/deletado, mas nao mostram _o que mudou_.
Para isso, manter um log de eventos.

### Tabela sugerida: audit_events

Campos recomendados:

- `id uuid primary key`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `deleted_at timestamptz null`
- `occurred_at timestamptz not null default now()`
- `actor_user_id text null` (quem fez)
- `action text not null` (`insert` | `update` | `soft_delete`)
- `table_name text not null`
- `record_id uuid null` (id do registro afetado; quando existir)
- `changes jsonb null`
- `snapshot jsonb null`

Notas:

- `audit_events` e tipicamente append-only. Mesmo assim, mantemos `created_at/updated_at/deleted_at` para seguir o padrao do projeto.
- `occurred_at` e o timestamp "de negocio" do evento. Em geral, `occurred_at` e `created_at` serao iguais.

Onde:

- `changes` guarda o diff (ex.: `{ "status": {"from": "open", "to": "paid"} }`)
- `snapshot` pode guardar a linha inteira apos a mudanca (opcional; aumenta custo de armazenamento)

### Triggers recomendados

Implementar triggers no Supabase para:

1. `updated_at`

- Antes de `update`, setar `updated_at = now()`.

2. Audit log

- Ao `insert`: criar `audit_events` com `action='insert'`.
- Ao `update`: criar `audit_events` com `action='update'` e `changes`.
- Ao soft delete (quando `deleted_at` muda de null -> nao-null): criar `audit_events` com `action='soft_delete'`.

Observacao importante:

- O `actor_user_id` deve ser derivado do JWT do request (Clerk): `auth.jwt()->>'sub'`.

## Acesso (RLS)

Recomendacao:

- `admin`: pode ler todos os `audit_events`.
- Demais perfis: opcionalmente podem ler apenas eventos em que sao `actor_user_id` (se for util), ou nenhum.

## UX: como a timeline aparece no app

Rota sugerida:

- `/admin/auditoria` (admin)

Fonte de dados sugerida:

- View `admin_timeline` (select simples sobre `audit_events`, com RLS herdado)

Filtros principais:

- periodo (hoje/7 dias/mes)
- usuario (ator)
- entidade (residentes, prescricoes, estoque, escala, financeiro)
- tipo de acao (insert/update/soft_delete)

Card de evento (mobile-first):

- horario grande
- usuario
- acao + entidade
- principais campos alterados (no max 3)
