import { ControlRail } from "./components/ControlRail";
import { PreviewCanvas } from "./components/PreviewCanvas";
import { StatusPill } from "./components/StatusPill";
import { usePreviewState } from "./lib/preview/usePreviewState";

export default function App() {
  const preview = usePreviewState();
  const pinCount = preview.pinout.data?.pinCount ?? 0;

  return (
    <div className="shell">
      <header className="topbar">
        <div>
          <h1>Harness Drawing GUI</h1>
          <p>Template-backed harness drawing generator</p>
        </div>
        <div className="pill-row">
          <StatusPill
            label="Pinout"
            value={preview.pinout.status === "loaded" ? `${preview.parsedConnectionCount} connections` : "not loaded"}
            tone={preview.pinout.status === "loaded" ? "ok" : preview.pinout.status === "error" ? "warn" : "neutral"}
          />
          <StatusPill
            label="Template"
            value={preview.template.status === "loaded" ? "loaded" : "not loaded"}
            tone={preview.template.status === "loaded" ? "ok" : preview.template.status === "error" ? "warn" : "neutral"}
          />
          <StatusPill label="Active page" value={`Page ${preview.activePage}`} />
        </div>
      </header>

      <main className="workspace">
        <ControlRail
          activePage={preview.activePage}
          onActivePageChange={preview.setActivePage}
          linePitchMm={preview.linePitchMm}
          onLinePitchChange={preview.setLinePitchMm}
          autoExpandConnectorColumns={preview.autoExpandConnectorColumns}
          onAutoExpandChange={preview.setAutoExpandConnectorColumns}
          onPinoutUpload={preview.onPinoutUpload}
          onTemplateUpload={preview.onTemplateUpload}
          onProjectUpload={preview.onProjectUpload}
          pinoutStatus={preview.pinout.status}
          templateStatus={preview.template.status}
          pinoutError={preview.pinout.error}
          templateError={preview.template.error}
          parsedConnectionCount={preview.parsedConnectionCount}
          pinCount={pinCount}
          twistedPairCount={preview.twistedPairCount}
          activeSheetName={preview.activeSheetName}
          page1Fields={preview.page1Fields}
          onPage1OverallLengthChange={preview.setPage1OverallLength}
          onPage1LabelAChange={preview.setPage1LabelA}
          onPage1LabelBChange={preview.setPage1LabelB}
          onPage1NotesChange={preview.setPage1NotesText}
          onPage1RevisionFieldChange={preview.setPage1RevisionField}
          onPage1TitleFieldChange={preview.setPage1TitleBlockField}
          onPage1CalloutChange={preview.setPage1CalloutValue}
          onSaveProjectClick={() => void preview.saveProjectJson()}
          onExportPdfClick={() => void preview.exportPdf()}
          onExportSvgClick={() => void preview.exportSvg()}
          onExportDxfClick={() => void preview.exportDxf()}
          canExport={preview.canExport}
          actionMessage={preview.actionMessage}
        />
        <PreviewCanvas
          activePage={preview.activePage}
          template={preview.template}
          page1OverlayModel={preview.page1OverlayModel}
          page2Scene={preview.page2Scene}
        />
      </main>
    </div>
  );
}
