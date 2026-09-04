-- Testphase für neue Registrierungen von 7 auf 14 Tage verlängern.
-- Bestehende subscriptions-Zeilen (bereits gesetztes trial_ends_at) bleiben unverändert,
-- da hier nur die Funktion neu definiert wird, die künftig bei neuen auth.users-Inserts läuft.
CREATE OR REPLACE FUNCTION public.handle_new_user_trial()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, status, trial_ends_at)
  VALUES (NEW.id, 'trialing', now() + interval '14 days')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;
