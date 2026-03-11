# Implementation Plan (current state)

## Completed milestones
- Parsing/normalization foundation is implemented in `packages/shared`.
- Page 2 scene + dynamic overlay rendering is implemented in `packages/render` and `apps/web`.
- Template-backed Page 1 overlay engine with editable fields is implemented.
- Project JSON save/load schema v1 is implemented and validated.
- Export adapters are implemented for PDF (2 pages), SVG (active page), and DXF (Page 2 vectors).

## Current hardening focus
- Strengthen explicit validation and user-readable error messages across import/load/export flows.
- Keep calibration deterministic and template-anchor-driven, with named profiles for sample templates.
- Expand deterministic regression coverage using sample pinout fixture behavior.
- Ensure preview and export continue to consume the same scene/overlay/calibration models.

## Next work after MVP hardening
- Add optional calibration authoring/tuning UX for non-sample templates.
- Add richer rear-view connector asset workflow and tooling metadata editing.
- Add native LdrDoc/Altium writer using the existing shared geometry/export contracts.
