import { useCallback, useMemo, useState } from "react";
import {
  buildPage1OverlayModel,
  buildPage2Scene,
  type Page1OverlayFields,
  type Page1TemplateAnchorConfig,
  type Page2TemplateAnchorConfig,
} from "@harness/render";
import {
  parsePinoutUpload,
  type NormalizedPinout,
  PinoutParseError,
  ProjectSchemaError,
} from "@harness/shared";
import {
  createDefaultPage1Fields,
  updateCalloutField,
  updateRevisionField,
  updateTitleBlockField,
} from "../page1/page1Fields";
import { loadTemplatePdf, type LoadedTemplatePdf } from "../template/loadTemplatePdf";
import { TemplateValidationError } from "../template/templateValidation";
import { downloadBlob } from "../export/download";
import { exportDrawingPdf } from "../export/pdf";
import {
  buildPage1PrimitivesForExport,
  buildPage2PrimitivesForExport,
  exportCurrentPageSvg,
  exportPage2Dxf,
} from "../export/pageExports";
import {
  buildProjectDocument,
  parseProjectFileText,
  projectDocumentToLoadedTemplate,
  serializeProjectDocument,
  validateLoadedProjectOrThrow,
} from "../project/projectDocument";
import {
  createIdleResourceState,
  toErrorState,
  toLoadedState,
  toLoadingState,
  type ResourceState,
} from "./previewStateModel";
import { resolveTemplateCalibrationProfile } from "../template/calibrationProfile";

export type ActivePreviewPage = 1 | 2;

export type PreviewActionMessage = {
  tone: "ok" | "warn";
  text: string;
};

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
  page1Fields: Page1OverlayFields;
  setPage1OverallLength: (value: string) => void;
  setPage1LabelA: (value: string) => void;
  setPage1LabelB: (value: string) => void;
  setPage1NotesText: (value: string) => void;
  setPage1RevisionField: (key: keyof Page1OverlayFields["revision"], value: string) => void;
  setPage1TitleBlockField: (key: keyof Page1OverlayFields["titleBlock"], value: string) => void;
  setPage1CalloutValue: (id: string, value: string) => void;
  onProjectUpload: (file: File | null) => Promise<void>;
  saveProjectJson: () => Promise<void>;
  canSaveProject: boolean;
  exportPdf: () => Promise<void>;
  exportSvg: () => Promise<void>;
  exportDxf: () => Promise<void>;
  actionMessage: PreviewActionMessage | null;
  clearActionMessage: () => void;
  canExport: boolean;
  page1OverlayModel: ReturnType<typeof buildPage1OverlayModel>;
  page2Scene: ReturnType<typeof buildPage2Scene> | null;
  page1TemplateAnchors: Page1TemplateAnchorConfig;
  page2TemplateAnchors: Page2TemplateAnchorConfig;
};

class PreviewActionError extends Error {
  readonly code: "MISSING_TEMPLATE" | "MISSING_PINOUT";

  constructor(code: "MISSING_TEMPLATE" | "MISSING_PINOUT", message: string) {
    super(message);
    this.code = code;
    this.name = "PreviewActionError";
  }
}

function requireLoadedTemplate(template: ResourceState<LoadedTemplatePdf>): LoadedTemplatePdf {
  if (template.status !== "loaded" || !template.data) {
    throw new PreviewActionError("MISSING_TEMPLATE", "Load a valid 2-page template PDF before this action.");
  }
  return template.data;
}

function requireLoadedPinout(pinout: ResourceState<NormalizedPinout>): NormalizedPinout {
  if (pinout.status !== "loaded" || !pinout.data) {
    throw new PreviewActionError("MISSING_PINOUT", "Load a parsed pinout workbook or CSV before this action.");
  }
  return pinout.data;
}

