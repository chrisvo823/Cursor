import type { Page2OverlayTransform } from "../types";

type OverlayCalibrationInput = {
  sceneWidth: number;
  sceneHeight: number;
  targetWidth: number;
  targetHeight: number;
};

export function computeOverlayTransform(input: OverlayCalibrationInput): Page2OverlayTransform {
  const { sceneWidth, sceneHeight, targetWidth, targetHeight } = input;

  if (sceneWidth <= 0 || sceneHeight <= 0 || targetWidth <= 0 || targetHeight <= 0) {
    return { scale: 1, offsetX: 0, offsetY: 0 };
  }

  const scale = Math.min(targetWidth / sceneWidth, targetHeight / sceneHeight);
  const scaledWidth = sceneWidth * scale;
  const scaledHeight = sceneHeight * scale;
  const offsetX = (targetWidth - scaledWidth) / 2;
  const offsetY = (targetHeight - scaledHeight) / 2;

  return { scale, offsetX, offsetY };
}
