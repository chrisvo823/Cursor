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
