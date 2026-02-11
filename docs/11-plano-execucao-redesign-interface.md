# Plano de Execucao - Redesign de Interface

## Objetivo

Evoluir o produto do estado atual de blueprint para uma interface operacional pronta para MVP, mantendo os principios do projeto:

- simples = melhor
- menos informacoes por tela
- identidade visual forte e consistente
- uso inteligente de icones

Este plano segue as diretrizes ja definidas em:

- `docs/04-rotas-e-navegacao.md`
- `docs/05-ux-ui-responsivo-acessibilidade.md`
- `docs/09-principios-de-design.md`
- `docs/10-identidade-visual.md`
- `docs/06-roadmap-fases.md`

## Diretrizes de design para toda implementacao

1. Uma acao primaria por tela (ou por card principal).
2. Mostrar o essencial primeiro; detalhes em secoes recolhiveis.
3. Mobile-first com alvos de toque >= 44x44px.
4. Sempre combinar status com texto + icone + badge (nao apenas cor).
5. Unificar todas as cores em tokens da marca (`brand`, `surface`, `ink`, `line`).
6. Remover linguagem de prototipo da UI (ex.: "Blueprint").

## Escopo do redesign

### Incluido

- Navegacao global (mobile + desktop)
- Refino visual das paginas do modulo `(app)`
- Criacao dos componentes ausentes do design system
- Simplificacao de densidade de conteudo (menos campos visiveis por vez)
- Padronizacao de iconografia funcional

### Nao incluido neste ciclo

- Regras de negocio novas no backend
- Integracoes externas
- Mudanca de escopo funcional dos modulos

## Plano por sprint

## Sprint 1 - Fundacao visual e navegacao (1 semana)

### Objetivo

Estabelecer a base visual final e tornar a navegacao previsivel no mobile e desktop.

### Entregas

- Implementar `BottomNav` mobile com no maximo 5 itens:
  - Painel
  - Residentes
  - Checagem
  - Escala
  - Mais
- Manter navegacao desktop simplificada e consistente com os mesmos grupos.
- Criar componente `SegmentedControl` (turno, filtros simples).
- Criar componente `Toast` para feedback de acao.
- Criar componente `EmptyState` para telas sem dados.
- Revisar componentes base para garantir altura e toque confortavel:
  - `Button`
  - `Input`
  - `Select`
  - `Textarea`
- Trocar classes visuais fora da identidade (ex.: `slate/*`, `white`) por tokens do tema.

### Critérios de aceite

- Navegacao principal funcional em 360px sem overflow horizontal.
- Bottom nav presente no mobile e legivel com uma mao.
- Todos os estados de feedback com texto claro e icone semantico.
- Nenhuma tela principal usando classes de cor fora dos tokens definidos.

## Sprint 2 - Fluxo assistencial (turno, MAR, residente) (1 a 1.5 semana)

### Objetivo

Transformar o fluxo operacional em experiencia rapida de execucao no plantao.

### Entregas

- Revisar `/shift` para foco em selecao rapida de residente e contexto do turno.
- Revisar `/shift/[id]` com foco em MAR:
  - Cards de horario com hierarquia clara.
  - Dois botoes principais grandes: "Administrado" e "Nao administrado".
  - `Sheet` para motivo quando "Nao administrado".
  - Barra de acao fixa no mobile para salvar/confirmar onde fizer sentido.
- Revisar `/residents` com cards compactos:
  - Nome
  - Quarto/leito
  - Status
  - 1 alerta principal
- Revisar `/residents/[id]` com navegacao segmentada por contexto:
  - Checagem hoje
  - Evolucao
  - Prescricoes
  - Insumos
  - Financeiro (admin)

### Critérios de aceite

- A principal tarefa do plantao pode ser executada em ate 3 toques apos abrir o residente.
- Informacao critica visivel sem rolagem excessiva na primeira dobra.
- Acoes de risco possuem confirmacao e feedback imediato.
- Diferenca de permissao entre `nurse` e `caregiver` esta visualmente evidente.

## Sprint 3 - Modulos de apoio (dashboard, estoque, escala, financeiro, admin) (1 semana)

### Objetivo

Reduzir ruido informacional e tornar decisoes gerenciais mais diretas.

### Entregas

- `/dashboard`: manter somente alertas e pendencias criticas + atalhos principais.
- `/medications`: separar claramente
  - estado atual do estoque
  - acao principal de movimentacao
  - historico em bloco secundario
- `/schedule`:
  - desktop com visao semanal refinada
  - mobile com lista por dia/turno (evitar dependencia de grid largo)
- `/financial`: destacar excecoes (atrasos, vencimentos, saldo em aberto).
- `/admin/users`: foco em estado da conta e alteracao de papel.
- `/admin/auditoria`: timeline com filtros simples e cards escaneaveis.

### Critérios de aceite

