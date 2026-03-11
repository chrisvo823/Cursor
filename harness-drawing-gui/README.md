# Harness Drawing GUI

Production-oriented MVP foundation for the harness drawing generator.

This repo now includes real browser preview plumbing: template PDF ingestion, pinout parsing, deterministic Page 2 scene generation, and template-anchored vector overlay rendering.

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
- `packages/render/` – page scene builders and renderer-facing geometry
- `packages/core/` – legacy scaffold package kept for migration compatibility
- `apps/web/` – React/Vite front-end with template upload + live drawing preview
- `.cursor/rules/` – coding guardrails for Cursor

## Quick start

```bash
npm install
npm run dev
```

## Recommended build order

1. Finish pinout normalization in `packages/shared`
2. Lock page geometry in `packages/render`
3. Implement Page 2 SVG renderer against render scenes
4. Implement Page 1 overlay renderer
5. Add project save/load
6. Add PDF, SVG, DXF export
7. Add LdrDoc exporter once the geometry model is stable

## Important engineering decisions

- Use **SVG as the internal page scene graph**.
- Render the uploaded PDF template into per-page bitmap backgrounds for preview.
- Keep **normalized pinout data** separate from **render geometry**.
- Make exporters consume the same geometry model.
- When only one `Signal Name` column exists, render it on both sides by default.

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial harness drawing GUI scaffold"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```
