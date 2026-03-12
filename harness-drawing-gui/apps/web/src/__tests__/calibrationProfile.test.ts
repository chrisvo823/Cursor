import { describe, expect, it } from "vitest";
import { resolveTemplateCalibrationProfile } from "../lib/template/calibrationProfile";

describe("resolveTemplateCalibrationProfile", () => {
  it("uses sample profile for known sample template names", () => {
    const profile = resolveTemplateCalibrationProfile({
      templateFileName: "Example_Ladder_26Pin_Template.pdf",
    });
    expect(profile.id).toBe("sample_ladder_26pin");
  });

  it("uses sample profile for harness-style filenames", () => {
    const profile = resolveTemplateCalibrationProfile({
      templateFileName: "HARNESS_10001060-501_01_A_GB4_GSE.pdf",
    });
    expect(profile.id).toBe("sample_ladder_26pin");
  });

  it("uses sample profile for matching 720x405 page sizes", () => {
    const profile = resolveTemplateCalibrationProfile({
      templateFileName: "Template.pdf",
      page1SizePt: { width: 720, height: 405 },
      page2SizePt: { width: 720, height: 405 },
    });
    expect(profile.id).toBe("sample_ladder_26pin");
  });

  it("uses default profile for unknown template names and page sizes", () => {
    const profile = resolveTemplateCalibrationProfile({
      templateFileName: "CustomerHarnessV3.pdf",
      page1SizePt: { width: 841.89, height: 595.28 },
      page2SizePt: { width: 841.89, height: 595.28 },
    });
    expect(profile.id).toBe("default");
  });
});
