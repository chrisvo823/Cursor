import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { Page2OverlayModel } from "@harness/render";
import { Page2OverlaySvg } from "../components/Page2OverlaySvg";

const overlayModel: Page2OverlayModel = {
  sceneWidth: 720,
  sceneHeight: 405,
  pinDots: [{ x: 215, y: 120 }],
  pinLabels: [{ id: "pin-1", value: "1", x: 210, y: 122, textAnchor: "end" }],
  wires: [{ id: "wire-1", x1: 215, y1: 120, x2: 493, y2: 140 }],
  texts: [
    { id: "heading-left", value: "P2", x: 196, y: 70, textAnchor: "middle", tone: "heading" },
    { id: "meta-1", value: "W101 · 22AWG · WHT", x: 320, y: 130, textAnchor: "middle", tone: "meta" },
  ],
  figure8Markers: [
    { id: "tp-a", x: 223, y: 118, radius: 1.5 },
    { id: "tp-b", x: 223, y: 122, radius: 1.5 },
  ],
};

describe("Page2OverlaySvg", () => {
  it("renders only dynamic overlay entities", () => {
    const markup = renderToStaticMarkup(
      <svg viewBox="0 0 1800 1013">
        <Page2OverlaySvg
          overlay={overlayModel}
          transform={{ scaleX: 2.5, scaleY: 2.5, offsetX: 0, offsetY: 0 }}
        />
      </svg>,
    );

    expect(markup).toContain("<line");
    expect((markup.match(/<circle/g) ?? []).length).toBeGreaterThanOrEqual(3);
    expect(markup).toContain("class=\"svg-pin\"");
    expect(markup).toContain("class=\"svg-meta\"");
    expect(markup).toContain("P2");
    expect(markup).not.toContain("<rect");
  });
});
