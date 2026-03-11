import { describe, expect, it } from "vitest";
import {
  createIdleResourceState,
  toErrorState,
  toLoadedState,
  toLoadingState,
} from "../lib/preview/previewStateModel";

describe("previewStateModel", () => {
  it("transitions from idle -> loading -> loaded for valid input", () => {
    const idle = createIdleResourceState<{ file: string }>();
    const loading = toLoadingState(idle);
    const loaded = toLoadedState({ file: "Template.pdf" });

    expect(idle.status).toBe("idle");
    expect(loading.status).toBe("loading");
    expect(loaded.status).toBe("loaded");
    expect(loaded.data?.file).toBe("Template.pdf");
  });

  it("transitions to error and preserves prior data for invalid input", () => {
    const loaded = toLoadedState({ file: "Template.pdf" });
    const error = toErrorState(loaded, "Template PDF must contain at least 2 pages.");

    expect(error.status).toBe("error");
    expect(error.error).toContain("at least 2 pages");
    expect(error.data?.file).toBe("Template.pdf");
  });
});
