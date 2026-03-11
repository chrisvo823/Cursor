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
  scale: number;
  offsetX: number;
  offsetY: number;
};

export type Page2OverlayColumn = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Page2OverlayRail = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
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
  columns: {
    left: Page2OverlayColumn;
    right: Page2OverlayColumn;
  };
  rails: {
    left: Page2OverlayRail;
    right: Page2OverlayRail;
  };
  pinDots: ScenePoint[];
  pinLabels: Page2OverlayPinLabel[];
  wires: Page2OverlayWire[];
  texts: Page2OverlayText[];
  figure8Markers: Page2OverlayFigure8Marker[];
};
