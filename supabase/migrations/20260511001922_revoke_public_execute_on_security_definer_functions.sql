/*
  # Revoke EXECUTE from PUBLIC role on security-definer functions

  PostgreSQL grants EXECUTE on functions to PUBLIC by default.
  Since both `anon` and `authenticated` inherit from PUBLIC,
  revoking from them individually is insufficient.
  This migration revokes EXECUTE from PUBLIC on all three
  security-definer functions, then re-grants only where needed.

  1. `add_xp` — No role should call this via REST. Only triggers/supabase admin.
  2. `handle_new_user` — Trigger function only. No REST access needed.
  3. `handle_new_user_role` — Trigger function only. No REST access needed.
*/

REVOKE EXECUTE ON FUNCTION public.add_xp(uuid, integer) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM PUBLIC;
