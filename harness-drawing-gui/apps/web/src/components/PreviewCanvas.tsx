import { buildPage2Scene } from "@harness/render";
import type { NormalizedPinout } from "@harness/shared";

type PreviewCanvasProps = {
  pinout: NormalizedPinout;
};

export function PreviewCanvas({ pinout }: PreviewCanvasProps) {
  const scene = buildPage2Scene(pinout, {
    linePitchMm: 9.5,
    autoExpandConnectorColumns: true,
    leftConnectorName: "P2",
    rightConnectorName: "P4",
    leftConnectorSubtitle: "TO TAIL (J2)",
    rightConnectorSubtitle: "TO I/O CARRIER (J4)",
  });

  return (
    <section className="preview-pane">
      <div className="preview-header">
        <div>
          <div className="preview-title">Page 2 preview concept</div>
          <div className="preview-subtitle">Static PDF canvas + computed overlay geometry</div>
        </div>
      </div>

      <div className="paper-wrap">
        <svg
          viewBox={`0 0 ${scene.pageSize.width} ${scene.pageSize.height}`}
          className="paper-svg"
          aria-label="Harness page 2 concept preview"
        >
          <rect x="0" y="0" width="720" height="405" fill="#e9f0ff" />

          <rect
            x={scene.leftColumn.x}
            y={scene.leftColumn.y}
            width={scene.leftColumn.width}
            height={scene.leftColumn.height}
            fill="rgba(255,247,168,0.92)"
            stroke="#111"
            strokeWidth="0.8"
          />
          <rect
            x={scene.rightColumn.x}
            y={scene.rightColumn.y}
            width={scene.rightColumn.width}
            height={scene.rightColumn.height}
            fill="rgba(255,247,168,0.92)"
            stroke="#111"
            strokeWidth="0.8"
          />

          <text x={scene.leftColumn.x + scene.leftColumn.width / 2} y={70} textAnchor="middle" className="svg-heading">
            {scene.leftColumn.name}
          </text>
          <text x={scene.rightColumn.x + scene.rightColumn.width / 2} y={70} textAnchor="middle" className="svg-heading">
            {scene.rightColumn.name}
          </text>

          <text
            x={scene.leftColumn.x + scene.leftColumn.width / 2}
            y={78}
            textAnchor="middle"
            className="svg-subheading"
          >
            {scene.leftColumn.subtitle}
          </text>
          <text
            x={scene.rightColumn.x + scene.rightColumn.width / 2}
            y={78}
            textAnchor="middle"
            className="svg-subheading"
          >
            {scene.rightColumn.subtitle}
          </text>

          <line
            x1={scene.leftColumn.railX}
            y1={scene.leftColumn.y + 8}
            x2={scene.leftColumn.railX}
            y2={scene.leftColumn.y + scene.leftColumn.height - 8}
            className="svg-rail"
          />
          <line
            x1={scene.rightColumn.railX}
            y1={scene.rightColumn.y + 8}
            x2={scene.rightColumn.railX}
            y2={scene.rightColumn.y + scene.rightColumn.height - 8}
            className="svg-rail"
          />

          {scene.pinRows.map((row) => (
            <g key={row.pin}>
              <circle cx={row.leftDot.x} cy={row.leftDot.y} r="1.4" fill="#111" />
              <circle cx={row.rightDot.x} cy={row.rightDot.y} r="1.4" fill="#111" />
              <text
                x={scene.leftColumn.x + scene.leftColumn.width - 5}
                y={row.y + 2}
                textAnchor="end"
                className="svg-pin"
              >
                {row.pin}
              </text>
              <text x={scene.rightColumn.x + 5} y={row.y + 2} textAnchor="start" className="svg-pin">
                {row.pin}
              </text>
            </g>
          ))}

          {scene.wires.map((wire) => {
            return (
              <g key={wire.id}>
                <line x1={wire.start.x} y1={wire.start.y} x2={wire.end.x} y2={wire.end.y} className="svg-wire" />
                <text x={wire.leftLabelPos.x} y={wire.leftLabelPos.y} className="svg-label-left">
                  {wire.leftLabel}
                </text>
                <text x={wire.rightLabelPos.x} y={wire.rightLabelPos.y} textAnchor="end" className="svg-label-right">
                  {wire.rightLabel}
                </text>
                {wire.twistedPair && wire.leftTpMarkerCenter && wire.rightTpMarkerCenter ? (
                  <>
                    <circle
                      cx={wire.leftTpMarkerCenter.x}
                      cy={wire.leftTpMarkerCenter.y - 2}
                      r="1.5"
                      fill="none"
                      stroke="#111"
                      strokeWidth="0.7"
                    />
                    <circle
                      cx={wire.leftTpMarkerCenter.x}
                      cy={wire.leftTpMarkerCenter.y + 2}
                      r="1.5"
                      fill="none"
                      stroke="#111"
                      strokeWidth="0.7"
                    />
                    <circle
                      cx={wire.rightTpMarkerCenter.x}
                      cy={wire.rightTpMarkerCenter.y - 2}
                      r="1.5"
                      fill="none"
                      stroke="#111"
                      strokeWidth="0.7"
                    />
                    <circle
                      cx={wire.rightTpMarkerCenter.x}
                      cy={wire.rightTpMarkerCenter.y + 2}
                      r="1.5"
                      fill="none"
                      stroke="#111"
                      strokeWidth="0.7"
                    />
                  </>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
