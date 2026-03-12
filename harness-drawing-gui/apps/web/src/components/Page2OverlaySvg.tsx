import type { Page2OverlayModel, Page2OverlayTransform } from "@harness/render";

type Page2OverlaySvgProps = {
  overlay: Page2OverlayModel;
  transform: Page2OverlayTransform;
};

export function Page2OverlaySvg({ overlay, transform }: Page2OverlaySvgProps) {
  return (
    <g
      transform={`matrix(${transform.scaleX} 0 0 ${transform.scaleY} ${transform.offsetX} ${transform.offsetY})`}
    >
      {overlay.polygons.map((polygon) => (
        <polygon
          key={polygon.id}
          points={polygon.points.map((point) => `${point.x},${point.y}`).join(" ")}
          stroke={polygon.stroke}
          strokeWidth={polygon.strokeWidth}
          fill={polygon.fill ?? "none"}
        />
      ))}

      {overlay.auxLines.map((line) => (
        <line
          key={line.id}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke={line.stroke}
          strokeWidth={line.strokeWidth}
        />
      ))}

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
                  : text.tone === "tooling"
                    ? "svg-tooling"
                    : text.tone === "legend"
                      ? "svg-legend"
                      : text.tone === "pinHint"
                        ? "svg-pin-hint"
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
