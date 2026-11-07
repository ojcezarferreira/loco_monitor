# Loco Monitor design system

Status: approved by maintainer @ojcezarferreira on 2026-11-07 for [issue #1](https://github.com/ojcezarferreira/loco_monitor/issues/1).

Open the [interactive artifact](index.html) locally or through the [Tailscale preview](https://srv2040147.taila06542.ts.net:8444/design/). All records and operations are illustrative. This artifact does not define backend capabilities, APIs, or the architecture of issue #2.

## Direction and scope

Preserve graphite and copper, IBM Plex Sans for the interface, and IBM Plex Mono for technical content. The maintainer delegated implementation choices: use native HTML, CSS, and JavaScript without runtime dependencies. Static boards would not demonstrate interactions. A framework would anticipate the architecture decision.

## Required interaction rules

Every form must open in a modal dialog or on a dedicated page. Never embed a form inline in overview, list, detail, or component-gallery content. This includes filter forms and demonstration forms. A modal suits a short focused task. Use a dedicated page for long or complex forms. Standalone appearance and review-scenario selectors apply immediately and are not grouped forms.

Modal forms have a visible title, persistent field labels, explicit Cancel and Submit actions, and keyboard access. Escape cancels. Closing restores focus to the trigger. Cancel discards draft values; applying filters preserves committed values when returning from details. Use native `dialog.showModal()` so the background becomes inert.

Show operation confirmations and failures in toast notifications. Use `role="status"` for success and `role="alert"` for errors. Keep live regions available before updating their text. Do not move focus to a toast. Place toasts at the bottom right, within the mobile viewport. Each severity has one message slot; a new message of the same severity replaces the previous message. Success and error may coexist. Messages stay visible until dismissed; there is no reading deadline. Dismissal returns focus to main content if its button had focus. Colors follow the existing semantic pairs.

Validation stays within the modal or dedicated form page. Associate field guidance with `aria-describedby` and mark invalid fields with `aria-invalid`. An invalid submit keeps the form open and focuses the first invalid field. Do not use a background toast as the only explanation for a modal field error. Operation outcomes close the modal before showing a toast.

Page loading failures also retain a persistent content state with recovery guidance. A toast supplements that state. Confirmation dialogs still protect consequential actions; outcome toasts do not replace confirmation before the action.

## Measures and typography

Spacing scale: 4, 8, 12, 16, 24, 32, and 48 px. Control padding: 8 × 12 px. Panel padding: 24 px, or 16 px on narrow layouts. Table cells: 12 × 16 px. Section gap: 32 px. Controls have a 44 px minimum height. Control radius: 6 px; panel radius: 8 px.

Page titles use Sans 600 at 24–28 px; section titles use 500/600 at 16–18 px. Body text is 14 px. Technical data uses Mono at 12–13 px. Use tabular numerals in numeric columns. Tokens remain scoped by `data-loco-monitor-theme`.

Icons are authored SVG on a 24 px grid, with 1.75 px strokes, rounded ends, and no fill. Render at 16 or 20 px. Actions need accessible labels. Icon-only actions use a 44 × 44 px target, an explicit `aria-label`, and a native hover title. Hide decorative SVG from assistive technology. Use an eye for opening queue jobs, an arrow before Back, a filter for filter entry, and a circular arrow for retry/reset. Toast dismissal uses a close icon in the upper-right corner; keep its accessible name. Badges combine a label and icon with semantic color: blue execution, green success, amber retry/warning, red error, violet scheduled, and neutral queued/intentional pause.

## Components and screens

| Component | Required states and behavior |
|---|---|
| Button | Default, hover, visible focus, pressed/selected, disabled, and pending with a text label |
| Field/select | Persistent label, control border, focus, value, disabled, and associated validation; always inside a modal or dedicated form page |
| Navigation | Current view uses `aria-current`, copper, a subtle background, and heavier weight |
| Table | Scoped headers, explicit detail actions, neutral hover, and keyboard-accessible local horizontal scrolling |
| Toast | Success/status, error/alert, dismissible, persistent, no focus stealing, semantic colors |
| Dialog | Named modal, explicit cancellation, Escape support, and focus restoration |

Overview shows queues with counts derived from the same six sample jobs. Opening jobs from a queue commits its queue filter. The job list shows a filter summary and an action that opens the filter modal. Search, queue, and state filters combine. Details show the ID, worker, queue, attempts, timestamp, payload, error, and simulated retry confirmation.

The component gallery opens form and operation examples in modals. It also shows badges, typography, spacing, and vector brand specimens. Demonstration fields do not define product configuration.

Loading, empty, unavailable, failed, and permission-denied scenarios remove stale tables and payloads. No results after filtering differs from an initially empty dataset. Unavailable data is not labeled current. Errors offer retry. Permission denial explains how to request access. Scenario selection is a review-only control, not product functionality.

## Responsive layout and accessibility

Below 720 px, navigation wraps and panels use 16 px padding. Content works at 320 px; only tables scroll horizontally. Dialogs and toasts stay within the viewport. Use a skip link, natural Tab order, native controls, and a visible 2 px focus ring with a 3 px offset. State information never depends on color alone. No motion is required.

Target WCAG 2.2 AA: normal text 4.5:1 and required control identification 3:1. Automated checks and accessibility-tree inspection do not replace real screen-reader testing.

## Language and appearance

All repository documentation must be written in English. Preserve third-party license text. The artifact UI remains pt-BR for maintainer review; documentation language does not change product localization.

Proposed initial product locale: English, with pt-BR as the first translation. Extract complete messages by key, support plurals, and avoid sentence concatenation. Use Intl for locale-specific numbers and dates. Display UTC explicitly and provide complete ISO 8601 timestamps in details. Do not translate IDs or payloads. The maintainer approved this localization direction on 2026-11-07.

Start with System appearance. Explicit Light/Dark choices take precedence and persist locally when storage works. System follows media changes. Storage failure must leave controls usable.

## Brand and font assets

The [SVG master](../brand/logos/loco-monitor-master.svg) traces the original light horizontal PNG, with separate symbol and lettering geometry. Theme exports share geometry and contain no raster images or external fonts. The silhouette comparison at original resolution produced 99.23% intersection over union. This metric checks geometry preservation, not visual approval.

[Icons](../brand/icons/) include an adaptive SVG favicon, ICO at 16/32/48 px, and light/dark PNGs at 16/24/32/48/180/192/512 px. Symbol exports derive from the master with safety padding. The gallery shows 16/24/32 px specimens. Original PNGs remain historical references.

[Local fonts](../brand/fonts/) contain complete WOFF2 Sans 400/500/600 and Mono 400/500 files, unchanged OFL licenses, and a [source/hash manifest](../brand/fonts/sources.json). No external font service is required.

Regenerate exports from the repository root with `python3 scripts/design/export-brand.py`, using Pillow, CairoSVG, and potrace 1.16. The master keeps the original 2172 × 724 canvas. Monochrome SVG names describe the destination theme; historical monochrome PNG names describe ink.

## Verification and approval

See the [verification report](verification/README.md) and [repeatable browser checks](verification/browser-check.js).

- [x] Build overview, list, details, filters, confirmation, feedback, and component specimens.
- [x] Supply local fonts, SVG master, favicon, and icon exports.
- [x] Define modal/dedicated-page forms and toast feedback.
- [ ] Complete real screen-reader review with NVDA or VoiceOver.
- [x] Obtain explicit maintainer approval of screens, brand, components, and localization (2026-11-07).
- [x] Record maintainer identity and approval date here; link the published commit in issue #1 at closure.

The maintainer explicitly approved the reviewed artifact and authorized commit, push, and issue closure on 2026-11-07. Real screen-reader testing remains unperformed and is recorded as follow-up, not as completed validation. Design acceptance is complete; product implementation still requires the architecture decision in issue #2.

## References

- [Brand guide](../brand/README.md)
- [Native modal dialogs](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal)
- [Status messages](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role)
- [Alert messages](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/alert_role)


## Usability review: direction and recognition

The review applies [revenue-centric-design](https://x.com/richardrx/status/2000930776636940333) to an engineering workflow: prioritize scanning and the next useful action. No revenue or retention improvement is claimed without usage evidence.

- **Attention hierarchy:** one visible filter entry action, with committed filter context nearby. Hide Clear filters when no filters are active. After clearing, return focus to the filter trigger rather than a hidden control.
- **Recognition and consistency:** use the same outlined SVG system for view, back, filter, retry, edit, confirmation, and dismissal. Retain text on actions whose meaning needs explanation. Eye and close actions keep explicit accessible names.
- **Feedback clarity:** toast headings identify Confirmation or Error; a semantic icon reinforces the label. Dismissal stays in the upper-right corner. Field errors remain in their form.
- **Feature discipline:** improve existing paths instead of adding indicators or navigation. Gallery buttons now demonstrate feedback, and the selected-state sample toggles.

Sources: [actionable dashboard](https://x.com/richardrx/status/2075623473565647202), [attention hierarchy](https://x.com/richardrx/status/2039399756452057159), and [improve core flows](https://x.com/richardrx/status/2072718071060447691).
