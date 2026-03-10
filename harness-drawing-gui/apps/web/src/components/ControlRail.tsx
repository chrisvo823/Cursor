import type { NormalizedPinout } from "@harness/core";

type ControlRailProps = {
  pinout: NormalizedPinout;
};

export function ControlRail({ pinout }: ControlRailProps) {
  return (
    <aside className="control-rail">
      <section className="panel-section">
        <h2>1) Upload inputs</h2>
        <div className="field">
          <label>Harness pinout</label>
          <input type="file" disabled />
          <p>Accept XLSX, XLS, or CSV. Raw sheet preview stays hidden.</p>
        </div>
        <div className="field">
          <label>Drawing template</label>
          <input type="file" disabled />
          <p>Exactly one 2-page PDF. Used for preview and final output background.</p>
        </div>
      </section>

      <section className="panel-section">
        <h2>2) Preview controls</h2>
        <div className="grid-two">
          <div className="field">
            <label>Active page</label>
            <div className="chip-row">
              <button className="chip chip-active">Page 1</button>
              <button className="chip">Page 2</button>
            </div>
          </div>
          <div className="field">
            <label>Line spacing</label>
            <input type="range" min={6} max={14} value={9.5} readOnly />
          </div>
        </div>
      </section>

      <section className="panel-section">
        <h2>3) Data summary</h2>
        <p>{pinout.rows.length} normalized rows · {pinout.pinCount} pins</p>
        <p>TP rows: {pinout.rows.filter((row) => row.type === "TP").length}</p>
      </section>

      <section className="panel-section">
        <h2>4) Export</h2>
        <div className="button-row">
          <button className="primary">Export PDF</button>
          <button>Export SVG</button>
          <button>Export DXF</button>
        </div>
      </section>
    </aside>
  );
}
