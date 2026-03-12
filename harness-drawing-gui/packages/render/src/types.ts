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
  tone: "heading" | "subheading" | "labelLeft" | "labelRight" | "meta" | "tooling" | "legend" | "pinHint";
};

export type Page2OverlayFigure8Marker = {
  id: string;
  x: number;
  y: number;
  radius: number;
};

export type Page2OverlayAuxLine = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  strokeWidth: number;
};

export type Page2OverlayPolygon = {
  id: string;
  points: ScenePoint[];
  stroke: string;
  strokeWidth: number;
  fill?: string;
};

export type Page2OverlayModel = {
  sceneWidth: number;
  sceneHeight: number;
  pinDots: ScenePoint[];
  pinLabels: Page2OverlayPinLabel[];
  wires: Page2OverlayWire[];
  texts: Page2OverlayText[];
  figure8Markers: Page2OverlayFigure8Marker[];
  auxLines: Page2OverlayAuxLine[];
  polygons: Page2OverlayPolygon[];
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

export type Page1RevisionFields = {
  rev: string;
  desc: string;
  date: string;
  by: string;
};

export type Page1TitleBlockFields = {
  title: string;
  number: string;
  revision: string;
  sheet: string;
  date: string;
  file: string;
};

export type Page1CalloutField = {
  id: string;
  value: string;
};

export type Page1NotesOverrides = {
  note04: string;
  note05: string;
  note07: string;
};

export type Page1Approvals = {
  eeName: string;
  eeDate: string;
  meName: string;
  meDate: string;
  techName: string;
  techDate: string;
};

export type Page1OverlayFields = {
  overallLength: string;
  overallLengthValue: number;
  overallLengthUnit: string;
  overallLengthTolerance: number;
  labelA: string;
  labelB: string;
  labelTableA: string;
  labelTableB: string;
  notesText: string;
  notesOverrides: Page1NotesOverrides;
  revision: Page1RevisionFields;
  titleBlock: Page1TitleBlockFields;
  approvals: Page1Approvals;
  referenceDocuments: string;
  todayDate: string;
  callouts: Page1CalloutField[];
};

export type Page1NoteMarkerType = "triangle" | "square";

export type Page1ParsedNote = {
  number: string;
  body: string;
};

export type Page1TemplateAnchorConfig = {
  templatePageSizePt: PageSizePt;
  overallLengthAnchor: ScenePoint;
  labelAAnchor: ScenePoint;
  labelBAnchor: ScenePoint;
  notesTitleAnchor: ScenePoint;
  notesRegion: {
    x: number;
    y: number;
    width: number;
    lineHeight: number;
    maxLines: number;
    numberColumnWidth: number;
    markerOffsetX: number;
    markerOffsetY: number;
    markerSize: number;
    charWidthEstimate: number;
  };
  revisionRegion: {
    x: number;
    y: number;
    rowGap: number;
    valueOffsetX: number;
  };
  titleBlockRegion: {
    x: number;
    y: number;
    rowGap: number;
    valueOffsetX: number;
  };
  calloutAnchors: Array<{
    id: string;
    x: number;
    y: number;
    radius: number;
  }>;
  calloutTextOffsetY: number;
  connectorBlocks: {
    left: { x: number; y: number; width: number; height: number };
    right: { x: number; y: number; width: number; height: number };
  };
  bundleDimension: {
    lineStartX: number;
    lineEndX: number;
    lineY: number;
    arrowSize: number;
  };
  labelTableRegion: {
    x: number;
    y: number;
    width: number;
    height: number;
    splitX: number;
    headingY: number;
    valueStartY: number;
    valueLineGap: number;
  };
  flagZones: {
    left: { x: number; y: number; width: number; height: number };
    right: { x: number; y: number; width: number; height: number };
  };
  approvalsRegion: {
    x: number;
    y: number;
    rowGap: number;
    valueOffsetX: number;
    dateOffsetX: number;
  };
  referenceAnchor: ScenePoint;
};

export type Page1OverlayText = {
  id: string;
  value: string;
  x: number;
  y: number;
  textAnchor?: "start" | "middle" | "end";
  tone: "notes" | "fieldLabel" | "fieldValue" | "callout";
};

export type Page1OverlayMarker = {
  id: string;
  type: Page1NoteMarkerType;
  x: number;
  y: number;
  size: number;
};

export type Page1OverlayCallout = {
  id: string;
  x: number;
  y: number;
  radius: number;
  value: string;
};

export type Page1OverlayLine = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  strokeWidth: number;
};

export type Page1OverlayPolygon = {
  id: string;
  points: ScenePoint[];
  stroke: string;
  strokeWidth: number;
  fill?: string;
};

export type Page1OverlayModel = {
  sceneWidth: number;
  sceneHeight: number;
  texts: Page1OverlayText[];
  markers: Page1OverlayMarker[];
  callouts: Page1OverlayCallout[];
  lines: Page1OverlayLine[];
  polygons: Page1OverlayPolygon[];
};

export type Page1TemplateCalibration = {
  viewportFit: {
    sourcePageSizePt: PageSizePt;
    targetViewportSizePx: {
      width: number;
      height: number;
    };
    scaleX: number;
    scaleY: number;
  };
  templateAnchors: Page1TemplateAnchorConfig;
  overlayToViewportPx: Page2OverlayTransform;
};
