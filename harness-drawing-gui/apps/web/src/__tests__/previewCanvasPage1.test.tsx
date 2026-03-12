import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  SAMPLE_LADDER_26PIN_PAGE1_TEMPLATE_ANCHORS,
  SAMPLE_LADDER_26PIN_PAGE2_TEMPLATE_ANCHORS,
  buildPage1OverlayModel,
} from "@harness/render";
import { createDefaultPage1Fields } from "../lib/page1/page1Fields";
import { PreviewCanvas } from "../components/PreviewCanvas";
import type { ResourceState } from "../lib/preview/previewStateModel";
import type { LoadedTemplatePdf } from "../lib/template/loadTemplatePdf";

const templateFixture: ResourceState<LoadedTemplatePdf> = {
  status: "loaded" as const,
  error: null,
  data: {
    fileName: "Example.pdf",
    pageCount: 2,
    pages: [
      {
        pageNumber: 1 as const,
        widthPt: 720,
        heightPt: 405,
        bitmapWidthPx: 1800,
        bitmapHeightPx: 1013,
        imageDataUrl:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+yf9QAAAAASUVORK5CYII=",
      },
      {
        pageNumber: 2 as const,
        widthPt: 720,
        heightPt: 405,
        bitmapWidthPx: 1800,
        bitmapHeightPx: 1013,
        imageDataUrl:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+yf9QAAAAASUVORK5CYII=",
      },
    ],
  },
};

describe("PreviewCanvas Page 1 render path", () => {
  it("renders page1 template image and overlay text when active page is 1", () => {
    const page1OverlayModel = buildPage1OverlayModel(
      createDefaultPage1Fields(),
      SAMPLE_LADDER_26PIN_PAGE1_TEMPLATE_ANCHORS,
    );
    const markup = renderToStaticMarkup(
      <PreviewCanvas
        activePage={1}
        template={templateFixture}
        page1OverlayModel={page1OverlayModel}
        page2Scene={null}
        page1TemplateAnchors={SAMPLE_LADDER_26PIN_PAGE1_TEMPLATE_ANCHORS}
        page2TemplateAnchors={SAMPLE_LADDER_26PIN_PAGE2_TEMPLATE_ANCHORS}
      />,
    );

    expect(markup).toContain('aria-label="Harness page 1 preview"');
    expect(markup).toContain("<image");
    expect(markup).toContain("svg-page1-field-value");
    expect(markup).toContain("130 MM");
  });
});
