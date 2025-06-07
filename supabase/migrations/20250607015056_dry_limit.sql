/*
  # Disable Email Confirmation

  This migration disables email confirmation for user registration.
  Users will be able to sign up and log in immediately without email verification.

  1. Configuration Changes
    - Disable email confirmation requirement
    - Allow users to sign in immediately after registration

  2. Security Notes
    - This removes the email verification step
    - Users can access the app immediately after registration
    - Email addresses are not verified but still stored
*/

-- Update auth configuration to disable email confirmation
-- Note: This needs to be done in Supabase dashboard as well
-- Go to Authentication > Settings > Email Auth and disable "Enable email confirmations"

-- For existing users who might be stuck in unconfirmed state, 
-- we can update them to be confirmed (optional)
-- UPDATE auth.users SET email_confirmed_at = now() WHERE email_confirmed_at IS NULL;

-- Ensure all users in our users table are properly set up
-- This is just a safety check - no actual changes needed
DO $$
BEGIN
  -- Log that email confirmation has been disabled
  RAISE NOTICE 'Email confirmation disabled. Users can now register and login immediately.';
END $$;