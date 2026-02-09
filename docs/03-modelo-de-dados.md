# Modelo de Dados (proposta)

## Convenções gerais

- IDs do domínio: `uuid`.
- Identidade do usuário: `user_id text` (Clerk).
- Campos padrão:
  - `created_at timestamptz not null default now()`
  - `updated_at timestamptz not null default now()`
  - `deleted_at timestamptz null`
  - `created_by text`
  - `updated_by text`
  - `deleted_by text`
- Constraints e índices para evitar duplicidade.
- RLS habilitado em todas as tabelas abaixo.

## Soft delete (regra do projeto)

- Evitar `delete` fisico nas tabelas do dominio.
- Remoções devem ser implementadas como soft delete: setar `deleted_at = now()`.
- Consultas padrão sempre filtram `deleted_at is null`.
- Restaurar = limpar `deleted_at` (e opcionalmente `deleted_by`).

## RBAC

### app_users

- `user_id text primary key`
- `role text not null` (`admin` | `nurse` | `caregiver` | `collaborator`)
- `active boolean not null default true`

## 1) Residentes e admissão

### residents

- `id uuid primary key`
- `full_name text not null`
- `admitted_at date`
- `status text not null` (`active` | `inactive` | `discharged` | `deceased`)
- `dependency_level text`
- `diet_restrictions text`
- `mobility_notes text`
- `general_notes text`

### resident_contacts

- `id uuid primary key`
- `resident_id uuid not null references residents(id)`
- `name text not null`
- `relationship text`
- `phone text`
- `notes text`

Opcional (se quarto/leito for importante desde o início):

- `rooms (id, label)`
- `beds (id, room_id, label)`
- `resident_bed_assignments (resident_id, bed_id, from_date, to_date)`

## 2) Insumos individuais do residente

### resident_item_defs

- `id uuid primary key`
- `resident_id uuid not null references residents(id)`
- `category text not null` (`diapers` | `hygiene` | `misc`)
- `name text not null`
- `unit text` (ex: `un`, `pct`)
- `min_quantity numeric not null default 0`

### resident_item_movements

- `id uuid primary key`
- `resident_item_def_id uuid not null references resident_item_defs(id)`
- `movement_type text not null` (`in` | `out` | `adjustment`)
- `quantity numeric not null`
- `reason text`
- `occurred_at timestamptz not null default now()`

Saldo e alertas:

- View ou query agregando movimentos por `resident_item_def_id`.

## 3) Evolução / relatório de enfermagem

### nursing_reports

- `id uuid primary key`
- `resident_id uuid not null references residents(id)`
- `report_date date not null`
- `shift text not null` (`day` | `night`)
- `body text not null`

Constraint:

- `unique (resident_id, report_date, shift)`

## 4) Prescrição e checagem (MAR)

### medications

- `id uuid primary key`
- `name text not null`
- `form text` (opcional)
- `notes text`

### prescriptions (MVP com horários fixos)

- `id uuid primary key`
- `resident_id uuid not null references residents(id)`
- `medication_id uuid references medications(id)`
- `dose text not null`
- `route text`
- `times text[] not null` (ex: `{ "08:00", "14:00", "20:00" }`)
- `start_date date`
- `end_date date`
- `active boolean not null default true`
- `notes text`

### med_administrations

- `id uuid primary key`
- `resident_id uuid not null references residents(id)`
- `prescription_id uuid not null references prescriptions(id)`
- `scheduled_at timestamptz not null`
- `status text not null` (`given` | `not_given`)
- `given_at timestamptz`
- `reason_not_given text`

Snapshots recomendados (rastreabilidade mesmo se a prescrição mudar):

- `medication_name text`
- `dose_snapshot text`
- `route_snapshot text`

Constraint:

- `unique (prescription_id, scheduled_at)`

## 5) Estoque institucional de medicações

### med_inventory_movements

- `id uuid primary key`
- `medication_id uuid not null references medications(id)`
- `movement_type text not null` (`in` | `out` | `adjustment`)
- `quantity numeric not null`
- `lot text` (opcional)
- `expires_on date` (opcional)
- `reason text`
- `occurred_at timestamptz not null default now()`

Baixa automática (recomendado):

- Trigger: ao inserir `med_administrations` com `status='given'`, inserir movimento `out`.

## 6) Escala

### staff_profiles

- `id uuid primary key`
- `user_id text` (opcional; quando o profissional é usuário do sistema)
- `name text not null`
- `team text not null` (`nursing` | `caregiver` | `kitchen` | `other`)
- `active boolean not null default true`

### shifts (MVP manual)

- `id uuid primary key`
- `date date not null`
- `shift text not null` (`day` | `night`)
- `staff_id uuid not null references staff_profiles(id)`
- `amount numeric`
- `status text not null` (`pending` | `confirmed` | `paid`)
- `notes text`

Índices recomendados:

- `(date, shift)`
- `(staff_id, date)`

## 7) Financeiro do residente

### resident_billing_profiles

- `resident_id uuid primary key references residents(id)`
- `monthly_amount numeric not null`
- `due_day int not null` (recomendado: 1..28)
- `last_adjustment_at date`
- `adjustment_interval_months int not null default 12`

### invoices

- `id uuid primary key`
- `resident_id uuid not null references residents(id)`
- `competence date` (ex: primeiro dia do mês)
- `amount numeric not null`
- `due_date date not null`
- `status text not null` (`open` | `paid` | `late` | `cancelled`)

### payments

- `id uuid primary key`
- `invoice_id uuid not null references invoices(id)`
- `paid_at date not null`
- `amount numeric not null`
- `method text` (ex: `cash`, `pix`, `transfer`)
- `reference text`
