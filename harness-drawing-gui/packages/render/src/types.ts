import type { PinoutRow } from "@harness/shared";

export type ScenePoint = {
  x: number;
  y: number;
};

export type PageSizePt = {
  width: number;
  height: number;
};

export type Page2ConnectorColumnScene = {
  x: number;
  y: number;
  width: number;
  height: number;
  railX: number;
  name: string;
  subtitle: string;
};

export type Page2PinScene = {
  pin: number;
  y: number;
  leftDot: ScenePoint;
  rightDot: ScenePoint;
};

export type Page2WireScene = {
  id: string;
  fromPin: number;
  toPin: number;
  leftLabel: string;
  rightLabel: string;
  source: PinoutRow;
  start: ScenePoint;
  end: ScenePoint;
  leftLabelPos: ScenePoint;
  rightLabelPos: ScenePoint;
  twistedPair: boolean;
  leftTpMarkerCenter?: ScenePoint;
  rightTpMarkerCenter?: ScenePoint;
};

export type Page2Scene = {
  pageSize: PageSizePt;
  leftColumn: Page2ConnectorColumnScene;
  rightColumn: Page2ConnectorColumnScene;
  leftToolingAnchor: ScenePoint;
  rightToolingAnchor: ScenePoint;
  pinRows: Page2PinScene[];
  wires: Page2WireScene[];
};

export type Page2LayoutOptions = {
  linePitchMm: number;
  autoExpandConnectorColumns: boolean;
  leftConnectorName: string;
  rightConnectorName: string;
  leftConnectorSubtitle: string;
  rightConnectorSubtitle: string;
};

export type Page2OverlayTransform = {
  scaleX: number;
  scaleY: number;
  offsetX: number;
  offsetY: number;
};

export type Page2OverlayPinLabel = {
  id: string;
  value: string;
  x: number;
  y: number;
  textAnchor: "start" | "end";
};

export type Page2OverlayWire = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type Page2OverlayText = {
  id: string;
  value: string;
  x: number;
  y: number;
  textAnchor?: "start" | "middle" | "end";
  tone: "heading" | "subheading" | "labelLeft" | "labelRight" | "meta";
};

export type Page2OverlayFigure8Marker = {
  id: string;
  x: number;
  y: number;
  radius: number;
};

export type Page2OverlayModel = {
  sceneWidth: number;
  sceneHeight: number;
  pinDots: ScenePoint[];
  pinLabels: Page2OverlayPinLabel[];
  wires: Page2OverlayWire[];
  texts: Page2OverlayText[];
  figure8Markers: Page2OverlayFigure8Marker[];
};

export type Page2TemplateAnchorConfig = {
  templatePageSizePt: PageSizePt;
  leftRailX: number;
  rightRailX: number;
  pinRowStartY: number;
  pinRowPitch: number;
  headingLeftCenterX: number;
  headingRightCenterX: number;
  headingY: number;
  subheadingY: number;
  leftLabelAnchorX: number;
  rightLabelAnchorX: number;
  metaAnchorX: number;
  leftSideBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  rightSideBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export type Page2OverlayAnchorSnapshot = {
  leftRailX: number;
  rightRailX: number;
  pinRowStartY: number;
  pinRowPitch: number;
  headingLeftCenterX: number;
  headingRightCenterX: number;
  headingY: number;
  subheadingY: number;
  leftLabelAnchorX: number;
  rightLabelAnchorX: number;
  metaAnchorX: number;
};

export type Page2ViewportFit = {
  sourcePageSizePt: PageSizePt;
  targetViewportSizePx: {
    width: number;
    height: number;
  };
  scaleX: number;
  scaleY: number;
  offsetX: number;
  offsetY: number;
};

export type Page2TemplateCalibration = {
  viewportFit: Page2ViewportFit;
  templateAnchors: Page2TemplateAnchorConfig;
  overlayAnchors: Page2OverlayAnchorSnapshot;
  overlayToTemplatePt: Page2OverlayTransform;
  overlayToViewportPx: Page2OverlayTransform;
};