- Cada tela tem uma CTA primaria clara acima da dobra.
- Conteudo secundario aparece por divulgacao progressiva.
- Historicos longos usam estrutura escaneavel (cards/timeline) com filtros objetivos.
- Sem dependencia de tabela como representacao primaria no mobile.

## Sprint 4 - Qualidade de interface e consistencia final (0.5 semana)

### Objetivo

Fechar consistencia visual, acessibilidade e qualidade de implementacao.

### Entregas

- Ajustar microcopy para linguagem objetiva e operacional.
- Garantir i18n em 100% dos textos exibidos.
- Revisar foco visivel, ordem de tab e labels em formularios.
- Validar `prefers-reduced-motion` para animacoes relevantes.
- Completar testes dos novos componentes e telas alteradas.

### Critérios de aceite

- Sem texto hardcoded em componentes.
- Navegacao por teclado funcional nos fluxos principais.
- Contraste AA em textos e botoes principais.
- Suite de testes atualizada para os componentes novos/alterados.

## Backlog de componentes (prioridade)

## P0 (obrigatorio)

- `components/common/bottom-nav/bottom-nav.tsx`
- `components/common/segmented-control/segmented-control.tsx`
- `components/common/action-bar/action-bar.tsx`
- `components/common/empty-state/empty-state.tsx`
- `components/ui/toast/toast.tsx` (ou alternativa equivalente da base UI)

Todos com pasta `__test__` obrigatoria conforme convencao do projeto.

## P1 (importante)

- `components/common/status-icon-badge/status-icon-badge.tsx`
- `components/common/page-section/page-section.tsx` (padronizar bloco de tela)

## Checklist por rota

## `/dashboard`

- Reduzir para no maximo 3 blocos principais.
- Exibir apenas pendencias do dia e proximas acoes.
- Garantir atalho direto para checagem do turno.

## `/shift`

- Busca de residente visivel no topo.
- Cards curtos e clicaveis com status imediato.
- Perfil de atuacao (`nurse`/`caregiver`) acessivel por segmented control.

## `/shift/[id]`

- MAR como primeiro bloco da tela.
- Botoes grandes e proximos ao item de medicacao.
- Fluxo de "Nao administrado" com motivo em sheet.

## `/residents`

- Lista compacta e escaneavel.
- Filtros essenciais no topo sem poluicao visual.
- Abertura de detalhe com CTA unica por card.

## `/residents/[id]`

- Navegacao por contexto em vez de muitos blocos abertos.
- Separar claramente dados cadastrais de operacao diaria.
- Mostrar alertas clinicos no topo (sem excesso de texto).

## `/medications`

- Estado de estoque em destaque com badge semantica.
- Registro de movimento com formulario enxuto.
- Historico de movimento como bloco secundario.

## `/schedule`

- Desktop: grade semanal clara.
- Mobile: lista por periodo para evitar scroll horizontal extenso.
- Legenda de papel profissional sempre visivel.

## `/financial`

- Priorizar status financeiro por excecao.
- Totais resumidos no topo.
- Acoes de fechamento/exportacao agrupadas e claras.

## `/admin/users`

- Listagem simples com status de acesso.
- Edicao de papel com fluxo curto e feedback.

## `/admin/auditoria`

- Filtros minimos (periodo, usuario, acao).
- Timeline em cards com "quem", "o que" e "quando".

## `/access-pending`

- Mensagem objetiva sobre situacao atual.
- Proxima acao clara para o usuario.

## Estrategia de iconografia (uso inteligente)

1. Icone de contexto (modulo): identifica area da acao.
2. Icone de estado: reforca semantica de sucesso/alerta/erro.
3. Icone de acao primaria: usado apenas quando aumenta reconhecimento.

Regras:

- Nao usar icone apenas decorativo em excesso.
- Priorizar consistencia do mesmo icone para o mesmo significado.
- Sempre manter rotulo textual junto de icones criticos.

## Mapa de riscos e mitigacoes

- Risco: excesso de refactor visual em paralelo aos modulos funcionais.
  - Mitigacao: executar por rota, com entregas incrementais por sprint.
- Risco: regressao de acessibilidade.
  - Mitigacao: checklist de acessibilidade por PR + testes.
- Risco: inconsistencias de i18n.
  - Mitigacao: bloquear merge de texto hardcoded nas telas alteradas.

## Metricas de sucesso da interface

- Reducao de cliques no fluxo MAR (meta: <= 3 cliques para acao principal).
- Reducao de elementos visiveis por tela (meta: -30% em telas mais densas).
- Tempo medio para registrar administracao (meta: menor que baseline atual).
- Zero overflow em 360px nas rotas principais.

## Definicao de pronto (DoD) para cada tela revisada

- Segue tokens visuais oficiais e identidade da marca.
- Mantem principio "essencial primeiro".
- Tem estado vazio, carregando e erro com feedback claro.
- Funciona mobile-first e desktop.
- Sem texto hardcoded; i18n aplicado.
- Testes atualizados para componentes e comportamento principal.
