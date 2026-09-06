-- Inventar-Modul: reines Mengen-Tracking (kein Preis-/Kostenfeld).

CREATE TABLE public.inventory_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  shade TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'g',
  quantity NUMERIC(10,2) NOT NULL DEFAULT 0,
  min_stock NUMERIC(10,2) NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, brand, shade)
);

CREATE INDEX inventory_products_user_id_idx ON public.inventory_products(user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory_products TO authenticated;
GRANT ALL ON public.inventory_products TO service_role;

ALTER TABLE public.inventory_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own inventory products" ON public.inventory_products
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER inventory_products_updated_at
  BEFORE UPDATE ON public.inventory_products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Bewegungsjournal: jede Bestandsänderung (Wareneingang, Verbrauch,
-- Korrektur) wird hier protokolliert; product.quantity ist die laufende
-- Summe daraus (siehe Trigger unten).
CREATE TABLE public.inventory_movements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.inventory_products(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('wareneingang','verbrauch','korrektur')),
  quantity NUMERIC(10,2) NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX inventory_movements_product_id_idx ON public.inventory_movements(product_id);
CREATE INDEX inventory_movements_user_id_idx ON public.inventory_movements(user_id);
CREATE INDEX inventory_movements_recipe_id_idx ON public.inventory_movements(recipe_id);

GRANT SELECT, INSERT ON public.inventory_movements TO authenticated;
GRANT ALL ON public.inventory_movements TO service_role;

ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own inventory movements read" ON public.inventory_movements
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "own inventory movements insert" ON public.inventory_movements
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Jede eingefügte Bewegung schreibt sich sofort in den Produktbestand fort.
CREATE OR REPLACE FUNCTION public.apply_inventory_movement()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.inventory_products
  SET quantity = quantity + NEW.quantity
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER inventory_movements_apply
  AFTER INSERT ON public.inventory_movements
  FOR EACH ROW EXECUTE FUNCTION public.apply_inventory_movement();

-- Automatischer Verbrauchsabzug: beim Speichern einer Rezeptur-Komponente
-- wird über Marke+Ton (inkl. Freitext-Varianten) das passende Produkt im
-- Inventar gesucht und die hinterlegte Gramm-Menge abgezogen. Findet sich
-- kein Produkt (z. B. frei getippte Marke/Ton ohne Inventar-Eintrag),
-- passiert nichts.
CREATE OR REPLACE FUNCTION public.consume_inventory_on_recipe_component()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  matched_product_id UUID;
  effective_brand TEXT := COALESCE(NULLIF(NEW.brand_custom, ''), NEW.brand);
  effective_shade TEXT := COALESCE(NULLIF(NEW.shade_custom, ''), NEW.shade);
BEGIN
  IF NEW.grams IS NULL OR NEW.grams <= 0 THEN
    RETURN NEW;
  END IF;

  SELECT id INTO matched_product_id
  FROM public.inventory_products
  WHERE user_id = NEW.user_id
    AND brand = effective_brand
    AND shade = effective_shade
  LIMIT 1;

  IF matched_product_id IS NOT NULL THEN
    INSERT INTO public.inventory_movements (user_id, product_id, recipe_id, type, quantity, note)
    VALUES (NEW.user_id, matched_product_id, NEW.recipe_id, 'verbrauch', -NEW.grams, 'Automatischer Abzug durch Rezeptur');
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER recipe_components_consume_inventory
  AFTER INSERT ON public.recipe_components
  FOR EACH ROW EXECUTE FUNCTION public.consume_inventory_on_recipe_component();

-- Rückbuchung: wird eine Rezeptur-Komponente wieder gelöscht (z. B. weil
-- die ganze Rezeptur gelöscht wird), erhält das passende Produkt die
-- zuvor abgezogene Menge zurück.
CREATE OR REPLACE FUNCTION public.restock_inventory_on_recipe_component_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  matched_product_id UUID;
  effective_brand TEXT := COALESCE(NULLIF(OLD.brand_custom, ''), OLD.brand);
  effective_shade TEXT := COALESCE(NULLIF(OLD.shade_custom, ''), OLD.shade);
BEGIN
  IF OLD.grams IS NULL OR OLD.grams <= 0 THEN
    RETURN OLD;
  END IF;

  SELECT id INTO matched_product_id
  FROM public.inventory_products
  WHERE user_id = OLD.user_id
    AND brand = effective_brand
    AND shade = effective_shade
  LIMIT 1;

  IF matched_product_id IS NOT NULL THEN
    INSERT INTO public.inventory_movements (user_id, product_id, recipe_id, type, quantity, note)
    VALUES (OLD.user_id, matched_product_id, NULL, 'korrektur', OLD.grams, 'Rückbuchung: Rezeptur-Komponente gelöscht');
  END IF;

  RETURN OLD;
END;
$$;

CREATE TRIGGER recipe_components_restock_inventory
  AFTER DELETE ON public.recipe_components
  FOR EACH ROW EXECUTE FUNCTION public.restock_inventory_on_recipe_component_delete();

REVOKE EXECUTE ON FUNCTION public.apply_inventory_movement() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.consume_inventory_on_recipe_component() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.restock_inventory_on_recipe_component_delete() FROM PUBLIC, anon, authenticated;
