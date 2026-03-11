import type { Page2OverlayModel, Page2OverlayTransform } from "@harness/render";

type Page2OverlaySvgProps = {
  overlay: Page2OverlayModel;
  transform: Page2OverlayTransform;
};

export function Page2OverlaySvg({ overlay, transform }: Page2OverlaySvgProps) {
  return (
    <g transform={`translate(${transform.offsetX} ${transform.offsetY}) scale(${transform.scale})`}>
      <rect
        x={overlay.columns.left.x}
        y={overlay.columns.left.y}
        width={overlay.columns.left.width}
        height={overlay.columns.left.height}
        fill="rgba(255,247,168,0.88)"
        stroke="#111"
        strokeWidth="0.8"
      />
      <rect
        x={overlay.columns.right.x}
        y={overlay.columns.right.y}
        width={overlay.columns.right.width}
        height={overlay.columns.right.height}
        fill="rgba(255,247,168,0.88)"
        stroke="#111"
        strokeWidth="0.8"
      />

      <line x1={overlay.rails.left.x1} y1={overlay.rails.left.y1} x2={overlay.rails.left.x2} y2={overlay.rails.left.y2} className="svg-rail" />
      <line x1={overlay.rails.right.x1} y1={overlay.rails.right.y1} x2={overlay.rails.right.x2} y2={overlay.rails.right.y2} className="svg-rail" />

      {overlay.pinDots.map((dot, index) => (
        <circle key={`dot-${index}`} cx={dot.x} cy={dot.y} r="1.4" fill="#111" />
      ))}

      {overlay.pinLabels.map((label) => (
        <text key={label.id} x={label.x} y={label.y} textAnchor={label.textAnchor} className="svg-pin">
          {label.value}
        </text>
      ))}

      {overlay.wires.map((wire) => (
        <line key={wire.id} x1={wire.x1} y1={wire.y1} x2={wire.x2} y2={wire.y2} className="svg-wire" />
      ))}

      {overlay.texts.map((text) => (
        <text
          key={text.id}
          x={text.x}
          y={text.y}
          textAnchor={text.textAnchor}
          className={
            text.tone === "heading"
              ? "svg-heading"
              : text.tone === "subheading"
                ? "svg-subheading"
                : text.tone === "meta"
                  ? "svg-meta"
                  : text.tone === "labelRight"
                    ? "svg-label-right"
                    : "svg-label-left"
          }
        >
          {text.value}
        </text>
      ))}

      {overlay.figure8Markers.map((marker) => (
        <circle
          key={marker.id}
          cx={marker.x}
          cy={marker.y}
          r={marker.radius}
          fill="none"
          stroke="#111"
          strokeWidth="0.7"
        />
      ))}
    </g>
  );
}
