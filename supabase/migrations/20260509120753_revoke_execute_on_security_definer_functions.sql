/*
  # Revoke Public Execute on SECURITY DEFINER Functions

  1. Security Changes
    - Revoke EXECUTE from `anon` and `authenticated` roles on `handle_new_user()`
    - Revoke EXECUTE from `anon` and `authenticated` roles on `handle_new_user_role()`
    - These are SECURITY DEFINER functions triggered by auth events
    - They should NOT be callable via REST API (rpc/) by any client

  2. Important Notes
    - These functions are triggered automatically by INSERT on auth.users
    - They do NOT need to be called directly via the REST API
    - Revoking EXECUTE prevents external exploitation while keeping triggers working
*/

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM authenticated;
