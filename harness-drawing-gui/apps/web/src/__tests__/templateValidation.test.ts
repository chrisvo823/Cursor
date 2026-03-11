import { describe, expect, it } from "vitest";
import {
  TemplateValidationError,
  isPdfFileName,
  validateTemplateFile,
  validateTemplatePageCount,
} from "../lib/template/templateValidation";

describe("templateValidation", () => {
  it("accepts PDF file by extension and MIME", () => {
    const file = new File(["content"], "Template.pdf", { type: "application/pdf" });
    expect(() => validateTemplateFile(file)).not.toThrow();
    expect(isPdfFileName(file.name)).toBe(true);
  });

  it("rejects non-PDF template file", () => {
    const file = new File(["content"], "Template.png", { type: "image/png" });
    expect(() => validateTemplateFile(file)).toThrow(TemplateValidationError);
  });

  it("rejects template with fewer than two pages", () => {
    expect(() => validateTemplatePageCount(1)).toThrow(TemplateValidationError);
    expect(() => validateTemplatePageCount(2)).not.toThrow();
  });
});
