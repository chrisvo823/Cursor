# UI Spec

## Layout

Use a two-zone desktop layout:
- **Left control rail** for inputs, page controls, metadata, and export actions
- **Right preview workspace** for the drawing canvas

Add a slim top status bar with pills for:
- pinout status
- template status
- active page

## Interaction model

### Upload
- one upload for the pinout workbook/CSV
- one upload for the 2-page template PDF
- optional uploads for left and right connector images

### Preview
- page tabs: Page 1 and Page 2
- line spacing slider for Page 2
- toggle for masking Page 1 fillable regions
- toggle for connector column auto-expand

### Page 1 panel
- notes editor
- revision fields
- title block fields
- callout editor list
- length field and unit label

### Page 2 panel
- left/right connector names
- left/right subtitles
- left/right tooling groups
- legend labels

## Visual language

- dark, high-contrast control surfaces
- compact spacing
- precise typography
- rounded but restrained components
- the preview canvas should be bright and paper-like

## Explicitly avoid

- showing the raw workbook grid in the main pane
- treating the app like a consumer “wizard”
- copying the existing prototype exactly
