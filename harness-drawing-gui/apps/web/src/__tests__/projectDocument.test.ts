import { describe, expect, it } from "vitest";
import { HARNESS_PROJECT_SCHEMA_VERSION, ProjectSchemaError } from "@harness/shared";
import {
  buildProjectDocument,
  parseProjectFileText,
  projectDocumentToLoadedTemplate,
  serializeProjectDocument,
} from "../lib/project/projectDocument";
import { createDefaultPage1Fields } from "../lib/page1/page1Fields";
import type { LoadedTemplatePdf } from "../lib/template/loadTemplatePdf";

const templateFixture: LoadedTemplatePdf = {
  fileName: "Template.pdf",
  pageCount: 2,
  pages: [
    {
      pageNumber: 1 as const,
      widthPt: 720,
      heightPt: 405,
      bitmapWidthPx: 1800,
      bitmapHeightPx: 1013,
      imageDataUrl: "data:image/png;base64,AAA",
    },
    {
      pageNumber: 2 as const,
      widthPt: 720,
      heightPt: 405,
      bitmapWidthPx: 1800,
      bitmapHeightPx: 1013,
      imageDataUrl: "data:image/png;base64,BBB",
    },
  ],
};

const pinoutFixture = {
  rows: [],
  pinCount: 26,
  sourceName: "Pinout.xlsx",
  diagnostics: {
    selectedSheet: "Ladder_26pin",
    ignoredRows: 0,
    warnings: [],
  },
};

describe("projectDocument utilities", () => {
  it("round-trips project json deterministically", () => {
    const document = buildProjectDocument({
      template: templateFixture,
      pinout: pinoutFixture,
      page1Fields: createDefaultPage1Fields(),
      page2: {
        linePitchMm: 9.5,
        autoExpandConnectorColumns: true,
        connectors: {
          leftName: "P2",
          rightName: "P4",
          leftSubtitle: "LEFT",
          rightSubtitle: "RIGHT",
        },
      },
      activePage: 2,
    });
    expect(document.schemaVersion).toBe(HARNESS_PROJECT_SCHEMA_VERSION);

    const json = serializeProjectDocument(document);
    const parsed = parseProjectFileText(json);
    const loadedTemplate = projectDocumentToLoadedTemplate(parsed);

    expect(parsed.page2.connectors.leftName).toBe("P2");
    expect(parsed.page1.callouts).toHaveLength(createDefaultPage1Fields().callouts.length);
    expect(loadedTemplate.pages[0].imageDataUrl).toContain("data:image/png");
  });

  it("throws for incompatible schema versions", () => {
    const badJson = JSON.stringify({
      schemaVersion: HARNESS_PROJECT_SCHEMA_VERSION + 1,
      template: { fileName: "x", pageCount: 2, pages: [] },
    });
    expect(() => parseProjectFileText(badJson)).toThrow(ProjectSchemaError);
  });
});
