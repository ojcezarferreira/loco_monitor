# Design verification

Date: 2026-11-07. Browser: Chrome 157, controlled by agent-browser MCP.
Preview: https://srv2040147.taila06542.ts.net:8444/design/ (HTTPS port 8444, tailnet only).
Tailscale Serve delivers `docs/` directly. No additional development server was started.

## Current results

Full results: [results.json](results.json). Reusable checks: [browser-check.js](browser-check.js).

| Check | Result | Scope |
|---|---|---|
| Desktop behavior | 102 checks passed | 1280 × 577 viewport; both themes and all review scenarios |
| Narrow layout behavior | 102 checks passed | Same-origin iframe with a real 320 × 1100 document viewport; not a physical phone |
| Accessibility | Zero axe violations | axe-core 4.14.0, WCAG 2 A/AA, 2.1 AA, 2.2 AA; overview, jobs, and component/toast surfaces in both themes |
| Modal keyboard behavior | Escape closes and restores focus | agent-browser key input; sample form returned focus to its trigger |
| Filter behavior | Passed | Combined search/queue/state; committed filters survive details/back; input is treated as text |
| Form placement | Passed | No inline gallery inputs; filter, field, and operation forms open in modals |
| Validation | Passed | Invalid submit retains modal and focuses invalid field; valid submit closes and shows success toast |
| Toast feedback | Passed | Success/status and error/alert; focus retained; dismiss action; canceled operations do not complete later |
| Font loading | Five local WOFF2 files loaded | No external runtime requests; original font licenses preserved |
| JavaScript | Syntax valid | `node --check docs/design/preview.js` |

The audit library was injected only for verification. It is not an artifact dependency. Existing screenshot files document the earlier design review; screenshots named `toast-*` document the initial toast change; `review-*` captures show the icon review. Historical brand checks found silhouette IoU 0.9922835429662894 against the original PNG and verified English/Portuguese glyph coverage. These asset checks do not represent maintainer approval.

## Repeat the checks

1. Open the preview with Tailscale connected, or open `docs/design/index.html` locally.
2. Run `browser-check.js` through agent-browser MCP eval or the browser console. Expect `failed: []`.
3. Repeat in a same-origin iframe with width 320 px. Run the checks through that frame's `contentWindow`.
4. Open Jobs, then Filter jobs. Apply a search/queue/state combination. Reopen and cancel a draft; the committed filter must remain unchanged.
5. Open Components and brand. Open the sample form, submit an invalid interval, then enter an integer from 1 to 60 and submit again.
6. Open the operation modal. Choose Error and submit; verify the persistent error toast. Repeat with Success. Dismiss messages using the keyboard.
7. Use Tab, Enter, and Escape. Dialogs must isolate background interaction and restore focus when closed.

The checks change only local prototype state and appearance preference. They never submit real operations.

## Human acceptance

| Item | Owner | Acceptance condition |
|---|---|---|
| Real screen-reader check | Maintainer or accessibility reviewer | Verify toast announcements, repeated messages, field validation, and modal navigation using NVDA or VoiceOver |
| Final approval | Maintainer | Approve screens, components, brand, and localization; record name, date, and reviewed revision in issue #1 |

Accessibility-tree and axe checks do not replace actual screen-reader testing. This repository contains a design artifact, not a product backend or API.


## Icon and clarity review

The revenue-centric-design review preserves the established visual identity and improves the existing task paths. Eye buttons open queue jobs; back actions include an arrow. Toasts have a semantic icon, explicit heading, and upper-right close icon. Icon-only controls retain accessible names, titles where useful, and 44 px targets. Clear filters appears only for active filters and returns focus to the filter trigger. Gallery action examples now respond, and the selected-state example toggles.

Verification: 204 existing browser checks passed after this review. Eye activation and toast dismissal were also tested with Enter through agent-browser MCP. Toast dismissal returned focus to main content. Six axe audits reported no WCAG violations. Real screen-reader testing remains an unperformed follow-up.

## Shared form layout repair

The confirmation form's `justify-content: flex-end` leaked into the editor grid. Without an explicit grid track, each form's fields used an intrinsic-width column aligned to the right. Restrict confirmation layout rules to `#confirm form` and give editor forms one full-width `minmax(0, 1fr)` track with stretch alignment. Keep right alignment only in the action row. Reset paragraph and title spacing within the editor.

[Layout checks](form-layout-check.js) reproduced the failure before the fix. [Results](form-layout-results.json) cover filters, field samples, operations, and confirmation in both themes, at 1280 px and 320 px. All 16 combinations pass: labels align with their form's left edge, fields fill the form track, and no dialog or page overflows horizontally. This is a visual-only CSS repair; no submission logic changed. The stylesheet URL includes a revision to avoid reusing the stale preview cache.

Review [the repaired operation dialog](forms-fixed-dark.png). Reopen each form after reloading the preview. Inspect full-width fields, left-aligned labels, and the separate action row. The maintainer approved the design on 2026-11-07. Real screen-reader review remains unperformed.


## Maintainer acceptance

On 2026-11-07, @ojcezarferreira explicitly approved the reviewed design and authorized commit, push, and closure of issue #1. The publication commit is linked in the issue closure record. No NVDA or VoiceOver validation is claimed. Product implementation still depends on the architecture decision in issue #2.
