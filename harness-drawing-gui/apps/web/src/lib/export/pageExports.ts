import {
  buildPage1ExportPrimitives,
  buildPage1TemplateCalibration,
  buildPage2ExportPrimitives,
  buildPage2OverlayModel,
  buildPage2TemplateCalibration,
  exportDxfDocument,
  exportSvgDocument,
  type Page1TemplateAnchorConfig,
  type Page1OverlayModel,
  type Page2TemplateAnchorConfig,
  type Page2Scene,
} from "@harness/render";
import type { LoadedTemplatePdf, TemplateRasterizedPage } from "../template/loadTemplatePdf";

function pageSizeToPointTarget(page: TemplateRasterizedPage): { width: number; height: number } {
  return {
    width: page.widthPt,
    height: page.heightPt,
  };
}

export function buildPage1PrimitivesForExport(
  templatePage: TemplateRasterizedPage,
  page1OverlayModel: Page1OverlayModel,
  templateAnchors: Page1TemplateAnchorConfig,
) {
  const calibration = buildPage1TemplateCalibration({
    templateAnchors,
    templatePageSizePt: {
      width: templatePage.widthPt,
      height: templatePage.heightPt,
    },
    targetViewportSizePx: pageSizeToPointTarget(templatePage),
  });
  return buildPage1ExportPrimitives(page1OverlayModel, calibration.overlayToViewportPx);
}

export function buildPage2PrimitivesForExport(
  templatePage: TemplateRasterizedPage,
  scene: Page2Scene,
  templateAnchors: Page2TemplateAnchorConfig,
) {
  const overlayModel = buildPage2OverlayModel(scene);
  const calibration = buildPage2TemplateCalibration({
    scene,
    templateAnchors,
    templatePageSizePt: {
      width: templatePage.widthPt,
      height: templatePage.heightPt,
    },
    targetViewportSizePx: pageSizeToPointTarget(templatePage),
  });
  return buildPage2ExportPrimitives(overlayModel, calibration.overlayToViewportPx);
}

export function exportCurrentPageSvg(
  template: LoadedTemplatePdf,
  activePage: 1 | 2,
  page1OverlayModel: Page1OverlayModel,
  page2Scene: Page2Scene | null,
  templateAnchors: {
    page1: Page1TemplateAnchorConfig;
    page2: Page2TemplateAnchorConfig;
  },
): string {
  const page = template.pages[activePage - 1];
  if (activePage === 1) {
    const primitives = buildPage1PrimitivesForExport(page, page1OverlayModel, templateAnchors.page1);
    return exportSvgDocument({
      width: page.widthPt,
      height: page.heightPt,
      backgroundImageDataUrl: page.imageDataUrl,
      primitives,
    });
  }

  if (!page2Scene) {
    throw new Error("Cannot export Page 2 SVG before pinout is loaded.");
  }
  const primitives = buildPage2PrimitivesForExport(page, page2Scene, templateAnchors.page2);
  return exportSvgDocument({
    width: page.widthPt,
    height: page.heightPt,
    backgroundImageDataUrl: page.imageDataUrl,
    primitives,
  });
}

export function exportPage2Dxf(
  template: LoadedTemplatePdf,
  page2Scene: Page2Scene,
  templateAnchors: Page2TemplateAnchorConfig,
): string {
  const page2 = template.pages[1];
  const primitives = buildPage2PrimitivesForExport(page2, page2Scene, templateAnchors);
  return exportDxfDocument({
    pageHeight: page2.heightPt,
    primitives,
  });
}
