# Product Spec

## Core workflow

The engineer uploads two files only:
- a 2-page PDF template,
- a pinout workbook or CSV.

The app converts the PDF into page backgrounds, normalizes the pinout dataset, renders Page 1 and Page 2 overlays, lets the engineer edit fillable values, then exports a final drawing package.

## Design intent

This is an engineering workstation workflow. The operator should spend most of their time on verification, adjustment, and export — not on redrawing the sheet manually.

## Page 1 intent

Page 1 is the harness assembly sheet. It should support:
- notes block editing,
- revision block editing,
- title block editing,
- harness length label editing,
- editable callout balloons and markers.

The page must still look like the original template sheet.

## Page 2 intent

Page 2 is the ladder/wiring sheet. It should support:
- connector headings,
- connector image boxes,
- left/right tooling blocks,
- geometry-accurate wire landing between connector columns,
- TP visual treatment,
- vector export.

## Input data contract

Preferred sample sheet:
- `Ladder_26pin`

Observed columns:
- `P2`
- `Signal Name`
- `AWG`
- `Color`
- `TP`
- `P4`

When only one signal-name column exists, left and right labels default to the same string.

## Output package

Phase 1:
- PDF drawing
- current-page SVG
- Page 2 DXF
- project JSON

Phase 2:
- LdrDoc exporter once the geometry model is proven stable.
