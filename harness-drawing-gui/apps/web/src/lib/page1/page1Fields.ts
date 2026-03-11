import type { Page1CalloutField, Page1OverlayFields, Page1RevisionFields, Page1TitleBlockFields } from "@harness/render";

export function createDefaultPage1Fields(): Page1OverlayFields {
  return {
    overallLength: "130 MM",
    labelA: "A",
    labelB: "B",
    notesText: [
      "01 FASTEN HARNESS TO BRACKET USING TIES AS SHOWN.",
      "02 VERIFY ALL TERMINATIONS ARE FULLY SEATED.",
      "03 ROUTE HARNESS TO MAINTAIN MINIMUM BEND RADIUS.",
      "04 INSPECT FOR INSULATION DAMAGE PRIOR TO SHIPMENT.",
      "05 APPLY BLUE TRIANGLE IDENTIFIER AT SHOWN LOCATION.",
      "06 CONFIRM LABEL ORIENTATION MATCHES TABLE.",
      "07 APPLY BLUE SQUARE HIGHLIGHT TO CRITICAL NOTE.",
    ].join("\n"),
    revision: {
      rev: "A01",
      desc: "INITIAL RELEASE",
      date: "16-FEB-26",
      by: "KATIE C.",
    },
    titleBlock: {
      title: "HARNESS",
      number: "",
      revision: "A",
      sheet: "Sheet 1 of 2",
      date: "",
      file: "",
    },
    callouts: [
      { id: "callout_1", value: "01" },
      { id: "callout_2", value: "02" },
      { id: "callout_3", value: "03" },
      { id: "callout_4", value: "04" },
      { id: "callout_5", value: "05" },
    ],
  };
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
