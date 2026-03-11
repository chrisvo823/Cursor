import { describe, expect, it } from "vitest";
import { resolveTemplateCalibrationProfile } from "../lib/template/calibrationProfile";

describe("resolveTemplateCalibrationProfile", () => {
  it("uses sample profile for known sample template names", () => {
    const profile = resolveTemplateCalibrationProfile("Example_Ladder_26Pin_Template.pdf");
    expect(profile.id).toBe("sample_ladder_26pin");
  });

  it("uses default profile for unknown template names", () => {
    const profile = resolveTemplateCalibrationProfile("CustomerHarnessV3.pdf");
    expect(profile.id).toBe("default");
  });
});
