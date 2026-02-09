# Visão Geral

## Objetivo

Sistema web para ILPI/residencial geriátrico que substitui controles manuais (papel/planilhas) por um ambiente único, com foco em:

- simplicidade operacional
- rastreabilidade (quem fez o quê, quando)
- aderência ao fluxo real (turnos, checagens, estoque, escala, financeiro básico)

## Escopo (módulos)

### 1) Cadastro do residente e admissão

- dados pessoais e contato de responsáveis
- data de admissão, quarto/leito
- grau de dependência
- restrições alimentares e mobilidade
- observações gerais
- cadastro de condições (patologias, síndromes, etc.)
- histórico médico geral e cirúrgico

Inclui controle individualizado de fraldas, materiais de higiene e outros insumos por residente:

- cadastro de itens por residente
- registro de entrada (quando a família traz)
- registro de consumo
- alerta de reposição por residente

### 2) Evolução / relatório de enfermagem

- dois relatórios por dia por residente (Turno Dia e Turno Noite)
- texto corrido
- registro do profissional responsável
- histórico cronológico

### 3) Prescrição e checagem (MAR)

- prescrição por residente (medicamento, dose, frequência e horários)
- geração automática dos horários (quando aplicável)
- grade diária de checagem por horário
- registro de administração ou não administração
- responsável e horário real

### 4) Controle de estoque de medicações (perfil admin; nurse opcional)

- cadastro de medicamentos
- entrada e saída de estoque
- baixa automática ao administrar medicação (recomendado via trigger)
- alerta de estoque mínimo
- histórico de movimentações

### 5) Escala de serviços (admin)

- escala por dia e turno (Dia/Noite)
- visualização por equipe (enfermagem, cuidadoras, cozinheiras, outros)
- ajustes manuais (extra, substituição, falta)
- fechamento mensal por profissional
- controle de status: pendente, confirmado e pago

### 6) Financeiro do residente (admin)

- valor da mensalidade
- data de vencimento
- registro de pagamentos
- controle de parcelas em aberto, pagas ou atrasadas
- alerta de reajuste anual

## Recursos transversais

- controle de acesso por perfil de usuário
- registro de responsável em ações relevantes
- histórico e rastreabilidade
- interface simples e adaptada à rotina assistencial

## Não objetivos (por enquanto)

- faturamento fiscal/contábil complexo
- prontuário completo com padrões de interoperabilidade
- integrações externas (bancos/ERPs) no MVP
