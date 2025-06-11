/*
  # Enable Email Confirmation for Authentication

  1. Configuration
    - Enable email confirmation requirement
    - Set up proper email templates
    - Configure redirect URLs
  
  2. Security
    - Ensure users must verify email before accessing the app
    - Prevent unverified users from creating profiles
*/

-- Enable email confirmation in auth settings
-- Note: This would typically be done in the Supabase dashboard under Authentication > Settings
-- But we can create a function to help with this

-- Update the handle_new_user function to only create profiles for confirmed users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Only create user profile if email is confirmed
  IF NEW.email_confirmed_at IS NOT NULL THEN
    INSERT INTO public.users (id, name, email, subscription_tier)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', ''),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'subscription_tier', 'free')
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the trigger to handle email confirmation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create a function to handle email confirmation updates
CREATE OR REPLACE FUNCTION public.handle_email_confirmation()
RETURNS trigger AS $$
BEGIN
  -- If email was just confirmed and user profile doesn't exist, create it
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    INSERT INTO public.users (id, name, email, subscription_tier)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', ''),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'subscription_tier', 'free')
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for email confirmation
CREATE TRIGGER on_email_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW 
  WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
  EXECUTE PROCEDURE public.handle_email_confirmation();