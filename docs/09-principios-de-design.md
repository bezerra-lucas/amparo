# Principios de Design (simplicidade, clareza, eficiencia)

Este documento define regras de interface para manter o sistema simples e intuitivo, especialmente em rotinas assistenciais (pressa, toque, interrupcoes frequentes).

## Objetivo

- Reduzir carga cognitiva: menos decisao por tela, menos elementos simultaneos.
- Aumentar velocidade de operacao: a acao certa deve ser obvia.
- Evitar erros: estados claros, confirmacoes quando necessario.

## Principios e teorias que guiam as decisoes

### 1) Lei de Hick (Hick's Law)

Quanto mais opcoes simultaneas, mais tempo para decidir.

Aplicacao:

- Preferir 1 acao primaria por tela (ou por card), e poucas secundarias.
- Evitar colocar "tudo" aberto ao mesmo tempo; usar divulgacao progressiva.

### 2) Lei de Fitts (Fitts's Law)

Tempo para tocar/clicar depende do tamanho do alvo e distancia.

Aplicacao:

- Botoes grandes (minimo 44x44px) e proximos do foco de atencao.
- Acoes operacionais (ex.: MAR) devem ficar no card do horario/medicacao, sem menus escondidos.

### 3) Divulgacao progressiva (Progressive Disclosure)

Mostrar primeiro o essencial; o detalhe aparece quando o usuario pede.

Aplicacao:

- Usar secoes recolhiveis para conteudo secundario (ex.: Prescricoes, Financeiro).
- Manter MAR e itens do turno como primeiro nivel.

### 4) Reconhecimento vs lembranca (Recognition over Recall)

Usuarios operacionais trabalham melhor reconhecendo opcoes do que lembrando regras.

Aplicacao:

- Status sempre explicito: "Pendente", "Administrado", "Nao administrado".
- Evitar depender de codigos/abreviacoes sem contexto.

### 5) Heuristicas de Nielsen (resumo)

- Visibilidade do status do sistema: feedback imediato em acoes.
- Consistencia: mesmos rotulos e mesma ordem de campos.
- Prevencao de erro: confirmacao em acoes irreversiveis; defaults seguros.

## Regras praticas (para todas as telas)

### Hierarquia e conteudo

- Primeiro bloco: objetivo da tela + acao principal.
- Segundo bloco: lista/operacao do dia.
- Restante: informacao secundaria em secoes recolhiveis.

### Densidade

- Evitar "telas longas" com muitos modulos abertos.
- Preferir cards simples com 3-6 linhas no max.

### Operacao por turno

- Tela inicial do perfil operacional (enfermagem/cuidadora) deve ser: selecionar residente.
- Ao abrir o residente, a tela mostra primeiro MAR/acoes do turno.

### Reduzir mudanca de contexto

- Evitar mandar o usuario para uma nova tela para uma acao pequena.
- Quando for necessario, garantir botao de voltar e breadcrumbs.

### Texto e rotulos

- Sem texto generico tipo "placeholder".
- Blueprint deve conter os elementos finais com dados mocados realistas.

## Checklist de revisao (antes de aceitar um blueprint)

- A tela tem 1 acao primaria clara?
- A lista principal esta visivel sem rolagem excessiva?
- Informacao secundaria esta recolhida/organizada?
- Status e diferencas de permissao (nurse vs caregiver) estao evidentes?
- O fluxo principal funciona so com toque (alvos grandes)?
