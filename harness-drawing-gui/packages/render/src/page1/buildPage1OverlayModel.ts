import type {
  Page1OverlayCallout,
  Page1OverlayPolygon,
  Page1OverlayFields,
  Page1OverlayLine,
  Page1OverlayMarker,
  Page1OverlayModel,
  Page1OverlayText,
  ScenePoint,
  Page1TemplateAnchorConfig,
} from "../types";
import { layoutPage1Notes, parseNumberedNotes } from "./notes";

function valueOrDash(value: string): string {
  return value.trim() || "—";
}

function markerForNote(number: string): Page1OverlayMarker["type"] | null {
  if (number === "05") return "triangle";
  if (number === "07") return "square";
  return null;
}

function buildNotesTexts(
  fields: Page1OverlayFields,
  anchors: Page1TemplateAnchorConfig,
): { texts: Page1OverlayText[]; markers: Page1OverlayMarker[] } {
  const parsed = parseNumberedNotes(fields.notesText);
  const laidOut = layoutPage1Notes(parsed, anchors.notesRegion);
  const texts: Page1OverlayText[] = [];
  const markers: Page1OverlayMarker[] = [];

  for (const note of laidOut) {
    for (const line of note.lines) {
      if (line.isFirstLine) {
        texts.push({
          id: `note-number-${note.number}-${line.y}`,
          value: `${note.number}.`,
          x: anchors.notesRegion.x,
          y: line.y,
          tone: "fieldLabel",
        });

        const markerType = markerForNote(note.number);
        if (markerType) {
          markers.push({
            id: `note-marker-${note.number}`,
            type: markerType,
            x: anchors.notesRegion.x + anchors.notesRegion.markerOffsetX,
            y: line.y + anchors.notesRegion.markerOffsetY,
            size: anchors.notesRegion.markerSize,
          });
        }
      }

      texts.push({
        id: `note-body-${note.number}-${line.y}`,
        value: line.text,
        x: line.x,
        y: line.y,
        tone: "notes",
      });
    }
  }

  return { texts, markers };
}

function buildRevisionTexts(fields: Page1OverlayFields, anchors: Page1TemplateAnchorConfig): Page1OverlayText[] {
  const labels = ["REV", "DESC", "DATE", "BY"];
  const values = [fields.revision.rev, fields.revision.desc, fields.revision.date, fields.revision.by];
  const texts: Page1OverlayText[] = [];

  labels.forEach((label, index) => {
    const y = anchors.revisionRegion.y + index * anchors.revisionRegion.rowGap;
    texts.push(
      {
        id: `revision-label-${label}`,
        value: label,
        x: anchors.revisionRegion.x,
        y,
        tone: "fieldLabel",
      },
      {
        id: `revision-value-${label}`,
        value: valueOrDash(values[index]),
        x: anchors.revisionRegion.x + anchors.revisionRegion.valueOffsetX,
        y,
        tone: "fieldValue",
      },
    );
  });

  return texts;
}

function buildTitleTexts(fields: Page1OverlayFields, anchors: Page1TemplateAnchorConfig): Page1OverlayText[] {
  const labels = ["TITLE", "NO", "REV", "SHEET", "DATE", "FILE"];
  const values = [
    fields.titleBlock.title,
    fields.titleBlock.number,
    fields.titleBlock.revision,
    fields.titleBlock.sheet,
    fields.titleBlock.date,
    fields.titleBlock.file,
  ];
  const texts: Page1OverlayText[] = [];

  labels.forEach((label, index) => {
    const y = anchors.titleBlockRegion.y + index * anchors.titleBlockRegion.rowGap;
    texts.push(
      {
        id: `title-label-${label}`,
        value: label,
        x: anchors.titleBlockRegion.x,
        y,
        tone: "fieldLabel",
      },
      {
        id: `title-value-${label}`,
        value: valueOrDash(values[index]),
        x: anchors.titleBlockRegion.x + anchors.titleBlockRegion.valueOffsetX,
        y,
        tone: "fieldValue",
      },
    );
  });

  return texts;
}

