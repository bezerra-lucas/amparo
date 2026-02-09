# UX/UI: Responsivo, Simples e Acessível

## Requisitos

- Perfeitamente responsivo (mobile-first).
- Interface simples e direta.
- Botões grandes e acessíveis.
- Cores intencionais (não "default"), com contraste adequado.
- Estados não dependem apenas de cor (texto + ícone + badge).

## Métricas de usabilidade (regras práticas)

- Alvo de toque: mínimo 44x44px (ideal 48x48px).
- Altura padrão de botão: 48px (size `lg` como default).
- Inputs com altura confortável (44-48px) e labels sempre visíveis.
- Fonte base: 16-18px; evitar texto pequeno em cinza claro.
- Feedback imediato em ações: loading states + confirmação.

## Design system mínimo (componentes base)

- `Button`: primary/secondary/ghost/danger; default `lg`; `fullWidth` no mobile
- `SegmentedControl`: turno (Dia/Noite), filtros simples
- `Input` / `Textarea` / `Select`
- `Card`: container padrão no mobile
- `Badge`: status (pendente/feito/atrasado/não administrado/pago)
- `Sheet` (mobile): registrar movimentos, motivo, ajustes
- `Dialog` (desktop): equivalente do sheet
- `Toast`: confirmação rápida

## Telas operacionais (foco)

### Checagem de medicação (MAR)

- Lista por horário em blocos grandes.
- Cada item tem dois botões grandes:
  - "Administrado" (primary)
  - "Não administrado" (danger outline)
- Ao escolher "Não administrado": abrir sheet com motivo (lista curta + campo livre).
- "Atrasado" aparece com texto + badge (não apenas cor).

### Evolução (2 por dia)

- Toggle grande: Dia/Noite.
- Textarea grande.
- Botão Salvar sempre visível (barra inferior fixa no mobile quando fizer sentido).

## Cores intencionais (direção recomendada)

Direção adotada: "acolhedor-profissional" (tons terrosos + neutros quentes), com cor principal definida pelo projeto.

- Background off-white quente (menos cansativo que branco puro)
- Primary terroso para ação principal
- Danger vermelho fechado para exceções (atrasos, não administrado)
- Warning amber para alertas
- Success verde para concluído

Requisito: contraste AA para texto e botões; focus ring sempre visível.

## Tokens (variáveis CSS)

Exemplo de nomes (ajustar no início da implementação):

- `--bg`
- `--surface`
- `--text`
- `--muted`
- `--primary`
- `--primary-contrast`
- `--danger`
- `--warning`
- `--success`
- `--ring`

Cor principal (definida):

- `--primary: rgba(113, 69, 40, 0.95)`

## Acessibilidade

- Navegação por teclado funcional (tab order natural).
- `prefers-reduced-motion` respeitado.
- Labels sempre presentes (placeholder não substitui label).
- Mensagens de erro com `aria-describedby`.
- Informação crítica nunca apenas por cor.

## Responsividade (padrões)

- Evitar tabelas como representação primária; usar cards no mobile.
- Layout com `max-width` para evitar linhas longas.
- Barra de ação inferior em telas de operação (mobile).
