import type { ActivePreviewPage } from "../lib/preview/usePreviewState";
import type { ResourceStatus } from "../lib/preview/previewStateModel";

type ControlRailProps = {
  activePage: ActivePreviewPage;
  onActivePageChange: (page: ActivePreviewPage) => void;
  linePitchMm: number;
  onLinePitchChange: (value: number) => void;
  autoExpandConnectorColumns: boolean;
  onAutoExpandChange: (value: boolean) => void;
  onPinoutUpload: (file: File | null) => Promise<void>;
  onTemplateUpload: (file: File | null) => Promise<void>;
  pinoutStatus: ResourceStatus;
  templateStatus: ResourceStatus;
  pinoutError: string | null;
  templateError: string | null;
  parsedConnectionCount: number;
  pinCount: number;
  twistedPairCount: number;
  activeSheetName: string | null;
};

export function ControlRail({
  activePage,
  onActivePageChange,
  linePitchMm,
  onLinePitchChange,
  autoExpandConnectorColumns,
  onAutoExpandChange,
  onPinoutUpload,
  onTemplateUpload,
  pinoutStatus,
  templateStatus,
  pinoutError,
  templateError,
  parsedConnectionCount,
  pinCount,
  twistedPairCount,
  activeSheetName,
}: ControlRailProps) {
  return (
    <aside className="control-rail">
      <section className="panel-section">
        <h2>1) Upload inputs</h2>
        <div className="field">
          <label>Harness pinout</label>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(event) => void onPinoutUpload(event.currentTarget.files?.[0] ?? null)}
          />
          <p>Accept XLSX, XLS, or CSV. Raw sheet preview stays hidden.</p>
          <p>Status: {pinoutStatus}</p>
          {pinoutError ? <p className="error-text">{pinoutError}</p> : null}
        </div>
        <div className="field">
          <label>Drawing template</label>
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={(event) => void onTemplateUpload(event.currentTarget.files?.[0] ?? null)}
          />
          <p>Exactly one 2-page PDF. Used for preview and final output background.</p>
          <p>Status: {templateStatus}</p>
          {templateError ? <p className="error-text">{templateError}</p> : null}
        </div>
      </section>

      <section className="panel-section">
        <h2>2) Preview controls</h2>
        <div className="grid-two">
          <div className="field">
            <label>Active page</label>
            <div className="chip-row">
              <button
                className={activePage === 1 ? "chip chip-active" : "chip"}
                onClick={() => onActivePageChange(1)}
              >
                Page 1
              </button>
              <button
                className={activePage === 2 ? "chip chip-active" : "chip"}
                onClick={() => onActivePageChange(2)}
              >
                Page 2
              </button>
            </div>
          </div>
          <div className="field">
            <label>Line spacing</label>
            <input
              type="range"
              min={6}
              max={14}
              step={0.1}
              value={linePitchMm}
              onChange={(event) => onLinePitchChange(Number(event.currentTarget.value))}
            />
            <p>{linePitchMm.toFixed(1)} mm</p>
          </div>
        </div>
        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={autoExpandConnectorColumns}
            onChange={(event) => onAutoExpandChange(event.currentTarget.checked)}
          />
          <span>Auto-expand connector columns</span>
        </label>
      </section>

      <section className="panel-section">
        <h2>3) Data summary</h2>
        <p>{parsedConnectionCount} parsed connections · {pinCount} pins</p>
        <p>TP rows: {twistedPairCount}</p>
        <p>Sheet: {activeSheetName ?? "—"}</p>
      </section>

      <section className="panel-section">
        <h2>4) Export</h2>
        <div className="button-row">
          <button className="primary" disabled>Export PDF</button>
          <button disabled>Export SVG</button>
          <button disabled>Export DXF</button>
        </div>
      </section>
    </aside>
  );
}
