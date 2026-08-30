ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS allergies text,
  ADD COLUMN IF NOT EXISTS allergy_consent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS allergy_consent_at timestamptz;

CREATE TABLE IF NOT EXISTS public.recipe_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id uuid NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  kind text NOT NULL DEFAULT 'sonstiges' CHECK (kind IN ('vorher','nachher','sonstiges')),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.recipe_photos TO authenticated;
GRANT ALL ON public.recipe_photos TO service_role;

ALTER TABLE public.recipe_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own recipe photos" ON public.recipe_photos
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS recipe_photos_recipe_id_idx ON public.recipe_photos(recipe_id);

CREATE POLICY "own recipe photo files select" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'recipe-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "own recipe photo files insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'recipe-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "own recipe photo files update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'recipe-photos' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'recipe-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "own recipe photo files delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'recipe-photos' AND (storage.foldername(name))[1] = auth.uid()::text);