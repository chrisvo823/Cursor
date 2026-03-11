export class TemplateValidationError extends Error {
  readonly code:
    | "NO_FILE"
    | "INVALID_FILE_TYPE"
    | "INVALID_EXTENSION"
    | "INSUFFICIENT_PAGES"
    | "PDF_LOAD_FAILED";

  constructor(
    code: "NO_FILE" | "INVALID_FILE_TYPE" | "INVALID_EXTENSION" | "INSUFFICIENT_PAGES" | "PDF_LOAD_FAILED",
    message: string,
  ) {
    super(message);
    this.code = code;
    this.name = "TemplateValidationError";
  }
}

export function isPdfFileName(name: string): boolean {
  return name.toLowerCase().endsWith(".pdf");
}

export function validateTemplateFile(file: File | null): void {
  if (!file) {
    throw new TemplateValidationError("NO_FILE", "A template PDF file is required.");
  }
  const hasPdfMime = file.type === "application/pdf";
  if (!hasPdfMime && !isPdfFileName(file.name)) {
    throw new TemplateValidationError("INVALID_FILE_TYPE", "Template file must be a PDF.");
  }
  if (!isPdfFileName(file.name)) {
    throw new TemplateValidationError("INVALID_EXTENSION", "Template file must use a .pdf extension.");
  }
}

export function validateTemplatePageCount(pageCount: number): void {
  if (pageCount < 2) {
    throw new TemplateValidationError("INSUFFICIENT_PAGES", "Template PDF must contain at least 2 pages.");
  }
}
