import type { ActivePreviewPage } from "../lib/preview/usePreviewState";
import type { ResourceStatus } from "../lib/preview/previewStateModel";
import type { Page1OverlayFields } from "@harness/render";

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
  page1Fields: Page1OverlayFields;
  onPage1OverallLengthChange: (value: string) => void;
  onPage1LabelAChange: (value: string) => void;
  onPage1LabelBChange: (value: string) => void;
  onPage1NotesChange: (value: string) => void;
  onPage1RevisionFieldChange: (key: keyof Page1OverlayFields["revision"], value: string) => void;
  onPage1TitleFieldChange: (key: keyof Page1OverlayFields["titleBlock"], value: string) => void;
  onPage1CalloutChange: (id: string, value: string) => void;
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
  page1Fields,
  onPage1OverallLengthChange,
  onPage1LabelAChange,
  onPage1LabelBChange,
  onPage1NotesChange,
  onPage1RevisionFieldChange,
  onPage1TitleFieldChange,
  onPage1CalloutChange,
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
        <h2>3) Page 1 fields</h2>
        <div className="field">
          <label>Overall length</label>
          <input
            type="text"
            value={page1Fields.overallLength}
            onChange={(event) => onPage1OverallLengthChange(event.currentTarget.value)}
          />
        </div>
        <div className="grid-two">
          <div className="field">
            <label>Label A</label>
            <input
              type="text"
              value={page1Fields.labelA}
              onChange={(event) => onPage1LabelAChange(event.currentTarget.value)}
            />
          </div>
          <div className="field">
            <label>Label B</label>
            <input
              type="text"
              value={page1Fields.labelB}
              onChange={(event) => onPage1LabelBChange(event.currentTarget.value)}
            />
          </div>
        </div>
        <div className="field">
          <label>Notes block</label>
          <textarea
            className="textarea-field"
            value={page1Fields.notesText}
            onChange={(event) => onPage1NotesChange(event.currentTarget.value)}
          />
        </div>
        <div className="grid-two">
          <div className="field">
            <label>Revision</label>
            <input
              type="text"
              value={page1Fields.revision.rev}
              onChange={(event) => onPage1RevisionFieldChange("rev", event.currentTarget.value)}
            />
          </div>
          <div className="field">
            <label>Revision by</label>
            <input
              type="text"
              value={page1Fields.revision.by}
              onChange={(event) => onPage1RevisionFieldChange("by", event.currentTarget.value)}
            />
          </div>
        </div>
        <div className="grid-two">
          <div className="field">
            <label>Revision desc</label>
            <input
              type="text"
              value={page1Fields.revision.desc}
              onChange={(event) => onPage1RevisionFieldChange("desc", event.currentTarget.value)}
            />
          </div>
          <div className="field">
            <label>Revision date</label>
            <input
              type="text"
              value={page1Fields.revision.date}
              onChange={(event) => onPage1RevisionFieldChange("date", event.currentTarget.value)}
            />
          </div>
        </div>
        <div className="grid-two">
          <div className="field">
            <label>Title</label>
            <input
              type="text"
              value={page1Fields.titleBlock.title}
              onChange={(event) => onPage1TitleFieldChange("title", event.currentTarget.value)}
            />
          </div>
          <div className="field">
            <label>Number</label>
            <input
              type="text"
              value={page1Fields.titleBlock.number}
              onChange={(event) => onPage1TitleFieldChange("number", event.currentTarget.value)}
            />
          </div>
        </div>
        <div className="grid-two">
          <div className="field">
            <label>Sheet</label>
            <input
              type="text"
              value={page1Fields.titleBlock.sheet}
              onChange={(event) => onPage1TitleFieldChange("sheet", event.currentTarget.value)}
            />
          </div>
          <div className="field">
            <label>Title revision</label>
            <input
              type="text"
              value={page1Fields.titleBlock.revision}
              onChange={(event) => onPage1TitleFieldChange("revision", event.currentTarget.value)}
            />
          </div>
        </div>
        <div className="grid-two">
          <div className="field">
            <label>Title date</label>
            <input
              type="text"
              value={page1Fields.titleBlock.date}
              onChange={(event) => onPage1TitleFieldChange("date", event.currentTarget.value)}
            />
          </div>
          <div className="field">
            <label>File</label>
            <input
              type="text"
              value={page1Fields.titleBlock.file}
              onChange={(event) => onPage1TitleFieldChange("file", event.currentTarget.value)}
            />
          </div>
        </div>
        <div className="field">
          <label>Callouts</label>
          <div className="grid-two">
            {page1Fields.callouts.map((callout) => (
              <input
                key={callout.id}
                type="text"
                value={callout.value}
                onChange={(event) => onPage1CalloutChange(callout.id, event.currentTarget.value)}
                aria-label={`Callout ${callout.id}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="panel-section">
        <h2>4) Data summary</h2>
        <p>{parsedConnectionCount} parsed connections · {pinCount} pins</p>
        <p>TP rows: {twistedPairCount}</p>
        <p>Sheet: {activeSheetName ?? "—"}</p>
      </section>

      <section className="panel-section">
        <h2>5) Export</h2>
        <div className="button-row">
          <button className="primary" disabled>Export PDF</button>
          <button disabled>Export SVG</button>
          <button disabled>Export DXF</button>
        </div>
      </section>
    </aside>
  );
}
