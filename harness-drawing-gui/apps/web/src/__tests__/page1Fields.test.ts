import { describe, expect, it } from "vitest";
import {
  createDefaultPage1Fields,
  updateCalloutField,
  updateRevisionField,
  updateTitleBlockField,
} from "../lib/page1/page1Fields";

describe("page1Fields model", () => {
  it("creates deterministic default Page 1 editable state", () => {
    const defaults = createDefaultPage1Fields();
    expect(defaults.overallLength).toContain("500 MM");
    expect(defaults.overallLengthTolerance).toBe(10);
    expect(defaults.labelA).toBe("A");
    expect(defaults.labelB).toBe("B");
    expect(defaults.labelTableA).toContain("P2");
    expect(defaults.labelTableB).toContain("P4");
    expect(defaults.callouts).toHaveLength(5);
    expect(defaults.notesText).toContain("05");
    expect(defaults.notesText).toContain("07");
  });

  it("updates revision/title/callout values immutably", () => {
    const defaults = createDefaultPage1Fields();
    const revision = updateRevisionField(defaults.revision, "rev", "B02");
    const titleBlock = updateTitleBlockField(defaults.titleBlock, "title", "HARNESS REV B");
    const callouts = updateCalloutField(defaults.callouts, "callout_3", "77");

    expect(defaults.revision.rev).toBe("A");
    expect(revision.rev).toBe("B02");
    expect(defaults.titleBlock.title).toContain("GLIDE B4");
    expect(titleBlock.title).toBe("HARNESS REV B");
    expect(defaults.callouts.find((callout) => callout.id === "callout_3")?.value).toBe("03");
    expect(callouts.find((callout) => callout.id === "callout_3")?.value).toBe("77");
  });
});
