import {
  buildPage1TemplateCalibration,
  buildPage2OverlayModel,
  buildPage2TemplateCalibration,
  type Page1TemplateAnchorConfig,
  type Page1OverlayModel,
  type Page2TemplateAnchorConfig,
  type Page2Scene,
} from "@harness/render";
import { useEffect, useMemo, useRef } from "react";
import type { ActivePreviewPage } from "../lib/preview/usePreviewState";
import type { ResourceState } from "../lib/preview/previewStateModel";
import type { LoadedTemplatePdf } from "../lib/template/loadTemplatePdf";
import { Page1OverlaySvg } from "./Page1OverlaySvg";
import { Page2OverlaySvg } from "./Page2OverlaySvg";

type PreviewCanvasProps = {
  activePage: ActivePreviewPage;
  template: ResourceState<LoadedTemplatePdf>;
  page1OverlayModel: Page1OverlayModel;
  page2Scene: Page2Scene | null;
  page1TemplateAnchors: Page1TemplateAnchorConfig;
  page2TemplateAnchors: Page2TemplateAnchorConfig;
};

function centerScroll(container: HTMLDivElement | null): void {
  if (!container) return;
  container.scrollLeft = Math.max((container.scrollWidth - container.clientWidth) / 2, 0);
  container.scrollTop = Math.max((container.scrollHeight - container.clientHeight) / 2, 0);
}

export function PreviewCanvas({
  activePage,
  template,
  page1OverlayModel,
  page2Scene,
  page1TemplateAnchors,
  page2TemplateAnchors,
}: PreviewCanvasProps) {
  const paperWrapRef = useRef<HTMLDivElement>(null);
  const templatePage = template.data ? template.data.pages[activePage - 1] : null;

  const overlayModel = useMemo(() => {
    if (activePage !== 2 || !page2Scene) return null;
    return buildPage2OverlayModel(page2Scene);
  }, [activePage, page2Scene]);

  const overlayTransform = useMemo(() => {
    if (!templatePage || !overlayModel) return null;
    if (!page2Scene) return null;
    const calibration = buildPage2TemplateCalibration({
      scene: page2Scene,
      templateAnchors: page2TemplateAnchors,
      templatePageSizePt: {
        width: templatePage.widthPt,
        height: templatePage.heightPt,
      },
      targetViewportSizePx: {
        width: templatePage.bitmapWidthPx,
        height: templatePage.bitmapHeightPx,
      },
    });
    return calibration.overlayToViewportPx;
  }, [overlayModel, page2Scene, page2TemplateAnchors, templatePage]);

  const page1OverlayTransform = useMemo(() => {
    if (!templatePage) return null;
    const calibration = buildPage1TemplateCalibration({
      templateAnchors: page1TemplateAnchors,
      templatePageSizePt: {
        width: templatePage.widthPt,
        height: templatePage.heightPt,
      },
      targetViewportSizePx: {
        width: templatePage.bitmapWidthPx,
        height: templatePage.bitmapHeightPx,
      },
    });
    return calibration.overlayToViewportPx;
  }, [page1TemplateAnchors, templatePage]);

  useEffect(() => {
    centerScroll(paperWrapRef.current);
  }, [activePage, templatePage?.imageDataUrl]);

  return (
    <section className="preview-pane">
      <div className="preview-header">
        <div>
          <div className="preview-title">Drawing preview · Page {activePage}</div>
          <div className="preview-subtitle">Template bitmap background + vector overlay scene</div>
        </div>
        <div className="button-row">
          <button onClick={() => centerScroll(paperWrapRef.current)}>Recenter</button>
          <button onClick={() => paperWrapRef.current?.scrollTo({ left: 0, top: 0, behavior: "smooth" })}>Reset</button>
        </div>
      </div>

      <div className="paper-wrap" ref={paperWrapRef}>
        {template.status === "loading" ? <div className="preview-message">Loading template PDF…</div> : null}
        {template.status === "error" ? <div className="preview-message preview-error">{template.error}</div> : null}
        {template.status === "idle" ? (
          <div className="preview-message">Upload a 2-page template PDF and a pinout file to start previewing.</div>
        ) : null}

        {templatePage ? (
          <svg
            viewBox={`0 0 ${templatePage.bitmapWidthPx} ${templatePage.bitmapHeightPx}`}
            className="paper-svg"
            style={{ aspectRatio: `${templatePage.widthPt} / ${templatePage.heightPt}` }}
            aria-label={`Harness page ${activePage} preview`}
          >
            <image
              href={templatePage.imageDataUrl}
              x={0}
              y={0}
              width={templatePage.bitmapWidthPx}
              height={templatePage.bitmapHeightPx}
              preserveAspectRatio="none"
            />

            {activePage === 2 && overlayModel && overlayTransform ? (
              <Page2OverlaySvg overlay={overlayModel} transform={overlayTransform} />
            ) : null}

            {activePage === 1 && page1OverlayTransform ? (
              <Page1OverlaySvg overlay={page1OverlayModel} transform={page1OverlayTransform} />
            ) : null}

            {activePage === 2 && !overlayModel ? (
              <text x={20} y={30} className="svg-overlay-note">
                Upload pinout file to render Page 2 overlay.
              </text>
            ) : null}
          </svg>
        ) : null}
      </div>
    </section>
  );
}
