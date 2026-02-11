# Identidade Visual (tema claro)

Esta base define a linguagem visual do projeto com foco em contexto assistencial: legibilidade alta, contraste claro e tom acolhedor.

## Cor primaria

- Primaria oficial: `rgba(113, 69, 40, 1)`
- Token base: `--brand-600`
- Uso prioritario:
  - botoes primarios
  - destaques de navegacao
  - foco e estados interativos

## Paleta derivada

- `--brand-50` ate `--brand-900`: escala tonal da primaria para hover, bordas, fundos e contraste
- `--surface-*`: fundos claros e camadas
- `--line-*`: bordas e divisores
- `--text-*`: hierarquia tipografica

## Tipografia

- Corpo: `Source Sans 3`
- Titulos: `Spectral`

Objetivo: equilibrar leitura rapida operacional com personalidade visual no cabecalho e nas secoes principais.

## Componentes base

- `Button`: variantes `primary`, `secondary`, `ghost`
- `Card`: superficie clara com borda suave e elevacao discreta
- `Badge`: versoes semanticas com fundos leves
- `Input`, `Select`, `Textarea`: foco com anel da cor primaria

## Ambiente visual

- Tema claro com gradientes quentes muito sutis no fundo
- Navegacao com identidade de marca e links em formato pill
- Animacao curta de entrada em `main` para dar ritmo sem distrair

## Regra de evolucao

- Manter a primaria como ancora visual
- Evitar novas cores de destaque sem token
- Qualquer extensao deve nascer em token CSS e depois virar utilitario Tailwind
