import { describe, expect, it } from "vitest";
import {
  SAMPLE_LADDER_26PIN_PAGE1_TEMPLATE_ANCHORS,
  SAMPLE_LADDER_26PIN_PAGE2_TEMPLATE_ANCHORS,
  buildPage1OverlayModel,
} from "@harness/render";
import { createDefaultPage1Fields } from "../lib/page1/page1Fields";
import { exportCurrentPageSvg } from "../lib/export/pageExports";
import type { LoadedTemplatePdf } from "../lib/template/loadTemplatePdf";

const templateFixture: LoadedTemplatePdf = {
  fileName: "Example.pdf",
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

describe("pageExports", () => {
  it("exports non-blank page1 svg output", () => {
    const page1OverlayModel = buildPage1OverlayModel(
      createDefaultPage1Fields(),
      SAMPLE_LADDER_26PIN_PAGE1_TEMPLATE_ANCHORS,
    );

    const svg = exportCurrentPageSvg(templateFixture, 1, page1OverlayModel, null, {
      page1: SAMPLE_LADDER_26PIN_PAGE1_TEMPLATE_ANCHORS,
      page2: SAMPLE_LADDER_26PIN_PAGE2_TEMPLATE_ANCHORS,
    });

    expect(svg).toContain("<svg");
    expect(svg).toContain("<image");
    expect(svg).toContain("<text");
    expect(svg).toContain("130 MM");
  });
});
