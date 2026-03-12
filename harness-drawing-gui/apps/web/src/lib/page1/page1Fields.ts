import type { Page1CalloutField, Page1OverlayFields, Page1RevisionFields, Page1TitleBlockFields } from "@harness/render";

const FIXED_NOTES = {
  note01: "01 ASSEMBLE HARNESS PER IPC/WHMA-A-620 CLASS 3 REQUIREMENTS.",
  note02: "02 VERIFY CONTINUITY AND INSULATION PER MSCP012 BEFORE RELEASE.",
  note03: "03 APPLY IDENTIFICATION SLEEVES PER MSCP012 LABELING TABLE.",
  note06: "06 ROUTE BUNDLE TO MAINTAIN MINIMUM BEND RADIUS PER MSCP012.",
  note08: "08 TORQUE FASTENERS PER MSCP012 AND APPLY WITNESS MARK.",
  note09: "09 FINAL INSPECTION SHALL COMPLY WITH IPC AND MSCP012 QUALITY PLAN.",
} as const;

function buildDefaultNotesText(overrides: Page1OverlayFields["notesOverrides"]): string {
  return [
    FIXED_NOTES.note01,
    FIXED_NOTES.note02,
    FIXED_NOTES.note03,
    `04 ${overrides.note04}`,
    `05 ${overrides.note05}`,
    FIXED_NOTES.note06,
    `07 ${overrides.note07}`,
    FIXED_NOTES.note08,
    FIXED_NOTES.note09,
  ].join("\n");
}

export function composeOverallLengthString(fields: Pick<Page1OverlayFields, "overallLengthValue" | "overallLengthUnit" | "overallLengthTolerance">): string {
  return `${fields.overallLengthValue} ${fields.overallLengthUnit} +/-${fields.overallLengthTolerance} ${fields.overallLengthUnit}`;
}

export function createDefaultPage1Fields(): Page1OverlayFields {
  const notesOverrides: Page1OverlayFields["notesOverrides"] = {
    note04: "INSPECT FOR INSULATION DAMAGE PRIOR TO SHIPMENT.",
    note05: "APPLY BLUE TRIANGLE IDENTIFIER AT SHOWN LOCATION.",
    note07: "APPLY BLUE SQUARE HIGHLIGHT TO CRITICAL NOTE.",
  };
  const overallLengthValue = 500;
  const overallLengthUnit = "MM";
  const overallLengthTolerance = 10;

  return {
    overallLength: composeOverallLengthString({ overallLengthValue, overallLengthUnit, overallLengthTolerance }),
    overallLengthValue,
    overallLengthUnit,
    overallLengthTolerance,
    labelA: "A",
    labelB: "B",
    labelTableA: "P2 (TO TAIL J2)\nGLI-B4-A01\n10000440-501",
    labelTableB: "P4 (TO I/O J4)\nGLI-B4-A01\n10000440-501",
    notesText: buildDefaultNotesText(notesOverrides),
    notesOverrides,
    revision: {
      rev: "A",
      desc: "INITIAL RELEASE",
      date: "2026-03-12",
      by: "EE TEAM",
    },
    titleBlock: {
      title: "HARNESS, GLIDE B4, TAIL TO I/O CARRIER",
      number: "10000440-501",
      revision: "A",
      sheet: "Sheet 1 of 2",
      date: new Date().toISOString().slice(0, 10),
      file: "G:\\Shared drives\\Harness\\GLI-B4\\10000440-501",
    },
    approvals: {
      eeName: "E. ENGINEER",
      eeDate: "2026-03-12",
      meName: "M. ENGINEER",
      meDate: "2026-03-12",
      techName: "T. TECH",
      techDate: "2026-03-12",
    },
    referenceDocuments: "IPC/WHMA-A-620, MSCP012",
    todayDate: new Date().toISOString().slice(0, 10),
    callouts: [
      { id: "callout_1", value: "01" },
      { id: "callout_2", value: "02" },
      { id: "callout_3", value: "03" },
      { id: "callout_4", value: "04" },
      { id: "callout_5", value: "05" },
    ],
  };
}

export function createExamplePage1Fields(): Page1OverlayFields {
  return createDefaultPage1Fields();
}

export function updateRevisionField(
  revision: Page1RevisionFields,
  key: keyof Page1RevisionFields,
  value: string,
): Page1RevisionFields {
  return {
    ...revision,
    [key]: value,
  };
}

export function updateTitleBlockField(
  titleBlock: Page1TitleBlockFields,
  key: keyof Page1TitleBlockFields,
  value: string,
): Page1TitleBlockFields {
  return {
    ...titleBlock,
    [key]: value,
  };
}

export function updateCalloutField(callouts: Page1CalloutField[], id: string, value: string): Page1CalloutField[] {
  return callouts.map((callout) => (callout.id === id ? { ...callout, value } : callout));
}

export function mergeNotesTextWithOverrides(current: Page1OverlayFields): string {
  return buildDefaultNotesText(current.notesOverrides);
}
