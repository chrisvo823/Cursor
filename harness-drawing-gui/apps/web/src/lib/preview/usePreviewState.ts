import { useCallback, useMemo, useState } from "react";
import { buildPage2Scene } from "@harness/render";
import { parsePinoutUpload, type NormalizedPinout, PinoutParseError } from "@harness/shared";
import { loadTemplatePdf, type LoadedTemplatePdf } from "../template/loadTemplatePdf";
import { TemplateValidationError } from "../template/templateValidation";
import {
  createIdleResourceState,
  toErrorState,
  toLoadedState,
  toLoadingState,
  type ResourceState,
} from "./previewStateModel";

export type ActivePreviewPage = 1 | 2;

export type PreviewState = {
  activePage: ActivePreviewPage;
  setActivePage: (page: ActivePreviewPage) => void;
  template: ResourceState<LoadedTemplatePdf>;
  pinout: ResourceState<NormalizedPinout>;
  linePitchMm: number;
  setLinePitchMm: (value: number) => void;
  autoExpandConnectorColumns: boolean;
  setAutoExpandConnectorColumns: (value: boolean) => void;
  onTemplateUpload: (file: File | null) => Promise<void>;
  onPinoutUpload: (file: File | null) => Promise<void>;
  parsedConnectionCount: number;
  twistedPairCount: number;
  activeSheetName: string | null;
  page2Scene: ReturnType<typeof buildPage2Scene> | null;
};

function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof TemplateValidationError || error instanceof PinoutParseError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function usePreviewState(): PreviewState {
  const [activePage, setActivePage] = useState<ActivePreviewPage>(2);
  const [template, setTemplate] = useState<ResourceState<LoadedTemplatePdf>>(createIdleResourceState);
  const [pinout, setPinout] = useState<ResourceState<NormalizedPinout>>(createIdleResourceState);
  const [linePitchMm, setLinePitchMm] = useState(9.5);
  const [autoExpandConnectorColumns, setAutoExpandConnectorColumns] = useState(true);

  const onTemplateUpload = useCallback(async (file: File | null) => {
    const previous = template;
    setTemplate((current) => toLoadingState(current));
    try {
      if (!file) throw new TemplateValidationError("NO_FILE", "Template PDF is required.");
      const loaded = await loadTemplatePdf(file);
      setTemplate(toLoadedState(loaded));
    } catch (error) {
      setTemplate(toErrorState(previous, toErrorMessage(error, "Template PDF failed to load.")));
    }
  }, [template]);

  const onPinoutUpload = useCallback(async (file: File | null) => {
    const previous = pinout;
    setPinout((current) => toLoadingState(current));
    try {
      if (!file) throw new PinoutParseError("UNSUPPORTED_EXTENSION", "Pinout file is required.");
      const parsed = await parsePinoutUpload(file);
      setPinout(toLoadedState(parsed));
    } catch (error) {
      setPinout(toErrorState(previous, toErrorMessage(error, "Pinout parsing failed.")));
    }
  }, [pinout]);

  const page2Scene = useMemo(() => {
    if (pinout.status !== "loaded" || !pinout.data) return null;
    return buildPage2Scene(pinout.data, {
      linePitchMm,
      autoExpandConnectorColumns,
      leftConnectorName: "P2",
      rightConnectorName: "P4",
      leftConnectorSubtitle: "TO TAIL (J2)",
      rightConnectorSubtitle: "TO I/O CARRIER (J4)",
    });
  }, [autoExpandConnectorColumns, linePitchMm, pinout.data, pinout.status]);

  const parsedConnectionCount = pinout.data?.rows.filter((row) => row.used).length ?? 0;
  const twistedPairCount = pinout.data?.rows.filter((row) => row.type === "TP").length ?? 0;
  const activeSheetName = pinout.data?.diagnostics.selectedSheet ?? null;

  return {
    activePage,
    setActivePage,
    template,
    pinout,
    linePitchMm,
    setLinePitchMm,
    autoExpandConnectorColumns,
    setAutoExpandConnectorColumns,
    onTemplateUpload,
    onPinoutUpload,
    parsedConnectionCount,
    twistedPairCount,
    activeSheetName,
    page2Scene,
  };
}
