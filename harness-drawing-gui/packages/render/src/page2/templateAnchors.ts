import type { Page2TemplateAnchorConfig } from "../types";

// These anchors describe where dynamic overlay data lands on the immutable template artwork.
// Connector column bodies are part of the PDF background and are intentionally not rendered by overlay SVG.
export const DEFAULT_PAGE2_TEMPLATE_ANCHORS: Page2TemplateAnchorConfig = {
  templatePageSizePt: {
    width: 720,
    height: 405,
  },
  leftRailX: 215,
  rightRailX: 470,
  pinRowStartY: 118,
  pinRowPitch: 9.608695652,
  headingLeftCenterX: 196,
  headingRightCenterX: 510,
  headingY: 70,
  subheadingY: 78,
  leftLabelAnchorX: 182,
  rightLabelAnchorX: 524,
  metaAnchorX: 342.5,
  leftSideBox: {
    x: 42,
    y: 68,
    width: 118,
    height: 78,
  },
  rightSideBox: {
    x: 542,
    y: 68,
    width: 118,
    height: 78,
  },
};

// Sample calibration profile for reference ladder templates; keep as named preset for future expansion.
export const SAMPLE_LADDER_26PIN_PAGE2_TEMPLATE_ANCHORS: Page2TemplateAnchorConfig = {
  templatePageSizePt: {
    width: 720,
    height: 405,
  },
  leftRailX: 215,
  rightRailX: 470,
  pinRowStartY: 118,
  pinRowPitch: 9.608695652,
  headingLeftCenterX: 196,
  headingRightCenterX: 510,
  headingY: 70,
  subheadingY: 78,
  leftLabelAnchorX: 182,
  rightLabelAnchorX: 524,
  metaAnchorX: 342.5,
  leftSideBox: {
    x: 42,
    y: 68,
    width: 118,
    height: 78,
  },
  rightSideBox: {
    x: 542,
    y: 68,
    width: 118,
    height: 78,
  },
};
