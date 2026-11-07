# Repository instructions

@/root/.codex/RTK.md

- Write all repository documentation in English. This includes Markdown, design specifications, token descriptions, code comments, and verification reports. Preserve upstream license text unchanged.
- Every form must open in a modal dialog or on a dedicated page. Never embed a form inline in an overview, list, detail panel, or component gallery. Filter forms follow the same rule. Standalone appearance and design-scenario selectors are immediate controls, not multi-field forms.
- Show operation confirmations and failures as accessible toast notifications. Use polite status announcements for success and assertive alert announcements for errors. Do not move focus to a toast. Provide a keyboard-accessible dismiss action. Keep errors until dismissed.
- Keep field validation inside its modal or dedicated form page, associated with the invalid field. A toast must not replace the field error or explain an invalid field outside an active modal.
- Keep the design artifact separate from product implementation. Final maintainer approval remains required by issue #1.