function buildCallouts(fields: Page1OverlayFields, anchors: Page1TemplateAnchorConfig): Page1OverlayCallout[] {
  const valueById = new Map(fields.callouts.map((callout) => [callout.id, callout.value]));
  return anchors.calloutAnchors.map((anchor) => ({
    id: anchor.id,
    x: anchor.x,
    y: anchor.y,
    radius: anchor.radius,
    value: valueOrDash(valueById.get(anchor.id) ?? ""),
  }));
}

function rectanglePolygon(
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  stroke: string,
  strokeWidth: number,
  fill?: string,
): Page1OverlayPolygon {
  return {
    id,
    points: [
      { x, y },
      { x: x + width, y },
      { x: x + width, y: y + height },
      { x, y: y + height },
    ],
    stroke,
    strokeWidth,
    fill,
  };
}

function arrowTrianglePoints(anchor: ScenePoint, size: number, direction: "left" | "right"): ScenePoint[] {
  if (direction === "left") {
    return [
      { x: anchor.x, y: anchor.y },
      { x: anchor.x + size, y: anchor.y - size * 0.6 },
      { x: anchor.x + size, y: anchor.y + size * 0.6 },
    ];
  }
  return [
    { x: anchor.x, y: anchor.y },
    { x: anchor.x - size, y: anchor.y - size * 0.6 },
    { x: anchor.x - size, y: anchor.y + size * 0.6 },
  ];
}

