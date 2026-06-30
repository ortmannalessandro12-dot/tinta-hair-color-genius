-- Ensure 7-day trial row is created automatically on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created_trial ON auth.users;
CREATE TRIGGER on_auth_user_created_trial
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_trial();

-- Backfill: any existing users without a subscription row get a trial starting now
INSERT INTO public.subscriptions (user_id, status, trial_ends_at)
SELECT u.id, 'trialing', now() + interval '7 days'
FROM auth.users u
LEFT JOIN public.subscriptions s ON s.user_id = u.id
WHERE s.user_id IS NULL;