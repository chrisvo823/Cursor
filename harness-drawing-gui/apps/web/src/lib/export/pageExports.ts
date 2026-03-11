import {
  DEFAULT_PAGE1_TEMPLATE_ANCHORS,
  DEFAULT_PAGE2_TEMPLATE_ANCHORS,
  buildPage1ExportPrimitives,
  buildPage1TemplateCalibration,
  buildPage2ExportPrimitives,
  buildPage2OverlayModel,
  buildPage2TemplateCalibration,
  exportDxfDocument,
  exportSvgDocument,
  type Page1OverlayModel,
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
) {
  const calibration = buildPage1TemplateCalibration({
    templateAnchors: DEFAULT_PAGE1_TEMPLATE_ANCHORS,
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
) {
  const overlayModel = buildPage2OverlayModel(scene);
  const calibration = buildPage2TemplateCalibration({
    scene,
    templateAnchors: DEFAULT_PAGE2_TEMPLATE_ANCHORS,
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
): string {
  const page = template.pages[activePage - 1];
  if (activePage === 1) {
    const primitives = buildPage1PrimitivesForExport(page, page1OverlayModel);
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
  const primitives = buildPage2PrimitivesForExport(page, page2Scene);
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
): string {
  const page2 = template.pages[1];
  const primitives = buildPage2PrimitivesForExport(page2, page2Scene);
  return exportDxfDocument({
    pageHeight: page2.heightPt,
    primitives,
  });
}
