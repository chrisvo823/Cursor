import { ControlRail } from "./components/ControlRail";
import { PreviewCanvas } from "./components/PreviewCanvas";
import { StatusPill } from "./components/StatusPill";
import { samplePinout } from "./lib/sampleProject";

export default function App() {
  return (
    <div className="shell">
      <header className="topbar">
        <div>
          <h1>Harness Drawing GUI</h1>
          <p>Electrical harness drawing generator scaffold for Cursor</p>
        </div>
        <div className="pill-row">
          <StatusPill label="Pinout" value={`${samplePinout.rows.length} rows`} tone="ok" />
          <StatusPill label="Template" value="2-page PDF" tone="ok" />
          <StatusPill label="Mode" value="scaffold" />
        </div>
      </header>

      <main className="workspace">
        <ControlRail pinout={samplePinout} />
        <PreviewCanvas pinout={samplePinout} />
      </main>
    </div>
  );
}
