import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2, ImagePlus, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { compressImage, PHOTO_KINDS, PHOTO_KIND_LABEL, type PhotoKind } from "@/lib/image";

const BUCKET = "recipe-photos";

export async function uploadRecipePhoto(opts: {
  userId: string;
  recipeId: string;
  file: File;
  kind: PhotoKind;
}) {
  const blob = await compressImage(opts.file);
  const path = `${opts.userId}/${opts.recipeId}/${crypto.randomUUID()}.jpg`;
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: "image/jpeg", upsert: false });
  if (upErr) throw upErr;
  const { error } = await supabase.from("recipe_photos").insert({
    user_id: opts.userId,
    recipe_id: opts.recipeId,
    storage_path: path,
    kind: opts.kind,
  });
  if (error) throw error;
}

export function RecipePhotos({ recipeId }: { recipeId: string }) {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [kind, setKind] = useState<PhotoKind>("vorher");
  const [busy, setBusy] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const { data: photos = [] } = useQuery({
    queryKey: ["recipe-photos", recipeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipe_photos")
        .select("*")
        .eq("recipe_id", recipeId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      const withUrls = await Promise.all(
        (data ?? []).map(async (p) => {
          const { data: signed } = await supabase.storage
            .from(BUCKET)
            .createSignedUrl(p.storage_path, 3600);
          return { ...p, url: signed?.signedUrl ?? null };
        }),
      );
      return withUrls;
    },
  });

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      const userId = u.user!.id;
      for (const file of Array.from(files)) {
        await uploadRecipePhoto({ userId, recipeId, file, kind });
      }
      qc.invalidateQueries({ queryKey: ["recipe-photos", recipeId] });
      toast.success(files.length > 1 ? "Fotos hochgeladen" : "Foto hochgeladen");
    } catch (err) {
      console.error("[upload-photo]", err);
      toast.error("Upload fehlgeschlagen. Bitte Verbindung prüfen und erneut versuchen.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function remove(id: string, path: string) {
    try {
      await supabase.storage.from(BUCKET).remove([path]);
      const { error } = await supabase.from("recipe_photos").delete().eq("id", id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["recipe-photos", recipeId] });
      toast.success("Foto gelöscht");
    } catch (err) {
      console.error("[delete-photo]", err);
      toast.error("Löschen fehlgeschlagen. Bitte versuche es erneut.");
    }
  }

  return (
    <section className="card-soft p-6 space-y-4">
      <h3 className="font-serif text-lg">Fotos</h3>

      <div className="flex flex-wrap gap-2">
        {PHOTO_KINDS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={`chip ${kind === k ? "chip-active" : ""}`}
          >
            {PHOTO_KIND_LABEL[k]}
          </button>
        ))}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => fileRef.current?.click()}
        className="w-full h-11 rounded-full border border-dashed border-border inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition disabled:opacity-60"
      >
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Lädt hoch …
          </>
        ) : (
          <>
            <ImagePlus className="h-4 w-4" /> Foto hinzufügen ({PHOTO_KIND_LABEL[kind]})
          </>
        )}
      </button>

      {photos.length > 0 && (
        <ul className="grid grid-cols-3 gap-3">
          {photos.map((p) => (
            <li key={p.id} className="relative group">
              <button
                type="button"
                onClick={() => p.url && setLightbox(p.url)}
                className="block w-full aspect-square overflow-hidden rounded-xl bg-secondary"
              >
                {p.url && (
                  <img
                    src={p.url}
                    alt={`Foto ${PHOTO_KIND_LABEL[p.kind as PhotoKind]}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                )}
              </button>
              <span className="absolute left-1.5 bottom-1.5 rounded-full bg-background/85 px-2.5 py-1 text-[11px]">
                {PHOTO_KIND_LABEL[p.kind as PhotoKind]}
              </span>
              <button
                type="button"
                onClick={() => remove(p.id, p.storage_path)}
                aria-label="Foto löschen"
                className="absolute right-1.5 top-1.5 h-8 w-8 rounded-full bg-background/85 inline-flex items-center justify-center text-muted-foreground hover:text-destructive transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={!!lightbox} onOpenChange={(o) => !o && setLightbox(null)}>
        <DialogContent className="max-w-3xl p-2">
          {lightbox && <img src={lightbox} alt="Foto groß" className="w-full rounded-lg" />}
        </DialogContent>
      </Dialog>
    </section>
  );
}

/** Foto-Auswahl vor dem Speichern einer neuen Rezeptur (Upload erfolgt nach dem Anlegen). */
export type StagedPhoto = { id: string; file: File; kind: PhotoKind; preview: string };

export function StagedPhotos({
  photos,
  onChange,
}: {
  photos: StagedPhoto[];
  onChange: (next: StagedPhoto[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [kind, setKind] = useState<PhotoKind>("vorher");

  useEffect(() => {
    return () => photos.forEach((p) => URL.revokeObjectURL(p.preview));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="card-soft p-6 space-y-4">
      <h3 className="font-serif text-lg">Fotos</h3>
      <div className="flex flex-wrap gap-2">
        {PHOTO_KINDS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={`chip ${kind === k ? "chip-active" : ""}`}
          >
            {PHOTO_KIND_LABEL[k]}
          </button>
        ))}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          onChange([
            ...photos,
            ...files.map((file) => ({
              id: crypto.randomUUID(),
              file,
              kind,
              preview: URL.createObjectURL(file),
            })),
          ]);
          if (fileRef.current) fileRef.current.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="w-full h-11 rounded-full border border-dashed border-border inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
      >
        <ImagePlus className="h-4 w-4" /> Foto hinzufügen ({PHOTO_KIND_LABEL[kind]})
      </button>

      {photos.length > 0 && (
        <ul className="grid grid-cols-3 gap-3">
          {photos.map((p) => (
            <li key={p.id} className="relative">
              <div className="w-full aspect-square overflow-hidden rounded-xl bg-secondary">
                <img
                  src={p.preview}
                  alt={PHOTO_KIND_LABEL[p.kind]}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="absolute left-1.5 bottom-1.5 rounded-full bg-background/85 px-2.5 py-1 text-[11px]">
                {PHOTO_KIND_LABEL[p.kind]}
              </span>
              <button
                type="button"
                aria-label="Foto entfernen"
                onClick={() => {
                  URL.revokeObjectURL(p.preview);
                  onChange(photos.filter((x) => x.id !== p.id));
                }}
                className="absolute right-1.5 top-1.5 h-8 w-8 rounded-full bg-background/85 inline-flex items-center justify-center text-muted-foreground hover:text-destructive transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
