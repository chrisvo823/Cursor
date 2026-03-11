import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { TemplateValidationError, validateTemplateFile, validateTemplatePageCount } from "./templateValidation";

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export type TemplateRasterizedPage = {
  pageNumber: number;
  widthPt: number;
  heightPt: number;
  bitmapWidthPx: number;
  bitmapHeightPx: number;
  imageDataUrl: string;
};

export type LoadedTemplatePdf = {
  fileName: string;
  pageCount: number;
  pages: [TemplateRasterizedPage, TemplateRasterizedPage];
};

const TARGET_BITMAP_WIDTH = 1800;

async function rasterizePage(pageProxy: any, pageNumber: number) {
  const baseViewport = pageProxy.getViewport({ scale: 1 });
  const pageScale = TARGET_BITMAP_WIDTH / baseViewport.width;
  const viewport = pageProxy.getViewport({ scale: pageScale });

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    throw new TemplateValidationError("PDF_LOAD_FAILED", "Failed to create canvas context for PDF rasterization.");
  }

  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);

  await pageProxy.render({
    canvasContext: context,
    viewport,
  }).promise;

  return {
    pageNumber,
    widthPt: baseViewport.width,
    heightPt: baseViewport.height,
    bitmapWidthPx: canvas.width,
    bitmapHeightPx: canvas.height,
    imageDataUrl: canvas.toDataURL("image/png"),
  };
}

export async function loadTemplatePdf(file: File): Promise<LoadedTemplatePdf> {
  validateTemplateFile(file);

  try {
    const bytes = await file.arrayBuffer();
    const task = getDocument({ data: bytes });
    const pdf = await task.promise;

    validateTemplatePageCount(pdf.numPages);

    const page1 = await pdf.getPage(1);
    const page2 = await pdf.getPage(2);
    const pages: [TemplateRasterizedPage, TemplateRasterizedPage] = [
      await rasterizePage(page1, 1),
      await rasterizePage(page2, 2),
    ];

    return {
      fileName: file.name,
      pageCount: pdf.numPages,
      pages,
    };
  } catch (error) {
    if (error instanceof TemplateValidationError) throw error;
    throw new TemplateValidationError("PDF_LOAD_FAILED", "Failed to load or rasterize template PDF.");
  }
}
