import type { Page2OverlayModel, Page2Scene, ScenePoint } from "../types";
import { PAGE2_BASE_GEOMETRY } from "./config";

function buildWireMetaLabel(sceneWire: Page2Scene["wires"][number]): string {
  const chunks: string[] = [];
  if (sceneWire.source.wireNumber) chunks.push(sceneWire.source.wireNumber);
  if (sceneWire.source.awg) chunks.push(`${sceneWire.source.awg}AWG`);
  if (sceneWire.source.color) chunks.push(sceneWire.source.color);
  if (sceneWire.twistedPair) chunks.push(sceneWire.source.pair || "TP");
  return chunks.join(" · ");
}

function midpoint(start: ScenePoint, end: ScenePoint): ScenePoint {
  return {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
  };
}

export function buildPage2OverlayModel(scene: Page2Scene): Page2OverlayModel {
  const pinDots: ScenePoint[] = [];
  const pinLabels: Page2OverlayModel["pinLabels"] = [];
  const wires: Page2OverlayModel["wires"] = [];
  const texts: Page2OverlayModel["texts"] = [];
  const figure8Markers: Page2OverlayModel["figure8Markers"] = [];
  const auxLines: Page2OverlayModel["auxLines"] = [];
  const polygons: Page2OverlayModel["polygons"] = [];

  const rectanglePoints = (x: number, y: number, width: number, height: number): ScenePoint[] => [
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height },
  ];

  // Highlight connector insert backgrounds to match the Example style.
  polygons.push(
    {
      id: "left-yellow-insert",
      points: rectanglePoints(scene.leftColumn.x, scene.leftColumn.y, scene.leftColumn.width, scene.leftColumn.height),
      stroke: "#0b0f1a",
      strokeWidth: 0.8,
      fill: "rgba(255,247,168,0.92)",
    },
    {
      id: "right-yellow-insert",
      points: rectanglePoints(scene.rightColumn.x, scene.rightColumn.y, scene.rightColumn.width, scene.rightColumn.height),
      stroke: "#0b0f1a",
      strokeWidth: 0.8,
      fill: "rgba(255,247,168,0.92)",
    },
    {
      id: "left-side-box",
      points: rectanglePoints(
        PAGE2_BASE_GEOMETRY.leftSideBoxX,
        PAGE2_BASE_GEOMETRY.sideBoxY,
        PAGE2_BASE_GEOMETRY.sideBoxWidth,
        PAGE2_BASE_GEOMETRY.sideBoxHeight,
      ),
      stroke: "#0b0f1a",
      strokeWidth: 0.7,
      fill: "rgba(255,255,255,0.15)",
    },
    {
      id: "right-side-box",
      points: rectanglePoints(
        PAGE2_BASE_GEOMETRY.rightSideBoxX,
        PAGE2_BASE_GEOMETRY.sideBoxY,
        PAGE2_BASE_GEOMETRY.sideBoxWidth,
        PAGE2_BASE_GEOMETRY.sideBoxHeight,
      ),
      stroke: "#0b0f1a",
      strokeWidth: 0.7,
      fill: "rgba(255,255,255,0.15)",
    },
  );

  const rearView = (prefix: "left" | "right", sideX: number) => {
    const centerX = sideX + PAGE2_BASE_GEOMETRY.sideBoxWidth / 2;
    const centerY = PAGE2_BASE_GEOMETRY.sideBoxY + PAGE2_BASE_GEOMETRY.sideBoxHeight / 2 + 2;
    polygons.push({
      id: `${prefix}-rear-triangle`,
      points: [
        { x: centerX, y: centerY - 20 },
        { x: centerX - 28, y: centerY + 20 },
        { x: centerX + 28, y: centerY + 20 },
      ],
      stroke: "#0b0f1a",
      strokeWidth: 0.75,
      fill: "rgba(255,255,255,0.35)",
    });

    const pinHints = [
      { pin: "1", x: centerX, y: centerY - 10 },
      { pin: "13", x: centerX - 16, y: centerY + 10 },
      { pin: "14", x: centerX + 16, y: centerY + 10 },
      { pin: "26", x: centerX, y: centerY + 18 },
    ];
    for (const hint of pinHints) {
      texts.push({
        id: `${prefix}-rear-pin-${hint.pin}`,
        value: hint.pin,
        x: hint.x,
        y: hint.y,
        textAnchor: "middle",
        tone: "pinHint",
      });
    }

    texts.push({
      id: `${prefix}-triangle-indent`,
      value: "PIN1 TRIANGLE INDENT",
      x: sideX + 6,
      y: PAGE2_BASE_GEOMETRY.sideBoxY + PAGE2_BASE_GEOMETRY.sideBoxHeight + 14,
      tone: "tooling",
    });
  };

  rearView("left", PAGE2_BASE_GEOMETRY.leftSideBoxX);
  rearView("right", PAGE2_BASE_GEOMETRY.rightSideBoxX);

  texts.push(
    {
      id: "left-heading",
      value: scene.leftColumn.name,
      x: scene.leftColumn.x + scene.leftColumn.width / 2,
      y: PAGE2_BASE_GEOMETRY.headingY,
      textAnchor: "middle",
      tone: "heading",
    },
    {
      id: "right-heading",
      value: scene.rightColumn.name,
      x: scene.rightColumn.x + scene.rightColumn.width / 2,
      y: PAGE2_BASE_GEOMETRY.headingY,
      textAnchor: "middle",
      tone: "heading",
    },
    {
      id: "left-subheading",
      value: scene.leftColumn.subtitle,
      x: scene.leftColumn.x + scene.leftColumn.width / 2,
      y: PAGE2_BASE_GEOMETRY.subtitleY,
      textAnchor: "middle",
      tone: "subheading",
    },
    {
      id: "right-subheading",
      value: scene.rightColumn.subtitle,
      x: scene.rightColumn.x + scene.rightColumn.width / 2,
      y: PAGE2_BASE_GEOMETRY.subtitleY,
      textAnchor: "middle",
      tone: "subheading",
    },
  );

  for (const row of scene.pinRows) {
    pinDots.push(row.leftDot, row.rightDot);
    pinLabels.push(
      {
        id: `left-pin-${row.pin}`,
        value: String(row.pin),
        x: scene.leftColumn.x + scene.leftColumn.width - 5,
        y: row.y + 2,
        textAnchor: "end",
      },
      {
        id: `right-pin-${row.pin}`,
        value: String(row.pin),
        x: scene.rightColumn.x + 5,
        y: row.y + 2,
        textAnchor: "start",
      },
    );
  }

  for (const sceneWire of scene.wires) {
    wires.push({
      id: sceneWire.id,
      x1: sceneWire.start.x,
      y1: sceneWire.start.y,
      x2: sceneWire.end.x,
      y2: sceneWire.end.y,
    });

    texts.push(
      {
        id: `${sceneWire.id}-left-label`,
        value: sceneWire.leftLabel,
        x: sceneWire.leftLabelPos.x,
        y: sceneWire.leftLabelPos.y,
        tone: "labelLeft",
      },
      {
        id: `${sceneWire.id}-right-label`,
        value: sceneWire.rightLabel,
        x: sceneWire.rightLabelPos.x,
        y: sceneWire.rightLabelPos.y,
        textAnchor: "end",
        tone: "labelRight",
      },
    );

    const wireMeta = buildWireMetaLabel(sceneWire);
    if (wireMeta) {
      const middle = midpoint(sceneWire.start, sceneWire.end);
      texts.push({
        id: `${sceneWire.id}-meta`,
        value: wireMeta,
        x: middle.x,
        y: middle.y - 1.6,
        textAnchor: "middle",
        tone: "meta",
      });
    }

    if (sceneWire.leftTpMarkerCenter && sceneWire.rightTpMarkerCenter) {
      figure8Markers.push(
        {
          id: `${sceneWire.id}-left-top`,
          x: sceneWire.leftTpMarkerCenter.x,
          y: sceneWire.leftTpMarkerCenter.y - PAGE2_BASE_GEOMETRY.tpMarkerOffsetY,
          radius: 1.5,
        },
        {
          id: `${sceneWire.id}-left-bottom`,
          x: sceneWire.leftTpMarkerCenter.x,
          y: sceneWire.leftTpMarkerCenter.y + PAGE2_BASE_GEOMETRY.tpMarkerOffsetY,
          radius: 1.5,
        },
        {
          id: `${sceneWire.id}-right-top`,
          x: sceneWire.rightTpMarkerCenter.x,
          y: sceneWire.rightTpMarkerCenter.y - PAGE2_BASE_GEOMETRY.tpMarkerOffsetY,
          radius: 1.5,
        },
        {
          id: `${sceneWire.id}-right-bottom`,
          x: sceneWire.rightTpMarkerCenter.x,
          y: sceneWire.rightTpMarkerCenter.y + PAGE2_BASE_GEOMETRY.tpMarkerOffsetY,
          radius: 1.5,
        },
      );
    }
  }

  const gauges = Array.from(
    new Set(
      scene.wires
        .map((wire) => wire.source.awg.trim())
        .filter((value) => value.length > 0),
    ),
  ).sort((a, b) => Number(b) - Number(a));
  const gaugeText = gauges.length > 0 ? gauges.join("/") : "26/22";
  const toolingRows = [
    "CRIMP CONTACT: 0125-0010005",
    "CRIMPER: Z125-900",
    "POSITIONER: Z125-901",
    "STRIP LENGTH: 2.0 MM",
    `WIRE GAUGE: ${gaugeText}`,
  ];

  toolingRows.forEach((line, index) => {
    const y = PAGE2_BASE_GEOMETRY.toolingY + index * 10;
    texts.push(
      {
        id: `tooling-left-${index}`,
        value: line,
        x: scene.leftToolingAnchor.x,
        y,
        tone: "tooling",
      },
      {
        id: `tooling-right-${index}`,
        value: line,
        x: scene.rightToolingAnchor.x,
        y,
        tone: "tooling",
      },
    );
  });

  texts.push(
    {
      id: "legend-used",
      value: "USED",
      x: scene.pageSize.width - 112,
      y: scene.pageSize.height - 30,
      tone: "legend",
    },
    {
      id: "legend-unused",
      value: "UNUSED",
      x: scene.pageSize.width - 112,
      y: scene.pageSize.height - 18,
      tone: "legend",
    },
  );

  auxLines.push(
    {
      id: "left-red-arrow",
      x1: PAGE2_BASE_GEOMETRY.leftSideBoxX + PAGE2_BASE_GEOMETRY.sideBoxWidth - 6,
      y1: PAGE2_BASE_GEOMETRY.sideBoxY + PAGE2_BASE_GEOMETRY.sideBoxHeight / 2 + 4,
      x2: PAGE2_BASE_GEOMETRY.leftSideBoxX + PAGE2_BASE_GEOMETRY.sideBoxWidth + 18,
      y2: PAGE2_BASE_GEOMETRY.sideBoxY + PAGE2_BASE_GEOMETRY.sideBoxHeight / 2 + 4,
      stroke: "#b01818",
      strokeWidth: 1.1,
    },
    {
      id: "right-red-arrow",
      x1: PAGE2_BASE_GEOMETRY.rightSideBoxX + 6,
      y1: PAGE2_BASE_GEOMETRY.sideBoxY + PAGE2_BASE_GEOMETRY.sideBoxHeight / 2 + 4,
      x2: PAGE2_BASE_GEOMETRY.rightSideBoxX - 12,
      y2: PAGE2_BASE_GEOMETRY.sideBoxY + PAGE2_BASE_GEOMETRY.sideBoxHeight / 2 + 4,
      stroke: "#b01818",
      strokeWidth: 1.1,
    },
  );

  return {
    sceneWidth: scene.pageSize.width,
    sceneHeight: scene.pageSize.height,
    pinDots,
    pinLabels,
    wires,
    texts,
    figure8Markers,
    auxLines,
    polygons,
  };
}