export function buildPage1OverlayModel(
  fields: Page1OverlayFields,
  anchors: Page1TemplateAnchorConfig,
): Page1OverlayModel {
  const { texts: noteTexts, markers } = buildNotesTexts(fields, anchors);
  const revisionTexts = buildRevisionTexts(fields, anchors);
  const titleTexts = buildTitleTexts(fields, anchors);
  const callouts = buildCallouts(fields, anchors);
  const lines: Page1OverlayLine[] = [];
  const polygons: Page1OverlayPolygon[] = [];

  // Green connector blocks and flag zones.
  polygons.push(
    rectanglePolygon(
      "connector-left",
      anchors.connectorBlocks.left.x,
      anchors.connectorBlocks.left.y,
      anchors.connectorBlocks.left.width,
      anchors.connectorBlocks.left.height,
      "#1c7f52",
      0.9,
      "rgba(148, 224, 170, 0.35)",
    ),
    rectanglePolygon(
      "connector-right",
      anchors.connectorBlocks.right.x,
      anchors.connectorBlocks.right.y,
      anchors.connectorBlocks.right.width,
      anchors.connectorBlocks.right.height,
      "#1c7f52",
      0.9,
      "rgba(148, 224, 170, 0.35)",
    ),
    rectanglePolygon(
      "flag-zone-left",
      anchors.flagZones.left.x,
      anchors.flagZones.left.y,
      anchors.flagZones.left.width,
      anchors.flagZones.left.height,
      "#aa7c17",
      0.8,
      "rgba(255, 238, 178, 0.25)",
    ),
    rectanglePolygon(
      "flag-zone-right",
      anchors.flagZones.right.x,
      anchors.flagZones.right.y,
      anchors.flagZones.right.width,
      anchors.flagZones.right.height,
      "#aa7c17",
      0.8,
      "rgba(255, 238, 178, 0.25)",
    ),
  );

  // Bundle line and dimension arrows.
  lines.push({
    id: "bundle-line",
    x1: anchors.bundleDimension.lineStartX,
    y1: anchors.bundleDimension.lineY,
    x2: anchors.bundleDimension.lineEndX,
    y2: anchors.bundleDimension.lineY,
    stroke: "#0d1a34",
    strokeWidth: 0.9,
  });
  polygons.push(
    {
      id: "bundle-arrow-left",
      points: arrowTrianglePoints(
        { x: anchors.bundleDimension.lineStartX, y: anchors.bundleDimension.lineY },
        anchors.bundleDimension.arrowSize,
        "left",
      ),
      stroke: "#0d1a34",
      strokeWidth: 0.8,
      fill: "#0d1a34",
    },
    {
      id: "bundle-arrow-right",
      points: arrowTrianglePoints(
        { x: anchors.bundleDimension.lineEndX, y: anchors.bundleDimension.lineY },
        anchors.bundleDimension.arrowSize,
        "right",
      ),
      stroke: "#0d1a34",
      strokeWidth: 0.8,
      fill: "#0d1a34",
    },
  );

  // Bottom-center label table.
  polygons.push(
    rectanglePolygon(
      "label-table-outer",
      anchors.labelTableRegion.x,
      anchors.labelTableRegion.y,
      anchors.labelTableRegion.width,
      anchors.labelTableRegion.height,
      "#0d1a34",
      0.8,
    ),
  );
  lines.push({
    id: "label-table-split",
    x1: anchors.labelTableRegion.x + anchors.labelTableRegion.splitX,
    y1: anchors.labelTableRegion.y,
    x2: anchors.labelTableRegion.x + anchors.labelTableRegion.splitX,
    y2: anchors.labelTableRegion.y + anchors.labelTableRegion.height,
    stroke: "#0d1a34",
    strokeWidth: 0.7,
  });
  lines.push({
    id: "label-table-heading",
    x1: anchors.labelTableRegion.x,
    y1: anchors.labelTableRegion.headingY,
    x2: anchors.labelTableRegion.x + anchors.labelTableRegion.width,
    y2: anchors.labelTableRegion.headingY,
    stroke: "#0d1a34",
    strokeWidth: 0.7,
  });

  const leftLabelRows = fields.labelTableA.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const rightLabelRows = fields.labelTableB.split(/\r?\n/).filter((line) => line.trim().length > 0);

  const texts: Page1OverlayText[] = [
    {
      id: "notes-title",
      value: "NOTES",
      x: anchors.notesTitleAnchor.x,
      y: anchors.notesTitleAnchor.y,
      tone: "fieldLabel",
    },
    {
      id: "overall-length",
      value: valueOrDash(fields.overallLength),
      x: anchors.overallLengthAnchor.x,
      y: anchors.overallLengthAnchor.y,
      textAnchor: "middle",
      tone: "fieldValue",
    },
    {
      id: "label-a",
      value: valueOrDash(fields.labelA),
      x: anchors.labelAAnchor.x,
      y: anchors.labelAAnchor.y,
      textAnchor: "middle",
      tone: "fieldValue",
    },
    {
      id: "label-b",
      value: valueOrDash(fields.labelB),
      x: anchors.labelBAnchor.x,
      y: anchors.labelBAnchor.y,
      textAnchor: "middle",
      tone: "fieldValue",
    },
    {
      id: "connector-left-label",
      value: valueOrDash(fields.labelA),
      x: anchors.connectorBlocks.left.x + anchors.connectorBlocks.left.width / 2,
      y: anchors.connectorBlocks.left.y + anchors.connectorBlocks.left.height / 2 + 1.5,
      textAnchor: "middle",
      tone: "fieldValue",
    },
    {
      id: "connector-right-label",
      value: valueOrDash(fields.labelB),
      x: anchors.connectorBlocks.right.x + anchors.connectorBlocks.right.width / 2,
      y: anchors.connectorBlocks.right.y + anchors.connectorBlocks.right.height / 2 + 1.5,
      textAnchor: "middle",
      tone: "fieldValue",
    },
    {
      id: "flag-zone-left-label",
      value: "FLAG LABEL ZONE (25-75 MM)",
      x: anchors.flagZones.left.x + 2,
      y: anchors.flagZones.left.y + anchors.flagZones.left.height - 2,
      tone: "fieldLabel",
    },
    {
      id: "flag-zone-right-label",
      value: "FLAG LABEL ZONE (25-75 MM)",
      x: anchors.flagZones.right.x + 2,
      y: anchors.flagZones.right.y + anchors.flagZones.right.height - 2,
      tone: "fieldLabel",
    },
    {
      id: "label-table-col-a",
      value: "A",
      x: anchors.labelTableRegion.x + anchors.labelTableRegion.splitX / 2,
      y: anchors.labelTableRegion.y + 10,
      textAnchor: "middle",
      tone: "fieldLabel",
    },
    {
      id: "label-table-col-b",
      value: "B",
      x: anchors.labelTableRegion.x + anchors.labelTableRegion.splitX + (anchors.labelTableRegion.width - anchors.labelTableRegion.splitX) / 2,
      y: anchors.labelTableRegion.y + 10,
      textAnchor: "middle",
      tone: "fieldLabel",
    },
    ...leftLabelRows.map((line, index) => ({
      id: `label-table-a-${index}`,
      value: line,
      x: anchors.labelTableRegion.x + 4,
      y: anchors.labelTableRegion.valueStartY + index * anchors.labelTableRegion.valueLineGap,
      tone: "fieldValue" as const,
    })),
    ...rightLabelRows.map((line, index) => ({
      id: `label-table-b-${index}`,
      value: line,
      x: anchors.labelTableRegion.x + anchors.labelTableRegion.splitX + 4,
      y: anchors.labelTableRegion.valueStartY + index * anchors.labelTableRegion.valueLineGap,
      tone: "fieldValue" as const,
    })),
    {
      id: "approval-ee-label",
      value: "EE",
      x: anchors.approvalsRegion.x,
      y: anchors.approvalsRegion.y,
      tone: "fieldLabel",
    },
    {
      id: "approval-ee-value",
      value: `${valueOrDash(fields.approvals.eeName)}  ${valueOrDash(fields.approvals.eeDate)}`,
      x: anchors.approvalsRegion.x + anchors.approvalsRegion.valueOffsetX,
      y: anchors.approvalsRegion.y,
      tone: "fieldValue",
    },
    {
      id: "approval-me-label",
      value: "ME",
      x: anchors.approvalsRegion.x,
      y: anchors.approvalsRegion.y + anchors.approvalsRegion.rowGap,
      tone: "fieldLabel",
    },
    {
      id: "approval-me-value",
      value: `${valueOrDash(fields.approvals.meName)}  ${valueOrDash(fields.approvals.meDate)}`,
      x: anchors.approvalsRegion.x + anchors.approvalsRegion.valueOffsetX,
      y: anchors.approvalsRegion.y + anchors.approvalsRegion.rowGap,
      tone: "fieldValue",
    },
    {
      id: "approval-tech-label",
      value: "TECH",
      x: anchors.approvalsRegion.x,
      y: anchors.approvalsRegion.y + anchors.approvalsRegion.rowGap * 2,
      tone: "fieldLabel",
    },
    {
      id: "approval-tech-value",
      value: `${valueOrDash(fields.approvals.techName)}  ${valueOrDash(fields.approvals.techDate)}`,
      x: anchors.approvalsRegion.x + anchors.approvalsRegion.valueOffsetX,
      y: anchors.approvalsRegion.y + anchors.approvalsRegion.rowGap * 2,
      tone: "fieldValue",
    },
    {
      id: "reference-docs",
      value: `REF: ${valueOrDash(fields.referenceDocuments)}  DATE: ${valueOrDash(fields.todayDate)}`,
      x: anchors.referenceAnchor.x,
      y: anchors.referenceAnchor.y,
      tone: "fieldLabel",
    },
    ...noteTexts,
    ...revisionTexts,
    ...titleTexts,
    ...callouts.map((callout) => ({
      id: `callout-text-${callout.id}`,
      value: callout.value,
      x: callout.x,
      y: callout.y + anchors.calloutTextOffsetY,
      textAnchor: "middle" as const,
      tone: "callout" as const,
    })),
  ];

  return {
    sceneWidth: anchors.templatePageSizePt.width,
    sceneHeight: anchors.templatePageSizePt.height,
    texts,
    markers,
    callouts,
    lines,
    polygons,
  };
}
