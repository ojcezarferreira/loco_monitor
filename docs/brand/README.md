# Loco Monitor visual identity

Brand reference for [issue #1](https://github.com/ojcezarferreira/loco_monitor/issues/1). The established direction is graphite and copper, IBM Plex Sans for interface text, and IBM Plex Mono for technical content. Copper identifies interaction; semantic colors identify operational states.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./logos/loco-monitor-horizontal-dark.svg">
  <img alt="Loco Monitor" src="./logos/loco-monitor-horizontal-light.svg" width="680">
</picture>

## Files

| Asset | Purpose |
|---|---|
| [tokens.json](tokens.json) | Structured color, typography, spacing, iconography, and localization reference |
| [tokens.css](tokens.css) | Scoped CSS properties with the `--lm-` prefix |
| [SVG master](logos/loco-monitor-master.svg) | Common editable symbol and outlined lettering geometry |
| [Light horizontal SVG](logos/loco-monitor-horizontal-light.svg) | Copper symbol and graphite lettering on light backgrounds |
| [Dark horizontal SVG](logos/loco-monitor-horizontal-dark.svg) | Bright copper symbol and light lettering on dark backgrounds |
| [Light symbol SVG](logos/loco-monitor-symbol-light.svg) / [dark symbol SVG](logos/loco-monitor-symbol-dark.svg) | Compact applications |
| [Light monochrome SVG](logos/loco-monitor-monochrome-light.svg) / [dark monochrome SVG](logos/loco-monitor-monochrome-dark.svg) | Single-ink applications; SVG names describe the destination theme |
| [Font distribution](fonts/) | Complete WOFF2 files, licenses, and source hashes |
| [Favicon and icons](icons/) | SVG, ICO, and PNG application exports |

Original PNGs remain unchanged. Historical monochrome PNG names describe ink: `dark` means graphite on light backgrounds, and `light` means white on dark backgrounds. Horizontal and symbol names describe the destination theme.

The vector master derives from the original light horizontal PNG. Both themes use the same geometry and spacing. It contains paths rather than an embedded PNG. Review the [design artifact](../design/index.html) and [verification report](../design/verification/README.md) before approving final use.

## Token usage

Load `tokens.css` through the future asset pipeline and scope the monitor container:

```html
<section data-loco-monitor-theme="dark">
  <!-- Loco Monitor components -->
</section>
```

Offer System, Light, and Dark appearance. Resolve System to `light` or `dark` for the attribute. Explicit preference takes precedence. Typography min/max values retain the agreed size ranges.

| Color | Meaning |
|---|---|
| Copper | Brand, primary action, selected navigation, links, and focus |
| Blue | Running and operational information |
| Green | Successful completion or healthy condition |
| Amber | Warning or retry after failure |
| Red | Failure or error |
| Violet | Scheduled |
| Neutral | Queued or intentionally paused |

Unexpected communication loss uses warning or error according to product severity. Use labels and icons with color. Use `border-subtle` for structure and `border-control` when a border identifies a control. Check contrast against the effective background.

## Typography and finish

| Role | Family | Weight | Size |
|---|---|---|---|
| Page title | IBM Plex Sans | 600 | 24–28 px |
| Section title | IBM Plex Sans | 500/600 | 16–18 px |
| Interface/table text | IBM Plex Sans | 400 | 14 px |
| Navigation/buttons/labels | IBM Plex Sans | 500 | 13–14 px |
| Large metrics | IBM Plex Sans | 500 | 28–32 px |
| Descriptions/metadata | IBM Plex Sans | 400 | 12–13 px |
| IDs/workers/queues/timestamps | IBM Plex Mono | 400/500 | 12–13 px |
| Logs/payloads | IBM Plex Mono | 400 | 13–14 px |

Use tabular numerals for aligned or changing numbers. Keep large metrics in Sans. Bundle WOFF2 fonts and preserve OFL notices. Use 6–8 px corners, solid surfaces, and restrained shadows for overlays. Badges combine a soft background with stronger semantic foreground.

## Reference contrast

| Pair | Light | Dark |
|---|---:|---:|
| Primary button text/background | 5.39:1 | 7.33:1 |
| Secondary text/card surface | 5.66:1 | 7.56:1 |
| Lowest proposed state badge contrast | 4.90:1 | 6.63:1 |

These ratios apply to exact token pairs. Validate final controls, focus, and states in context.

## Review artifact and interaction policy

The [design system](../design/README.md) specifies components, screens, spacing, iconography, responsiveness, keyboard behavior, localization, and acceptance. Every form must open in a modal or on a dedicated page; inline forms are forbidden. Operation success and failure use accessible, dismissible toast notifications. Field validation stays with its form.

All documentation must be written in English. The maintainer approved the design on 2026-11-07. Real screen-reader review remains a documented follow-up. Architecture decisions belong to issue #2.

## Sources

- [IBM Plex distribution and license](https://github.com/IBM/plex)
- [IBM Design Language typography](https://www.ibm.com/design/language/typography/typeface/)
- [WCAG text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [WCAG non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- [WCAG use of color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
