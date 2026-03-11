# Harness Drawing GUI

Production-oriented engineering MVP for a template-backed harness drawing generator.

The app currently supports template + pinout ingestion, deterministic Page 1/Page 2 preview overlays, project save/load JSON, and PDF/SVG/DXF exports from shared render models.

## What this product is

A browser-based engineering tool that takes:
1. one **2-page PDF drawing template** as the fixed harness canvas,
2. one **pinout workbook or CSV** as structured electrical data,

and produces:
- a rendered **2-page harness drawing PDF**,
- vector exports for downstream workflows,
- a saved project file for reopening and editing.

It is **not** a generic PDF editor and **not** a raw spreadsheet viewer.

## Why this repo exists

The uploaded materials establish three hard constraints:
- the template PDF is the immutable drawing background,
- the `Ladder_26pin` workbook sheet is the primary connector dataset,
- the UI should follow an engineering-software pattern with a control rail and large preview, without copying the prototype 1:1.

## Repo map

- `docs/` – product, UI, rendering, and acceptance specs
- `config/project.yaml` – machine-readable implementation brief for Cursor
- `samples/` – reference assets copied from the conversation
- `packages/shared/` – shared types, parsing, and pinout normalization
- `packages/render/` – page scene builders, anchor calibration, and export primitives
- `packages/core/` – legacy scaffold package kept for migration compatibility
- `apps/web/` – React/Vite front-end with template upload + live drawing preview
- `.cursor/rules/` – coding guardrails for Cursor

## Quick start

```bash
npm install
npm run dev
```

## Implemented status

- Template ingestion: validates PDF type and minimum two pages, rasterizes Page 1/Page 2 backgrounds for preview/export.
- Pinout ingestion: parses `.xlsx`/`.xls`/`.csv`, normalizes common header aliases, defaults `used=true`, detects TP rows.
- Preview pipeline: immutable template background plus dynamic SVG overlay for both pages.
- Page 1 overlay: editable overall length, labels, notes, revision block, title block, and fixed callouts with note markers (05 triangle, 07 square).
- Page 2 overlay: deterministic row mapping from `fromPin -> toPin`, pin dots/labels, wire geometry, row labels/meta text, TP figure-8 markers.
- Project persistence: versioned schema `HARNESS_PROJECT_SCHEMA_VERSION = 1` with template snapshot + normalized pinout + page settings.
- Export pipeline: 2-page PDF, active-page SVG, and Page 2 DXF; all driven from the same render/calibration models used in preview.
- Calibration: explicit template anchors for Page 1/Page 2, plus named sample calibration profile path.

## Reliability and validation hardening

- Domain-specific errors are used for template validation, pinout parsing, and project schema compatibility.
- Save/export actions fail with explicit user-readable precondition messages when template/pinout data is missing.
- Project load validation rejects malformed template snapshots (for example missing embedded image data URLs).
- Regression tests cover sample pinout crossover mapping, TP marker stability, calibration determinism, and overlay/export contracts.

## Important engineering decisions

- Use **SVG as the internal page scene graph**.
- Render the uploaded PDF template into per-page bitmap backgrounds for preview.
- Keep **normalized pinout data** separate from **render geometry**.
- Make exporters consume the same geometry model.
- Keep connector column artwork template-backed only (no duplicate drawable connector bodies in overlays/exports).

## Remaining gaps / future work

- Template-specific calibration tuning UI (currently file-name-based profile selection + code config).
- Optional connector rear-view image ingestion and tooling block authoring workflows.
- Native Altium/LdrDoc writer (DXF is currently the vector interchange adapter).
- Broader visual regression harness (screenshots) on top of existing deterministic model tests.
