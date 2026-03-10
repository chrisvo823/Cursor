# Acceptance Criteria

## Input handling

- The app accepts one 2-page PDF template.
- The app accepts `.xlsx`, `.xls`, and `.csv` pinout sources.
- The app prefers the `Ladder_26pin` sheet when available.
- The raw pinout file is not shown as a spreadsheet preview.

## Page 2 rendering

- 26-pin sample loads without manual schema editing.
- P2 pin numbers appear in the left column and P4 pin numbers appear in the right column.
- Crossovers from the sample workbook land on the correct right-side pins.
- TP-tagged rows render figure-8 markers at both ends.
- Endpoints render with black dots.
- Yellow connector columns can auto-expand for wire count.

## Page 1 rendering

- Notes are legible and reflowed.
- Note 05 gets a triangle marker.
- Note 07 gets a square marker.
- Callouts are editable without changing their anchor positions.
- Title block and revision block remain aligned to the template.

## Export

- Exported PDF contains both pages.
- Exported SVG reflects the active page.
- Exported DXF contains Page 2 wiring geometry.
- Project JSON can be saved and reloaded.
