import { describe, expect, it } from "vitest";
import type { NormalizedPinout } from "@harness/shared";
import { buildPage2Scene, buildPage2OverlayModel, computeOverlayTransform } from "../index";

const samplePinout: NormalizedPinout = {
  rows: [
    {
      fromPin: 1,
      toPin: 2,
      leftLabel: "CAN_TX",
      rightLabel: "CAN_TX",
      awg: "22",
      color: "WHT",
      wireNumber: "W101",
      pair: "TP1",
      type: "TP",
      used: true,
      sourceRow: 2,
    },
    {
      fromPin: 2,
      toPin: 3,
      leftLabel: "CAN_RX",
      rightLabel: "CAN_RX",
      awg: "22",
      color: "BLK",
      wireNumber: "W102",
      pair: "",
      type: "AWG",
      used: true,
      sourceRow: 3,
    },
  ],
  pinCount: 26,
  diagnostics: {
    selectedSheet: "Ladder_26pin",
    ignoredRows: 0,
    warnings: [],
  },
};

describe("buildPage2OverlayModel", () => {
  it("emits deterministic vector model with TP markers and metadata text", () => {
    const scene = buildPage2Scene(samplePinout, {
      leftConnectorName: "P2",
      rightConnectorName: "P4",
      leftConnectorSubtitle: "LEFT",
      rightConnectorSubtitle: "RIGHT",
      linePitchMm: 9.5,
      autoExpandConnectorColumns: true,
    });

    const model = buildPage2OverlayModel(scene);
    expect(model.wires).toHaveLength(2);
    expect(model.pinDots.length).toBe(scene.pinRows.length * 2);
    expect(model.figure8Markers.length).toBe(4);
    expect(model.texts.some((text) => text.tone === "meta" && text.value.includes("W101"))).toBe(true);
    expect(model.texts.some((text) => text.tone === "heading" && text.value === "P2")).toBe(true);
  });
});

describe("computeOverlayTransform", () => {
  it("centers scene deterministically into target bounds", () => {
    const transform = computeOverlayTransform({
      sceneWidth: 720,
      sceneHeight: 405,
      targetWidth: 1000,
      targetHeight: 900,
    });
    expect(transform.scale).toBeCloseTo(1.388888, 5);
    expect(transform.offsetX).toBeCloseTo(0, 5);
    expect(transform.offsetY).toBeCloseTo(168.75, 5);
  });
});