function toErrorMessage(error: unknown, fallback: string): string {
  if (
    error instanceof TemplateValidationError ||
    error instanceof PinoutParseError ||
    error instanceof ProjectSchemaError ||
    error instanceof PreviewActionError
  ) {
    return error.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function usePreviewState(): PreviewState {
  const [activePage, setActivePage] = useState<ActivePreviewPage>(2);
  const [template, setTemplate] = useState<ResourceState<LoadedTemplatePdf>>(createIdleResourceState);
  const [pinout, setPinout] = useState<ResourceState<NormalizedPinout>>(createIdleResourceState);
  const [linePitchMm, setLinePitchMm] = useState(9.5);
  const [autoExpandConnectorColumns, setAutoExpandConnectorColumns] = useState(true);
  const [leftConnectorName, setLeftConnectorName] = useState("P2");
  const [rightConnectorName, setRightConnectorName] = useState("P4");
  const [leftConnectorSubtitle, setLeftConnectorSubtitle] = useState("TO TAIL (J2)");
  const [rightConnectorSubtitle, setRightConnectorSubtitle] = useState("TO I/O CARRIER (J4)");
  const [page1Fields, setPage1Fields] = useState<Page1OverlayFields>(createDefaultPage1Fields);
  const [actionMessage, setActionMessage] = useState<PreviewActionMessage | null>(null);

  const onTemplateUpload = useCallback(async (file: File | null) => {
    setTemplate((current) => toLoadingState(current));
    try {
      if (!file) throw new TemplateValidationError("NO_FILE", "Template PDF is required.");
      const loaded = await loadTemplatePdf(file);
      setTemplate(toLoadedState(loaded));
    } catch (error) {
      setTemplate((current) => toErrorState(current, toErrorMessage(error, "Template PDF failed to load.")));
    }
  }, []);

  const onPinoutUpload = useCallback(async (file: File | null) => {
    setPinout((current) => toLoadingState(current));
    try {
      if (!file) throw new PinoutParseError("UNSUPPORTED_EXTENSION", "Pinout file is required.");
      const parsed = await parsePinoutUpload(file);
      setPinout(toLoadedState(parsed));
    } catch (error) {
      setPinout((current) => toErrorState(current, toErrorMessage(error, "Pinout parsing failed.")));
    }
  }, []);

  const page2Scene = useMemo(() => {
    if (pinout.status !== "loaded" || !pinout.data) return null;
    return buildPage2Scene(pinout.data, {
      linePitchMm,
      autoExpandConnectorColumns,
      leftConnectorName,
      rightConnectorName,
      leftConnectorSubtitle,
      rightConnectorSubtitle,
    });
  }, [
    autoExpandConnectorColumns,
    leftConnectorName,
    leftConnectorSubtitle,
    linePitchMm,
    pinout,
    rightConnectorName,
    rightConnectorSubtitle,
  ]);

  const parsedConnectionCount = pinout.data?.rows.filter((row) => row.used).length ?? 0;
  const twistedPairCount = pinout.data?.rows.filter((row) => row.type === "TP").length ?? 0;
  const activeSheetName = pinout.data?.diagnostics.selectedSheet ?? null;
  const calibrationProfile = useMemo(
    () => resolveTemplateCalibrationProfile(template.data?.fileName),
    [template.data?.fileName],
  );
  const page1OverlayModel = useMemo(
    () => buildPage1OverlayModel(page1Fields, calibrationProfile.page1),
    [calibrationProfile.page1, page1Fields],
  );

  const setPage1OverallLength = useCallback((value: string) => {
    setPage1Fields((current) => ({ ...current, overallLength: value }));
  }, []);

  const setPage1LabelA = useCallback((value: string) => {
    setPage1Fields((current) => ({ ...current, labelA: value }));
  }, []);

  const setPage1LabelB = useCallback((value: string) => {
    setPage1Fields((current) => ({ ...current, labelB: value }));
  }, []);

  const setPage1NotesText = useCallback((value: string) => {
    setPage1Fields((current) => ({ ...current, notesText: value }));
  }, []);

  const setPage1RevisionField = useCallback((key: keyof Page1OverlayFields["revision"], value: string) => {
    setPage1Fields((current) => ({
      ...current,
      revision: updateRevisionField(current.revision, key, value),
    }));
  }, []);

  const setPage1TitleBlockField = useCallback((key: keyof Page1OverlayFields["titleBlock"], value: string) => {
    setPage1Fields((current) => ({
      ...current,
      titleBlock: updateTitleBlockField(current.titleBlock, key, value),
    }));
  }, []);

  const setPage1CalloutValue = useCallback((id: string, value: string) => {
    setPage1Fields((current) => ({
      ...current,
      callouts: updateCalloutField(current.callouts, id, value),
    }));
  }, []);

  const clearActionMessage = useCallback(() => setActionMessage(null), []);

  const canSaveProject = template.status === "loaded" && pinout.status === "loaded";
  const canExport = canSaveProject && page2Scene !== null;

  const saveProjectJson = useCallback(async () => {
    try {
      const loadedTemplate = requireLoadedTemplate(template);
      const loadedPinout = requireLoadedPinout(pinout);
      const document = buildProjectDocument({
        template: loadedTemplate,
        pinout: loadedPinout,
        page1Fields,
        page2: {
          linePitchMm,
          autoExpandConnectorColumns,
          connectors: {
            leftName: leftConnectorName,
            rightName: rightConnectorName,
            leftSubtitle: leftConnectorSubtitle,
            rightSubtitle: rightConnectorSubtitle,
          },
        },
        activePage,
      });
      const json = serializeProjectDocument(document);
      downloadBlob("harness_project.json", new Blob([json], { type: "application/json" }));
      setActionMessage({ tone: "ok", text: "Project JSON saved." });
    } catch (error) {
      setActionMessage({ tone: "warn", text: toErrorMessage(error, "Project save failed.") });
    }
  }, [
    activePage,
    autoExpandConnectorColumns,
    leftConnectorName,
    leftConnectorSubtitle,
    linePitchMm,
    page1Fields,
    rightConnectorName,
    rightConnectorSubtitle,
    pinout,
    template,
  ]);

  const onProjectUpload = useCallback(async (file: File | null) => {
    try {
      if (!file) throw new ProjectSchemaError("INVALID_JSON", "Project JSON file is required.");
      const text = await file.text();
      const parsed = validateLoadedProjectOrThrow(parseProjectFileText(text));

      setTemplate(toLoadedState(projectDocumentToLoadedTemplate(parsed)));
      setPinout(toLoadedState(parsed.pinout.normalized));
      setPage1Fields(parsed.page1);
      setLinePitchMm(parsed.page2.layout.linePitchMm);
      setAutoExpandConnectorColumns(parsed.page2.layout.autoExpandConnectorColumns);
      setLeftConnectorName(parsed.page2.connectors.leftName);
      setRightConnectorName(parsed.page2.connectors.rightName);
      setLeftConnectorSubtitle(parsed.page2.connectors.leftSubtitle);
      setRightConnectorSubtitle(parsed.page2.connectors.rightSubtitle);
      setActivePage(parsed.ui.activePage);
      setActionMessage({ tone: "ok", text: "Project JSON loaded." });
    } catch (error) {
      setActionMessage({ tone: "warn", text: toErrorMessage(error, "Project load failed.") });
    }
  }, []);

  const exportPdf = useCallback(async () => {
    try {
      const loadedTemplate = requireLoadedTemplate(template);
      requireLoadedPinout(pinout);
      if (!page2Scene) throw new PreviewActionError("MISSING_PINOUT", "Load pinout before exporting PDF.");

      const page1 = loadedTemplate.pages[0];
      const page2 = loadedTemplate.pages[1];
      const page1Primitives = buildPage1PrimitivesForExport(page1, page1OverlayModel, calibrationProfile.page1);
      const page2Primitives = buildPage2PrimitivesForExport(page2, page2Scene, calibrationProfile.page2);

      const pdfBytes = await exportDrawingPdf({
        pages: [
          {
            widthPt: page1.widthPt,
            heightPt: page1.heightPt,
            backgroundImageDataUrl: page1.imageDataUrl,
            primitives: page1Primitives,
          },
          {
            widthPt: page2.widthPt,
            heightPt: page2.heightPt,
            backgroundImageDataUrl: page2.imageDataUrl,
            primitives: page2Primitives,
          },
        ],
      });
      downloadBlob("harness_drawing.pdf", new Blob([pdfBytes], { type: "application/pdf" }));
      setActionMessage({ tone: "ok", text: "PDF export complete." });
    } catch (error) {
      setActionMessage({ tone: "warn", text: toErrorMessage(error, "PDF export failed.") });
    }
  }, [
    calibrationProfile.page1,
    calibrationProfile.page2,
    page1OverlayModel,
    page2Scene,
    pinout,
    template,
  ]);

  const exportSvg = useCallback(async () => {
    try {
      const loadedTemplate = requireLoadedTemplate(template);
      const svg = exportCurrentPageSvg(loadedTemplate, activePage, page1OverlayModel, page2Scene, {
        page1: calibrationProfile.page1,
        page2: calibrationProfile.page2,
      });
      const fileName = activePage === 1 ? "harness_page1.svg" : "harness_page2.svg";
      downloadBlob(fileName, new Blob([svg], { type: "image/svg+xml" }));
      setActionMessage({ tone: "ok", text: "SVG export complete." });
    } catch (error) {
      setActionMessage({ tone: "warn", text: toErrorMessage(error, "SVG export failed.") });
    }
  }, [
    activePage,
    calibrationProfile.page1,
    calibrationProfile.page2,
    page1OverlayModel,
    page2Scene,
    template,
  ]);

  const exportDxf = useCallback(async () => {
    try {
      const loadedTemplate = requireLoadedTemplate(template);
      if (!page2Scene) throw new PreviewActionError("MISSING_PINOUT", "Load pinout before exporting DXF.");
      const dxf = exportPage2Dxf(loadedTemplate, page2Scene, calibrationProfile.page2);
      downloadBlob("harness_page2.dxf", new Blob([dxf], { type: "application/dxf" }));
      setActionMessage({ tone: "ok", text: "DXF export complete." });
    } catch (error) {
      setActionMessage({ tone: "warn", text: toErrorMessage(error, "DXF export failed.") });
    }
  }, [calibrationProfile.page2, page2Scene, template]);

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
    page1Fields,
    setPage1OverallLength,
    setPage1LabelA,
    setPage1LabelB,
    setPage1NotesText,
    setPage1RevisionField,
    setPage1TitleBlockField,
    setPage1CalloutValue,
    onProjectUpload,
    saveProjectJson,
    canSaveProject,
    exportPdf,
    exportSvg,
    exportDxf,
    actionMessage,
    clearActionMessage,
    canExport,
    page1OverlayModel,
    page2Scene,
    page1TemplateAnchors: calibrationProfile.page1,
    page2TemplateAnchors: calibrationProfile.page2,
  };
}
