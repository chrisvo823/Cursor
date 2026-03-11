import type { Page1OverlayFields } from "@harness/render";
import {
  HARNESS_PROJECT_SCHEMA_VERSION,
  ProjectSchemaError,
  parseProjectJson,
  type HarnessProjectDocumentV1,
  type NormalizedPinout,
} from "@harness/shared";
import type { ActivePreviewPage } from "../preview/usePreviewState";
import type { LoadedTemplatePdf } from "../template/loadTemplatePdf";

export type BuildProjectDocumentInput = {
  template: LoadedTemplatePdf;
  pinout: NormalizedPinout;
  page1Fields: Page1OverlayFields;
  page2: {
    linePitchMm: number;
    autoExpandConnectorColumns: boolean;
    connectors: {
      leftName: string;
      rightName: string;
      leftSubtitle: string;
      rightSubtitle: string;
    };
  };
  activePage: ActivePreviewPage;
};

export function buildProjectDocument(input: BuildProjectDocumentInput): HarnessProjectDocumentV1 {
  return {
    schemaVersion: HARNESS_PROJECT_SCHEMA_VERSION,
    savedAtIso: new Date().toISOString(),
    template: {
      fileName: input.template.fileName,
      pageCount: input.template.pageCount,
      pages: [
        { ...input.template.pages[0], pageNumber: 1 },
        { ...input.template.pages[1], pageNumber: 2 },
      ],
    },
    pinout: {
      sourceName: input.pinout.sourceName ?? "pinout",
      normalized: input.pinout,
    },
    page1: input.page1Fields,
    page2: {
      layout: {
        linePitchMm: input.page2.linePitchMm,
        autoExpandConnectorColumns: input.page2.autoExpandConnectorColumns,
      },
      connectors: input.page2.connectors,
    },
    ui: {
      activePage: input.activePage,
    },
  };
}

export function projectDocumentToLoadedTemplate(document: HarnessProjectDocumentV1): LoadedTemplatePdf {
  return {
    fileName: document.template.fileName,
    pageCount: document.template.pageCount,
    pages: [
      {
        pageNumber: 1,
        widthPt: document.template.pages[0].widthPt,
        heightPt: document.template.pages[0].heightPt,
        bitmapWidthPx: document.template.pages[0].bitmapWidthPx,
        bitmapHeightPx: document.template.pages[0].bitmapHeightPx,
        imageDataUrl: document.template.pages[0].imageDataUrl,
      },
      {
        pageNumber: 2,
        widthPt: document.template.pages[1].widthPt,
        heightPt: document.template.pages[1].heightPt,
        bitmapWidthPx: document.template.pages[1].bitmapWidthPx,
        bitmapHeightPx: document.template.pages[1].bitmapHeightPx,
        imageDataUrl: document.template.pages[1].imageDataUrl,
      },
    ],
  };
}

export function parseProjectFileText(text: string): HarnessProjectDocumentV1 {
  return parseProjectJson(text);
}

export function serializeProjectDocument(document: HarnessProjectDocumentV1): string {
  return JSON.stringify(document, null, 2);
}

export function validateLoadedProjectOrThrow(document: HarnessProjectDocumentV1): HarnessProjectDocumentV1 {
  if (!document.template || !document.pinout) {
    throw new ProjectSchemaError("INVALID_SCHEMA", "Project is missing required template or pinout sections.");
  }
  return document;
}
