/** Verkleinert ein Bild clientseitig auf max. Kantenlänge und komprimiert es als JPEG. */
export async function compressImage(file: File, maxEdge = 1600, quality = 0.75): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas-unavailable");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality),
  );
  if (!blob) throw new Error("compress-failed");
  return blob;
}

export const PHOTO_KINDS = ["vorher", "nachher", "sonstiges"] as const;
export type PhotoKind = (typeof PHOTO_KINDS)[number];
export const PHOTO_KIND_LABEL: Record<PhotoKind, string> = {
  vorher: "Vorher",
  nachher: "Nachher",
  sonstiges: "Sonstiges",
};
