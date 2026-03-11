import { buildPage2OverlayModel, computeOverlayTransform, type Page2Scene } from "@harness/render";
import { useEffect, useMemo, useRef } from "react";
import type { ActivePreviewPage } from "../lib/preview/usePreviewState";
import type { ResourceState } from "../lib/preview/previewStateModel";
import type { LoadedTemplatePdf } from "../lib/template/loadTemplatePdf";
import { Page2OverlaySvg } from "./Page2OverlaySvg";

type PreviewCanvasProps = {
  activePage: ActivePreviewPage;
  template: ResourceState<LoadedTemplatePdf>;
  page2Scene: Page2Scene | null;
};

function centerScroll(container: HTMLDivElement | null): void {
  if (!container) return;
  container.scrollLeft = Math.max((container.scrollWidth - container.clientWidth) / 2, 0);
  container.scrollTop = Math.max((container.scrollHeight - container.clientHeight) / 2, 0);
}

export function PreviewCanvas({ activePage, template, page2Scene }: PreviewCanvasProps) {
  const paperWrapRef = useRef<HTMLDivElement>(null);
  const templatePage = template.data ? template.data.pages[activePage - 1] : null;

  const overlayModel = useMemo(() => {
    if (activePage !== 2 || !page2Scene) return null;
    return buildPage2OverlayModel(page2Scene);
  }, [activePage, page2Scene]);

  const overlayTransform = useMemo(() => {
    if (!templatePage || !overlayModel) return null;
    return computeOverlayTransform({
      sceneWidth: overlayModel.sceneWidth,
      sceneHeight: overlayModel.sceneHeight,
      targetWidth: templatePage.bitmapWidthPx,
      targetHeight: templatePage.bitmapHeightPx,
    });
  }, [overlayModel, templatePage]);

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

            {activePage === 2 && !overlayModel ? (
              <text x={20} y={30} className="svg-overlay-note">
                Upload pinout file to render Page 2 overlay.
              </text>
            ) : null}

            {activePage === 1 ? (
              <text x={20} y={30} className="svg-overlay-note">
                Page 1 overlay rendering starts in the next milestone.
              </text>
            ) : null}
          </svg>
        ) : null}
      </div>
    </section>
  );
}
