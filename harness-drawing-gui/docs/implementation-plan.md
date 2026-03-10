# Implementation Plan

## Phase 1 — Data and geometry
- Finalize normalized row contract
- Implement workbook/CSV parsing
- Implement page geometry constants and scaling helpers
- Add sample regression fixtures

## Phase 2 — Rendering
- Build Page 2 SVG renderer first
- Validate against `samples/Example.pdf`
- Build Page 1 overlay renderer
- Add project state serialization

## Phase 3 — Exports
- Add SVG export
- Add PDF export using shared SVG render output
- Add DXF export from geometry primitives

## Phase 4 — Hardening
- Add schema fallback logic for alternate pinout headers
- Add error messages for malformed templates and unsupported workbooks
- Add regression screenshots for sample inputs

## Phase 5 — LdrDoc
- Define a document model that can serialize to LdrDoc once requirements are fully pinned down
- Keep it behind an exporter interface from the beginning
