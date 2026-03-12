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
  const page1Template = template.data?.pages[0] ?? null;
  const page2Template = template.data?.pages[1] ?? null;

  const overlayModel = useMemo(() => {
    if (!page2Scene) return null;
    return buildPage2OverlayModel(page2Scene);
  }, [page2Scene]);

  const overlayTransform = useMemo(() => {
    if (!page2Template || !overlayModel) return null;
    if (!page2Scene) return null;
    const calibration = buildPage2TemplateCalibration({
      scene: page2Scene,
      templateAnchors: page2TemplateAnchors,
      templatePageSizePt: {
        width: page2Template.widthPt,
        height: page2Template.heightPt,
      },
      targetViewportSizePx: {
        width: page2Template.bitmapWidthPx,
        height: page2Template.bitmapHeightPx,
      },
    });
    return calibration.overlayToViewportPx;
  }, [overlayModel, page2Scene, page2TemplateAnchors, page2Template]);

  const page1OverlayTransform = useMemo(() => {
    if (!page1Template) return null;
    const calibration = buildPage1TemplateCalibration({
      templateAnchors: page1TemplateAnchors,
      templatePageSizePt: {
        width: page1Template.widthPt,
        height: page1Template.heightPt,
      },
      targetViewportSizePx: {
        width: page1Template.bitmapWidthPx,
        height: page1Template.bitmapHeightPx,
      },
    });
    return calibration.overlayToViewportPx;
  }, [page1Template, page1TemplateAnchors]);

  useEffect(() => {
    centerScroll(paperWrapRef.current);
  }, [activePage, page1Template?.imageDataUrl, page2Template?.imageDataUrl]);

  const renderPageSvg = (
    pageNumber: 1 | 2,
    options: {
      className?: string;
      ariaLabel?: string;
    } = {},
  ) => {
    const templatePage = pageNumber === 1 ? page1Template : page2Template;
    if (!templatePage) return null;
    return (
      <svg
        viewBox={`0 0 ${templatePage.bitmapWidthPx} ${templatePage.bitmapHeightPx}`}
        className={options.className ?? "paper-svg"}
        style={{ aspectRatio: `${templatePage.widthPt} / ${templatePage.heightPt}` }}
        aria-label={options.ariaLabel ?? `Harness page ${pageNumber} preview`}
      >
        <image
          href={templatePage.imageDataUrl}
          x={0}
          y={0}
          width={templatePage.bitmapWidthPx}
          height={templatePage.bitmapHeightPx}
          preserveAspectRatio="none"
        />

        {pageNumber === 2 && overlayModel && overlayTransform ? (
          <Page2OverlaySvg overlay={overlayModel} transform={overlayTransform} />
        ) : null}

        {pageNumber === 1 && page1OverlayTransform ? (
          <Page1OverlaySvg overlay={page1OverlayModel} transform={page1OverlayTransform} />
        ) : null}

        {pageNumber === 2 && !overlayModel ? (
          <text x={20} y={30} className="svg-overlay-note">
            Upload pinout file to render Page 2 overlay.
          </text>
        ) : null}
      </svg>
    );
  };

  return (
    <section className="preview-pane">
      <div className="preview-header">
        <div>
          <div className="preview-title">
            Drawing preview · {activePage === "split" ? "Split View" : `Page ${activePage}`}
          </div>
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

        {activePage === "split" ? (
          <div className="paper-split">
            {renderPageSvg(1, { className: "paper-svg paper-split-item", ariaLabel: "Harness page 1 split preview" })}
            {renderPageSvg(2, { className: "paper-svg paper-split-item", ariaLabel: "Harness page 2 split preview" })}
          </div>
        ) : activePage === 1 ? (
          renderPageSvg(1)
        ) : null}

        {activePage === 2 ? renderPageSvg(2) : null}
      </div>
    </section>
  );
}
