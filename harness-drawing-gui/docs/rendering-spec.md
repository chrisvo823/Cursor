# Rendering Spec

## Internal model

The render pipeline should be:
1. parse inputs
2. normalize pinout rows
3. compute geometry
4. render SVG scene graph per page
5. export PDF/SVG/DXF/LdrDoc from shared geometry

## Page 1 rules

- The PDF page image is the visual base layer.
- Overlay only the editable drawing content.
- Notes are re-typeset instead of relying on the template text.
- Note `05` gets a blue triangle marker.
- Note `07` gets a blue square highlight.
- Callouts are editable objects with fixed template-relative positions.

## Page 2 rules

- The yellow connector columns are visual anchors.
- Pins are top-to-bottom rows.
- Each row gets endpoint dots at the inner connector rails.
- Wires connect `fromPin` on the left to `toPin` on the right.
- TP rows get figure-8 symbols at both ends.
- Auto-expansion changes connector-column height while preserving overall composition.
- Connector names render above columns.
- Optional connector images render in their dedicated boxes.
- Tooling text renders under each connector image area.

## Color normalization

Display engineering abbreviations when possible:
- WHITE -> WHT
- BLACK -> BLK
- RED -> RED
- BLUE -> BLU
- GREEN -> GRN
- YELLOW -> YEL

## Blank rows

A row with valid pins but no signal name must still render geometry and not crash the page.
