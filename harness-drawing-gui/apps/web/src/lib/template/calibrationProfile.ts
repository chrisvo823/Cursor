import {
  DEFAULT_PAGE1_TEMPLATE_ANCHORS,
  DEFAULT_PAGE2_TEMPLATE_ANCHORS,
  SAMPLE_LADDER_26PIN_PAGE1_TEMPLATE_ANCHORS,
  SAMPLE_LADDER_26PIN_PAGE2_TEMPLATE_ANCHORS,
  type Page1TemplateAnchorConfig,
  type Page2TemplateAnchorConfig,
} from "@harness/render";

export type TemplateCalibrationProfileId = "default" | "sample_ladder_26pin";

export type TemplateCalibrationProfile = {
  id: TemplateCalibrationProfileId;
  label: string;
  page1: Page1TemplateAnchorConfig;
  page2: Page2TemplateAnchorConfig;
};

export type CalibrationProfileResolutionInput = {
  templateFileName?: string | null;
  page1SizePt?: { width: number; height: number } | null;
  page2SizePt?: { width: number; height: number } | null;
};

const DEFAULT_PROFILE: TemplateCalibrationProfile = {
  id: "default",
  label: "Default template anchors",
  page1: DEFAULT_PAGE1_TEMPLATE_ANCHORS,
  page2: DEFAULT_PAGE2_TEMPLATE_ANCHORS,
};

const SAMPLE_LADDER_26PIN_PROFILE: TemplateCalibrationProfile = {
  id: "sample_ladder_26pin",
  label: "Sample ladder-26pin anchors",
  page1: SAMPLE_LADDER_26PIN_PAGE1_TEMPLATE_ANCHORS,
  page2: SAMPLE_LADDER_26PIN_PAGE2_TEMPLATE_ANCHORS,
};

const SAMPLE_FILE_MATCH =
  /(example|ladder[_-]?26pin|referenceprototype|harness[_-]|1000\d{4,})/i;

function isApprox(value: number, target: number, tolerance = 1.5): boolean {
  return Math.abs(value - target) <= tolerance;
}

function matchesSamplePageSize(page?: { width: number; height: number } | null): boolean {
  if (!page) return false;
  return isApprox(page.width, 720) && isApprox(page.height, 405);
}

export function resolveTemplateCalibrationProfile(input?: CalibrationProfileResolutionInput): TemplateCalibrationProfile {
  if (input?.templateFileName && SAMPLE_FILE_MATCH.test(input.templateFileName)) {
    return SAMPLE_LADDER_26PIN_PROFILE;
  }
  if (matchesSamplePageSize(input?.page1SizePt) && matchesSamplePageSize(input?.page2SizePt)) {
    return SAMPLE_LADDER_26PIN_PROFILE;
  }
  return DEFAULT_PROFILE;
}
