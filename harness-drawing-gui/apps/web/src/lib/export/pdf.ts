import { PDFDocument, rgb, type PDFPage } from "pdf-lib";
import type { ExportPrimitive } from "@harness/render";
import { dataUrlToUint8Array } from "./download";

type PdfExportPage = {
  widthPt: number;
  heightPt: number;
  backgroundImageDataUrl: string;
  primitives: ExportPrimitive[];
};

type ExportDrawingPdfInput = {
  pages: [PdfExportPage, PdfExportPage];
};

function hexToRgb(color: string): { r: number; g: number; b: number } {
  const normalized = color.startsWith("#") ? color.slice(1) : color;
  if (normalized.length !== 6) return { r: 0, g: 0, b: 0 };
  const r = Number.parseInt(normalized.slice(0, 2), 16) / 255;
  const g = Number.parseInt(normalized.slice(2, 4), 16) / 255;
  const b = Number.parseInt(normalized.slice(4, 6), 16) / 255;
  return { r, g, b };
}

function toPdfY(pageHeight: number, yTop: number): number {
  return pageHeight - yTop;
}

function drawPrimitive(page: PDFPage, primitive: ExportPrimitive, pageHeight: number): void {
  if (primitive.kind === "line") {
    const stroke = hexToRgb(primitive.stroke);
    page.drawLine({
      start: { x: primitive.x1, y: toPdfY(pageHeight, primitive.y1) },
      end: { x: primitive.x2, y: toPdfY(pageHeight, primitive.y2) },
      thickness: primitive.strokeWidth,
      color: rgb(stroke.r, stroke.g, stroke.b),
    });
    return;
  }

  if (primitive.kind === "circle") {
    const stroke = hexToRgb(primitive.stroke);
    const fill = primitive.fill ? hexToRgb(primitive.fill) : undefined;
    page.drawCircle({
      x: primitive.cx,
      y: toPdfY(pageHeight, primitive.cy),
      size: primitive.r,
      borderWidth: primitive.strokeWidth,
      borderColor: rgb(stroke.r, stroke.g, stroke.b),
      color: fill ? rgb(fill.r, fill.g, fill.b) : undefined,
    });
    return;
  }

  if (primitive.kind === "polygon") {
    const points = primitive.points.map((point) => ({
      x: point.x,
      y: toPdfY(pageHeight, point.y),
    }));
    if (points.length < 2) return;
    const stroke = hexToRgb(primitive.stroke);
    for (let index = 0; index < points.length; index += 1) {
      const start = points[index];
      const end = points[(index + 1) % points.length];
      page.drawLine({
        start,
        end,
        thickness: primitive.strokeWidth,
        color: rgb(stroke.r, stroke.g, stroke.b),
      });
    }
    return;
  }

  const fill = hexToRgb(primitive.fill);
  page.drawText(primitive.text, {
    x: primitive.x,
    y: toPdfY(pageHeight, primitive.y) - primitive.size,
    size: Math.max(primitive.size, 4),
    color: rgb(fill.r, fill.g, fill.b),
  });
}

export async function exportDrawingPdf(input: ExportDrawingPdfInput): Promise<ArrayBuffer> {
  const document = await PDFDocument.create();

  for (const pageInput of input.pages) {
    const page = document.addPage([pageInput.widthPt, pageInput.heightPt]);
    const png = await document.embedPng(dataUrlToUint8Array(pageInput.backgroundImageDataUrl));
    page.drawImage(png, {
      x: 0,
      y: 0,
      width: pageInput.widthPt,
      height: pageInput.heightPt,
    });

    for (const primitive of pageInput.primitives) {
      drawPrimitive(page, primitive, pageInput.heightPt);
    }
  }

  const bytes = await document.save();
  const copied = new Uint8Array(bytes.length);
  copied.set(bytes);
  return copied.buffer;
}
