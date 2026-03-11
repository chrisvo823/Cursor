export function downloadBlob(fileName: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const marker = ";base64,";
  const markerIndex = dataUrl.indexOf(marker);
  if (markerIndex < 0) return new Uint8Array();
  const base64 = dataUrl.slice(markerIndex + marker.length);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}
