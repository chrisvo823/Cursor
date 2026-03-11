import type { Page1OverlayModel, Page2OverlayTransform } from "@harness/render";

type Page1OverlaySvgProps = {
  overlay: Page1OverlayModel;
  transform: Page2OverlayTransform;
};

function trianglePoints(cx: number, cy: number, size: number): string {
  const x1 = cx;
  const y1 = cy - size;
  const x2 = cx - size * 0.9;
  const y2 = cy + size * 0.7;
  const x3 = cx + size * 0.9;
  const y3 = cy + size * 0.7;
  return `${x1},${y1} ${x2},${y2} ${x3},${y3}`;
}

export function Page1OverlaySvg({ overlay, transform }: Page1OverlaySvgProps) {
  return (
    <g transform={`matrix(${transform.scaleX} 0 0 ${transform.scaleY} ${transform.offsetX} ${transform.offsetY})`}>
      {overlay.callouts.map((callout) => (
        <g key={callout.id}>
          <circle cx={callout.x} cy={callout.y} r={callout.radius} className="svg-page1-callout-circle" />
        </g>
      ))}

      {overlay.texts.map((text) => (
        <text
          key={text.id}
          x={text.x}
          y={text.y}
          textAnchor={text.textAnchor}
          className={
            text.tone === "notes"
              ? "svg-page1-notes"
              : text.tone === "fieldLabel"
                ? "svg-page1-field-label"
                : text.tone === "callout"
                  ? "svg-page1-callout-text"
                  : "svg-page1-field-value"
          }
        >
          {text.value}
        </text>
      ))}

      {overlay.markers.map((marker) =>
        marker.type === "triangle" ? (
          <polygon
            key={marker.id}
            points={trianglePoints(marker.x, marker.y, marker.size)}
            className="svg-page1-marker"
          />
        ) : (
          <rect
            key={marker.id}
            x={marker.x - marker.size}
            y={marker.y - marker.size}
            width={marker.size * 2}
            height={marker.size * 2}
            className="svg-page1-marker"
          />
        ),
      )}
    </g>
  );
}
