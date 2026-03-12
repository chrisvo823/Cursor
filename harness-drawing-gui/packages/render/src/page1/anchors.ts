import type { Page1TemplateAnchorConfig } from "../types";

export const DEFAULT_PAGE1_TEMPLATE_ANCHORS: Page1TemplateAnchorConfig = {
  templatePageSizePt: {
    width: 720,
    height: 405,
  },
  overallLengthAnchor: { x: 386.76, y: 127.36 },
  labelAAnchor: { x: 319.56, y: 197.86 },
  labelBAnchor: { x: 441.54, y: 197.86 },
  notesRegion: {
    x: 24,
    y: 64,
    width: 618,
    lineHeight: 14.8,
    maxLines: 20,
    numberColumnWidth: 54,
    markerOffsetX: 18,
    markerOffsetY: -6,
    markerSize: 5.6,
    charWidthEstimate: 7.6,
  },
  revisionRegion: {
    x: 532.51,
    y: 9.74,
    rowGap: 5.2,
    valueOffsetX: 20,
  },
  titleBlockRegion: {
    x: 479.27,
    y: 345.15,
    rowGap: 8.9,
    valueOffsetX: 30,
  },
  calloutAnchors: [
    { id: "callout_1", x: 286.13, y: 179.68, radius: 6.55 },
    { id: "callout_2", x: 319.51, y: 150.13, radius: 6.55 },
    { id: "callout_3", x: 441.22, y: 150.13, radius: 6.55 },
    { id: "callout_4", x: 474.67, y: 179.67, radius: 6.55 },
    { id: "callout_5", x: 473.17, y: 224.75, radius: 6.55 },
  ],
  calloutTextOffsetY: 1,
};

// A named sample profile keeps calibration tuning explicit for future templates.
export const SAMPLE_LADDER_26PIN_PAGE1_TEMPLATE_ANCHORS: Page1TemplateAnchorConfig = {
  templatePageSizePt: {
    width: 720,
    height: 405,
  },
  overallLengthAnchor: { x: 386.76, y: 127.36 },
  labelAAnchor: { x: 319.56, y: 197.86 },
  labelBAnchor: { x: 441.54, y: 197.86 },
  notesRegion: {
    x: 24,
    y: 64,
    width: 618,
    lineHeight: 14.8,
    maxLines: 20,
    numberColumnWidth: 54,
    markerOffsetX: 18,
    markerOffsetY: -6,
    markerSize: 5.6,
    charWidthEstimate: 7.6,
  },
  revisionRegion: {
    x: 532.51,
    y: 9.74,
    rowGap: 5.2,
    valueOffsetX: 20,
  },
  titleBlockRegion: {
    x: 479.27,
    y: 345.15,
    rowGap: 8.9,
    valueOffsetX: 30,
  },
  calloutAnchors: [
    { id: "callout_1", x: 286.13, y: 179.68, radius: 6.55 },
    { id: "callout_2", x: 319.51, y: 150.13, radius: 6.55 },
    { id: "callout_3", x: 441.22, y: 150.13, radius: 6.55 },
    { id: "callout_4", x: 474.67, y: 179.67, radius: 6.55 },
    { id: "callout_5", x: 473.17, y: 224.75, radius: 6.55 },
  ],
  calloutTextOffsetY: 1,
};
