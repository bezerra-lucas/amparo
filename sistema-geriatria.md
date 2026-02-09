# **Sistema de Gestão Assistencial para ILPI / Residencial**

## **Visão Geral**

Sistema web de gestão assistencial e administrativa voltado para ILPIs, residenciais geriátricos e cuidados continuados. O sistema organiza a rotina clínica, assistencial, financeira e operacional, com foco em simplicidade, rastreabilidade e aderência ao fluxo real das equipes.

O objetivo é substituir controles manuais (papel/planilhas) por um ambiente digital único, reduzindo erros, melhorando a comunicação entre equipes e dando visibilidade gerencial.

---

## **Módulos do Sistema**

### **1\. Cadastro do Residente e Admissão**

Cadastro completo do residente, centralizando informações administrativas e clínicas iniciais.

**Inclui:**

- Dados pessoais e contato de responsáveis
- Data de admissão, quarto/leito
- Grau de dependência
- Restrições alimentares e mobilidade
- Observações gerais
- Cadastro de condições (patologias, síndromes, etc…)
- Histórico médico geral
- Histórico cirúrgico
- Observações clínicas relevantes

Controle individualizado de fraldas, materiais de higiene e outros insumos de cada residente.

**Inclui:**

- Cadastro de itens por residente
- Categorias: fraldas, higiene e itens diversos
- Registro de entrada quando a família traz
- Registro de consumo
- Alerta de reposição por residente

---

### **2\. Evolução e Relatório de Enfermagem e Acompanhamento Médico/Terapêutico**

Registro diário do acompanhamento assistencial por enfermagem.

**Características:**

- Dois relatórios por dia, por residente (Turno Dia e Turno Noite)
- Texto corrido
- Registro do profissional responsável
- Histórico cronológico
- Prescrição por residente (medicamento, dose, frequência e horários)
- Geração automática dos horários
- Grade diária de checagem por horário
- Registro de administração ou não administração
- Responsável e horário real

---

### **3\. Controle de Estoque de Medicações (Perfil Admin)**

Gestão do estoque institucional de medicamentos.

**Inclui:**

- Cadastro de medicamentos
- Entrada e saída de estoque
- Baixa automática ao administrar medicação
- Alerta de estoque mínimo
- Histórico de movimentações

---

### **4\. Escala de Serviços (Admin)**

Organização da escala de trabalho das equipes.

**Abrange:**

- Enfermagem
- Cuidadoras
- Cozinheiras
- Outros serviços

**Funcionalidades:**

- Escala por dia e turno (Dia / Noite)
- Visualização clara por equipe
- Histórico de alterações
- Valores distintos para plantão Dia e Noite
- Plantões gerados automaticamente a partir da escala
- Ajustes manuais (extra, substituição, falta)
- Fechamento mensal por profissional
- Controle de status: pendente, confirmado e pago

---

### **5\. Financeiro do Residente (Admin)**

Controle financeiro básico por residente.

**Inclui:**

- Valor da mensalidade
- Data de vencimento
- Registro de pagamentos
- Controle de parcelas em aberto, pagas ou atrasadas
- Alerta automático de reajuste anual (12 meses

---

## **Recursos Transversais**

- Controle de acesso por perfil de usuário
- Registro de responsável em todas as ações
- Histórico e rastreabilidade
- Interface simples e adaptada à rotina assistencial

## **Perfis**

- Administrador
- Enfermeira
  - Acesso a administrar a parte de remédios
- Cuidador
  - Só executa
- Colaborador
  - Só organização de escala, read-only da parte dele
