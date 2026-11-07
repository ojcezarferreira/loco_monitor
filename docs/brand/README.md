# Loco Monitor — identidade visual

Referência de marca, cores, tipografia e acabamento para a [issue #1 — Define the visual identity and design system](https://github.com/ojcezarferreira/loco_monitor/issues/1).

A direção consolidada é **grafite + cobre**, com **IBM Plex Sans** na interface e **IBM Plex Mono** no conteúdo técnico. A cor da marca identifica ações, seleção e foco; as cores de estado comunicam a operação.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./logos/loco-monitor-horizontal-dark.png">
  <img alt="Loco Monitor" src="./logos/loco-monitor-horizontal-light.png" width="680">
</picture>

## Arquivos

| Arquivo | Uso |
|---|---|
| [tokens.json](./tokens.json) | Referência estruturada de cores, papéis semânticos, fontes, faixas tipográficas e decisões pendentes. |
| [tokens.css](./tokens.css) | Custom properties com prefixo `--lm-`, escopadas pelo atributo de tema. |
| [logos/loco-monitor-horizontal-light.png](./logos/loco-monitor-horizontal-light.png) | Assinatura horizontal para fundos claros: símbolo cobre fechado e nome em grafite. |
| [logos/loco-monitor-horizontal-dark.png](./logos/loco-monitor-horizontal-dark.png) | Assinatura horizontal para fundos escuros: símbolo cobre luminoso e nome claro. |
| [logos/loco-monitor-symbol-light.png](./logos/loco-monitor-symbol-light.png) | Símbolo LM isolado para fundos claros. |
| [logos/loco-monitor-symbol-dark.png](./logos/loco-monitor-symbol-dark.png) | Símbolo LM isolado para fundos escuros. |
| [logos/loco-monitor-monochrome-dark.png](./logos/loco-monitor-monochrome-dark.png) | Assinatura de tinta grafite, para aplicação sobre fundos claros. |
| [logos/loco-monitor-monochrome-light.png](./logos/loco-monitor-monochrome-light.png) | Assinatura de tinta branca, para aplicação sobre fundos escuros. |

Nas variantes monocromáticas, `dark` e `light` descrevem **a tinta**, conforme os nomes dos arquivos. Nas variantes horizontal e symbol, descrevem **o tema de destino**.

As logos são **PNG com transparência**, em formato raster. O lettering está integrado à imagem; as fontes reais da interface devem ser carregadas pelos próprios arquivos WOFF2. Para uma futura versão vetorial, preservar a geometria da marca ao vetorizar; um PNG embutido em SVG continua sendo raster.

## Aplicação dos tokens

Carregar `tokens.css` pelo fluxo de assets definido na implementação e aplicar o atributo ao contêiner do Loco Monitor:

```html
<section data-loco-monitor-theme="dark">
  <!-- Componentes do Loco Monitor -->
</section>
```

Os valores são herdados dentro desse contêiner. A implementação oferece **Sistema / Claro / Escuro**, começa pela preferência do sistema e resolve a aparência efetiva para `light` ou `dark` no atributo. A persistência da preferência e a integração dos componentes pertencem à implementação.

Os intervalos `min`/`max` preservam as faixas propostas, sem fixar uma escala responsiva. Escolher os valores concretos ao compor os componentes e revisar a hierarquia das telas.

### Cor

- **Cobre:** marca, ação principal, navegação selecionada, links e foco. Usar o fundo suave para destaques discretos.
- **Azul:** execução e informação operacional.
- **Verde:** conclusão bem-sucedida ou condição saudável.
- **Amarelo:** atenção ou retry após erro.
- **Vermelho:** falha ou erro.
- **Violeta:** agendamento.
- **Neutro:** fila ou pausa intencional.

Uma perda inesperada de comunicação com um worker usa atenção ou erro conforme a gravidade definida pelo produto. A parada intencional pode ser neutra. Exibir rótulos de estado e ícones adequados para que a informação também seja compreensível sem distinguir as cores.

Usar `border-subtle` em divisórias e contornos estruturais discretos. Usar `border-control` quando o contorno for necessário para identificar um campo ou controle. O foco usa o token específico `focus-ring`.

### Tipografia

| Papel | Família | Peso | Tamanho proposto |
|---|---|---|---|
| Título de página | IBM Plex Sans | 600 | 24–28 px |
| Título de seção ou painel | IBM Plex Sans | 500 ou 600 | 16–18 px |
| Texto de interface e tabelas | IBM Plex Sans | 400 | 14 px |
| Navegação, botões e labels | IBM Plex Sans | 500 | 13–14 px |
| Métricas em destaque | IBM Plex Sans | 500 | 28–32 px |
| Descrições e metadados | IBM Plex Sans | 400 | 12–13 px |
| IDs, workers, filas e timestamps | IBM Plex Mono | 400 ou 500 | 12–13 px |
| Logs e payloads | IBM Plex Mono | 400 | 13–14 px |

Aplicar `font-variant-numeric: tabular-nums` a números alinhados ou que mudam. Manter métricas grandes em Sans e reservar Mono para o conteúdo técnico. Empacotar os arquivos WOFF2 das fontes com os assets do dashboard, preservando os avisos de licença da distribuição.

### Acabamento

Cantos de **6–8 px**, fundos sólidos e sombras discretas, principalmente em menus e elementos sobrepostos. Títulos e métricas permanecem predominantemente neutros. Badges combinam fundo suave com texto e ícone na cor semântica correspondente.

## Contraste de referência

| Par de cores | Claro | Escuro |
|---|---:|---:|
| Texto do botão sobre a cor primária | 5,39:1 | 7,33:1 |
| Texto secundário sobre superfície de card | 5,66:1 | 7,56:1 |
| Menor contraste dos badges de estado definidos | 4,90:1 | 6,63:1 |

Os valores se referem aos pares exatos presentes em `tokens.json`. Validar contraste, foco e estados também nos componentes implementados, considerando seus fundos efetivos.

## Continuação da issue #1

A identidade acima registra as decisões já definidas. Os artefatos de interface completos ainda precisam ser detalhados, revisados e aprovados pelo mantenedor:

- Escala de espaçamento e iconografia.
- Componentes reutilizáveis e todos os seus estados.
- Overview de filas, lista de jobs, detalhes de jobs, filtros e feedback de operações.
- Loading, vazio, indisponível, erro e permissão negada.
- Layout responsivo e comportamento por teclado.
- Idiomas, localização e formatos regionais.
- Revisão dos artefatos de design e aprovação das telas completas.

O idioma deste documento não determina o idioma da interface. Decisões de arquitetura pertencem à issue #2.

## Referências

- [IBM Plex — distribuição e licença](https://github.com/IBM/plex)
- [IBM Design Language — Typeface](https://www.ibm.com/design/language/typography/typeface/)
- [WCAG 2.2 — Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [WCAG 2.2 — Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- [WCAG 2.2 — Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
