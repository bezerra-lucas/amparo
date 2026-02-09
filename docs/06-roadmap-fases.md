# Roadmap por Fases

## Objetivo

Entregar valor cedo (rotina assistencial) e expandir para estoque, escala e financeiro sem retrabalho.

## Fase 1 - Fundação

- Next.js + TypeScript
- Clerk auth (rotas protegidas)
- Supabase integrado com Clerk (Third-party Auth)
- Banco: `app_users` + RLS + bootstrap do primeiro admin
- Padrão de timestamps (`created_at`, `updated_at`, `deleted_at`) em todas as tabelas
- Auditoria (mínimo): `audit_events` + triggers para linha do tempo (admin)
- Layout responsivo base + componentes principais (Button/Card/Input/Sheet)

## Fase 2 - MVP assistencial (alto valor)

- Residentes (cadastro + admissão)
- Evolução enfermagem (2 por dia: dia/noite)
- Prescrição (horários fixos) + checagem do dia (MAR)
- Registro de administração / não administração (com motivo)

## Fase 3 - Insumos por residente

- Itens por residente + movimentos (entrada família, consumo)
- Alertas de reposição

## Fase 4 - Estoque de medicações

- Cadastro de medicações
- Movimentos de estoque
- Baixa automática ao administrar (trigger recomendado)
- Alertas de estoque mínimo

## Fase 5 - Escala

- Staff profiles
- Escala manual por dia/turno
- Ajustes e status (pendente/confirmado/pago)
- Visão "minha escala" para collaborator

## Fase 6 - Financeiro do residente

- Perfil de cobrança
- Faturas + pagamentos
- Alertas (atraso, reajuste anual)

## Fase 7 - Auditoria e refinamentos

- Audit log por triggers (tabelas críticas)
- Realtime opcional para telas de checagem
- PWA opcional (cache leve) se necessário
