CREATE TABLE public.product_prices (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand text NOT NULL,
  tube_size_g numeric(6,2) NOT NULL,
  price_eur numeric(8,2) NOT NULL,
  is_default boolean NOT NULL DEFAULT false,
  price_verified boolean NOT NULL DEFAULT false,
  price_source text,
  last_checked_at date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, brand)
);

CREATE INDEX product_prices_user_id_idx ON public.product_prices(user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_prices TO authenticated;
GRANT ALL ON public.product_prices TO service_role;

ALTER TABLE public.product_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own product prices" ON public.product_prices
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER product_prices_updated_at BEFORE UPDATE ON public.product_prices
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
