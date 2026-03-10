export type PinoutParseErrorCode =
  | "UNSUPPORTED_EXTENSION"
  | "WORKBOOK_EMPTY"
  | "MISSING_REQUIRED_COLUMNS"
  | "NO_USABLE_ROWS";

export class PinoutParseError extends Error {
  code: PinoutParseErrorCode;

  constructor(code: PinoutParseErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = "PinoutParseError";
  }
}
