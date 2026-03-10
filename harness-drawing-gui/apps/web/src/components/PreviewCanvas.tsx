import { buildPage2Geometry } from "@harness/core";
import type { NormalizedPinout } from "@harness/core";

type PreviewCanvasProps = {
  pinout: NormalizedPinout;
};

export function PreviewCanvas({ pinout }: PreviewCanvasProps) {
  const geometry = buildPage2Geometry({
    pinCount: pinout.pinCount,
    linePitchMm: 9.5,
    autoExpandConnectorColumns: true,
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
        <svg viewBox="0 0 720 405" className="paper-svg" aria-label="Harness page 2 concept preview">
          <rect x="0" y="0" width="720" height="405" fill="#e9f0ff" />

          <rect
            x={geometry.leftColumnX}
            y={geometry.columnY}
            width={geometry.columnWidth}
            height={geometry.columnHeight}
            fill="rgba(255,247,168,0.92)"
            stroke="#111"
            strokeWidth="0.8"
          />
          <rect
            x={geometry.rightColumnX}
            y={geometry.columnY}
            width={geometry.columnWidth}
            height={geometry.columnHeight}
            fill="rgba(255,247,168,0.92)"
            stroke="#111"
            strokeWidth="0.8"
          />

          <text x={geometry.leftColumnX + geometry.columnWidth / 2} y={70} textAnchor="middle" className="svg-heading">P2</text>
          <text x={geometry.rightColumnX + geometry.columnWidth / 2} y={70} textAnchor="middle" className="svg-heading">P4</text>

          <line x1={geometry.leftRailX} y1={geometry.columnY + 8} x2={geometry.leftRailX} y2={geometry.columnY + geometry.columnHeight - 8} className="svg-rail" />
          <line x1={geometry.rightRailX} y1={geometry.columnY + 8} x2={geometry.rightRailX} y2={geometry.columnY + geometry.columnHeight - 8} className="svg-rail" />

          {geometry.pinYs.map((y, index) => (
            <g key={index}>
              <circle cx={geometry.leftRailX} cy={y} r="1.4" fill="#111" />
              <circle cx={geometry.rightRailX} cy={y} r="1.4" fill="#111" />
              <text x={geometry.leftColumnX + geometry.columnWidth - 5} y={y + 2} textAnchor="end" className="svg-pin">{index + 1}</text>
              <text x={geometry.rightColumnX + 5} y={y + 2} textAnchor="start" className="svg-pin">{index + 1}</text>
            </g>
          ))}

          {pinout.rows.filter((row) => row.used).map((row, index) => {
            const y1 = geometry.pinYs[row.fromPin - 1];
            const y2 = geometry.pinYs[row.toPin - 1];
            const isTp = row.type === "TP" || row.pair.length > 0;
            return (
              <g key={`${row.fromPin}-${row.toPin}-${index}`}>
                <line x1={geometry.leftRailX} y1={y1} x2={geometry.rightRailX} y2={y2} className="svg-wire" />
                <text x={geometry.leftColumnX + 4} y={y1 + 2} className="svg-label-left">{row.leftLabel}</text>
                <text x={geometry.rightColumnX + geometry.columnWidth - 4} y={y2 + 2} textAnchor="end" className="svg-label-right">{row.rightLabel}</text>
                {isTp ? (
                  <>
                    <circle cx={geometry.leftRailX + 8} cy={y1 - 2} r="1.5" fill="none" stroke="#111" strokeWidth="0.7" />
                    <circle cx={geometry.leftRailX + 8} cy={y1 + 2} r="1.5" fill="none" stroke="#111" strokeWidth="0.7" />
                    <circle cx={geometry.rightRailX - 8} cy={y2 - 2} r="1.5" fill="none" stroke="#111" strokeWidth="0.7" />
                    <circle cx={geometry.rightRailX - 8} cy={y2 + 2} r="1.5" fill="none" stroke="#111" strokeWidth="0.7" />
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
