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

const SAMPLE_FILE_MATCH = /(example|ladder[_-]?26pin|referenceprototype)/i;

export function resolveTemplateCalibrationProfile(templateFileName?: string | null): TemplateCalibrationProfile {
  if (templateFileName && SAMPLE_FILE_MATCH.test(templateFileName)) {
    return SAMPLE_LADDER_26PIN_PROFILE;
  }
  return DEFAULT_PROFILE;
}
