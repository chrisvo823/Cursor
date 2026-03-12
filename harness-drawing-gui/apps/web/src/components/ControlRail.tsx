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
  onProjectUpload: (file: File | null) => Promise<void>;
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
  onPage1OverallLengthValueChange: (value: number) => void;
  onPage1OverallLengthUnitChange: (value: string) => void;
  onPage1OverallLengthToleranceChange: (value: number) => void;
  onPage1LabelAChange: (value: string) => void;
  onPage1LabelBChange: (value: string) => void;
  onPage1LabelTableAChange: (value: string) => void;
  onPage1LabelTableBChange: (value: string) => void;
  onPage1NotesChange: (value: string) => void;
  onPage1NoteOverrideChange: (key: keyof Page1OverlayFields["notesOverrides"], value: string) => void;
  onPage1RevisionFieldChange: (key: keyof Page1OverlayFields["revision"], value: string) => void;
  onPage1TitleFieldChange: (key: keyof Page1OverlayFields["titleBlock"], value: string) => void;
  onPage1ApprovalFieldChange: (key: keyof Page1OverlayFields["approvals"], value: string) => void;
  onPage1ReferenceDocumentsChange: (value: string) => void;
  onLoadExampleDefaults: () => void;
  onPage1CalloutChange: (id: string, value: string) => void;
  onSaveProjectClick: () => void;
  canSaveProject: boolean;
  onExportPdfClick: () => void;
  onExportSvgClick: () => void;
  onExportDxfClick: () => void;
  canExport: boolean;
  actionMessage: { tone: "ok" | "warn"; text: string } | null;
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
  onProjectUpload,
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
  onPage1OverallLengthValueChange,
  onPage1OverallLengthUnitChange,
  onPage1OverallLengthToleranceChange,
  onPage1LabelAChange,
  onPage1LabelBChange,
  onPage1LabelTableAChange,
  onPage1LabelTableBChange,
  onPage1NotesChange,
  onPage1NoteOverrideChange,
  onPage1RevisionFieldChange,
  onPage1TitleFieldChange,
  onPage1ApprovalFieldChange,
  onPage1ReferenceDocumentsChange,
  onLoadExampleDefaults,
  onPage1CalloutChange,
  onSaveProjectClick,
  canSaveProject,
  onExportPdfClick,
  onExportSvgClick,
  onExportDxfClick,
  canExport,
  actionMessage,
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
              <button
                className={activePage === "split" ? "chip chip-active" : "chip"}
                onClick={() => onActivePageChange("split")}
              >
                Split View
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
        <div className="button-row">
          <button className="primary" onClick={onLoadExampleDefaults} title="Loads the Example.pdf metadata defaults">
            Load Example.pdf Defaults
          </button>
        </div>
        <div className="field">
          <label>Overall length</label>
          <div className="grid-two">
            <input
              type="number"
              value={page1Fields.overallLengthValue}
              onChange={(event) => onPage1OverallLengthValueChange(Number(event.currentTarget.value))}
              title="Example.pdf dimension value"
            />
            <input
              type="text"
              value={page1Fields.overallLengthUnit}
              onChange={(event) => onPage1OverallLengthUnitChange(event.currentTarget.value)}
              title="Example.pdf dimension unit"
            />
          </div>
          <input
            type="number"
            value={page1Fields.overallLengthTolerance}
            onChange={(event) => onPage1OverallLengthToleranceChange(Number(event.currentTarget.value))}
            title="Example.pdf +/- tolerance"
          />
          <p>{page1Fields.overallLength}</p>
        </div>
        <div className="grid-two">
          <div className="field">
            <label>White-box Label A</label>
            <input
              type="text"
              value={page1Fields.labelA}
              onChange={(event) => onPage1LabelAChange(event.currentTarget.value)}
              title="Example.pdf white-box label A"
            />
          </div>
          <div className="field">
            <label>White-box Label B</label>
            <input
              type="text"
              value={page1Fields.labelB}
              onChange={(event) => onPage1LabelBChange(event.currentTarget.value)}
              title="Example.pdf white-box label B"
            />
          </div>
        </div>
        <div className="grid-two">
          <div className="field">
            <label>Label Table A</label>
            <textarea
              className="textarea-field"
              value={page1Fields.labelTableA}
              onChange={(event) => onPage1LabelTableAChange(event.currentTarget.value)}
              title="Example.pdf label table A payload"
            />
          </div>
          <div className="field">
            <label>Label Table B</label>
            <textarea
              className="textarea-field"
              value={page1Fields.labelTableB}
              onChange={(event) => onPage1LabelTableBChange(event.currentTarget.value)}
              title="Example.pdf label table B payload"
            />
          </div>
        </div>
        <div className="field">
          <label>Fixed Notes (IPC/MSCP012)</label>
          <textarea
            className="textarea-field"
            value={[
              "01 ASSEMBLE HARNESS PER IPC/WHMA-A-620 CLASS 3 REQUIREMENTS.",
              "02 VERIFY CONTINUITY AND INSULATION PER MSCP012 BEFORE RELEASE.",
              "03 APPLY IDENTIFICATION SLEEVES PER MSCP012 LABELING TABLE.",
              "06 ROUTE BUNDLE TO MAINTAIN MINIMUM BEND RADIUS PER MSCP012.",
              "08 TORQUE FASTENERS PER MSCP012 AND APPLY WITNESS MARK.",
              "09 FINAL INSPECTION SHALL COMPLY WITH IPC AND MSCP012 QUALITY PLAN.",
            ].join("\n")}
            readOnly
            title="Fixed notes copied from Example.pdf requirements"
          />
        </div>
        <div className="grid-two">
          <div className="field">
            <label>Editable Note 04</label>
            <input
              type="text"
              value={page1Fields.notesOverrides.note04}
              onChange={(event) => onPage1NoteOverrideChange("note04", event.currentTarget.value)}
              title="Example.pdf note 04"
            />
          </div>
          <div className="field">
            <label>Editable Note 05</label>
            <input
              type="text"
              value={page1Fields.notesOverrides.note05}
              onChange={(event) => onPage1NoteOverrideChange("note05", event.currentTarget.value)}
              title="Example.pdf note 05"
            />
          </div>
        </div>
        <div className="field">
          <label>Editable Note 07</label>
          <input
            type="text"
            value={page1Fields.notesOverrides.note07}
            onChange={(event) => onPage1NoteOverrideChange("note07", event.currentTarget.value)}
            title="Example.pdf note 07"
          />
        </div>
        <div className="field">
          <label>Rendered Notes Block</label>
          <textarea
            className="textarea-field"
            value={page1Fields.notesText}
            onChange={(event) => onPage1NotesChange(event.currentTarget.value)}
            title="Composed notes text rendered on Page 1"
          />
        </div>
        <div className="grid-two">
          <div className="field">
            <label>Revision</label>
            <input
              type="text"
              value={page1Fields.revision.rev}
              onChange={(event) => onPage1RevisionFieldChange("rev", event.currentTarget.value)}
              title="Example.pdf revision field"
            />
          </div>
          <div className="field">
            <label>Revision by</label>
            <input
              type="text"
              value={page1Fields.revision.by}
              onChange={(event) => onPage1RevisionFieldChange("by", event.currentTarget.value)}
              title="Example.pdf revision by field"
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
              title="Example.pdf revision description"
            />
          </div>
          <div className="field">
            <label>Revision date</label>
            <input
              type="text"
              value={page1Fields.revision.date}
              onChange={(event) => onPage1RevisionFieldChange("date", event.currentTarget.value)}
              title="Example.pdf revision date"
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
              title="Example.pdf title block title"
            />
          </div>
          <div className="field">
            <label>Number</label>
            <input
              type="text"
              value={page1Fields.titleBlock.number}
              onChange={(event) => onPage1TitleFieldChange("number", event.currentTarget.value)}
              title="Example.pdf part number"
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
              title="Example.pdf sheet identifier"
            />
          </div>
          <div className="field">
            <label>Title revision</label>
            <input
              type="text"
              value={page1Fields.titleBlock.revision}
              onChange={(event) => onPage1TitleFieldChange("revision", event.currentTarget.value)}
              title="Example.pdf title-block revision"
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
              title="Example.pdf date field"
            />
          </div>
          <div className="field">
            <label>File</label>
            <input
              type="text"
              value={page1Fields.titleBlock.file}
              onChange={(event) => onPage1TitleFieldChange("file", event.currentTarget.value)}
              title="Example.pdf file path field"
            />
          </div>
        </div>
        <div className="grid-two">
          <div className="field">
            <label>EE approval</label>
            <input
              type="text"
              value={page1Fields.approvals.eeName}
              onChange={(event) => onPage1ApprovalFieldChange("eeName", event.currentTarget.value)}
              title="Example.pdf EE approval name"
            />
            <input
              type="text"
              value={page1Fields.approvals.eeDate}
              onChange={(event) => onPage1ApprovalFieldChange("eeDate", event.currentTarget.value)}
              title="Example.pdf EE approval date"
            />
          </div>
          <div className="field">
            <label>ME approval</label>
            <input
              type="text"
              value={page1Fields.approvals.meName}
              onChange={(event) => onPage1ApprovalFieldChange("meName", event.currentTarget.value)}
              title="Example.pdf ME approval name"
            />
            <input
              type="text"
              value={page1Fields.approvals.meDate}
              onChange={(event) => onPage1ApprovalFieldChange("meDate", event.currentTarget.value)}
              title="Example.pdf ME approval date"
            />
          </div>
        </div>
        <div className="grid-two">
          <div className="field">
            <label>TECH approval</label>
            <input
              type="text"
              value={page1Fields.approvals.techName}
              onChange={(event) => onPage1ApprovalFieldChange("techName", event.currentTarget.value)}
              title="Example.pdf TECH approval name"
            />
            <input
              type="text"
              value={page1Fields.approvals.techDate}
              onChange={(event) => onPage1ApprovalFieldChange("techDate", event.currentTarget.value)}
              title="Example.pdf TECH approval date"
            />
          </div>
          <div className="field">
            <label>Reference documents</label>
            <input
              type="text"
              value={page1Fields.referenceDocuments}
              onChange={(event) => onPage1ReferenceDocumentsChange(event.currentTarget.value)}
              title="Example.pdf reference documents"
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
                title={`Example.pdf callout value ${callout.id}`}
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
        <h2>5) Project save/load</h2>
        <div className="button-row">
          <button onClick={onSaveProjectClick} disabled={!canSaveProject}>Save Project JSON</button>
        </div>
        {!canSaveProject ? <p>Load template + pinout before saving project state.</p> : null}
        <div className="field">
          <label>Load project JSON</label>
          <input
            type="file"
            accept=".json,application/json"
            onChange={(event) => void onProjectUpload(event.currentTarget.files?.[0] ?? null)}
          />
        </div>
        {actionMessage ? (
          <p className={actionMessage.tone === "ok" ? "status-text status-ok" : "status-text status-warn"}>
            {actionMessage.text}
          </p>
        ) : null}
      </section>

      <section className="panel-section">
        <h2>6) Export</h2>
        <div className="button-row">
          <button className="primary" onClick={onExportPdfClick} disabled={!canExport}>Export PDF</button>
          <button onClick={onExportSvgClick} disabled={templateStatus !== "loaded"}>Export SVG</button>
          <button onClick={onExportDxfClick} disabled={!canExport}>Export DXF</button>
        </div>
        {!canExport ? <p>PDF/DXF require both template and pinout to be loaded.</p> : null}
      </section>
    </aside>
  );
}
