-- Sicherstellen, dass der Trial-Trigger für neue Registrierungen existiert
CREATE OR REPLACE FUNCTION public.handle_new_user_trial()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, status, trial_ends_at)
  VALUES (NEW.id, 'trialing', now() + interval '7 days')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger nur anlegen, falls noch nicht vorhanden
DROP TRIGGER IF EXISTS on_auth_user_created_trial ON auth.users;
CREATE TRIGGER on_auth_user_created_trial
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_trial();

-- Bestehende Nutzer ohne Abo-Zeile erhalten einen Trial
INSERT INTO public.subscriptions (user_id, status, trial_ends_at)
SELECT u.id, 'trialing', now() + interval '7 days'
FROM auth.users u
LEFT JOIN public.subscriptions s ON s.user_id = u.id
WHERE s.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- Ausführungsrechte zurücknehmen, damit nur der Trigger/Service die Funktion nutzt
REVOKE EXECUTE ON FUNCTION public.handle_new_user_trial() FROM PUBLIC, anon, authenticated;