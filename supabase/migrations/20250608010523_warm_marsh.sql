/*
  # Add profile_picture column mapping

  1. Changes
    - The application code expects 'profilePicture' but the database has 'profile_picture'
    - We need to ensure the column exists and is properly accessible
    - The schema shows 'profile_picture' exists, so we just need to make sure it's accessible

  2. Security
    - No changes to existing RLS policies needed
*/

-- Ensure the profile_picture column exists (it should already exist based on schema)
-- This is a safety check in case there are any inconsistencies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'profile_picture'
  ) THEN
    ALTER TABLE users ADD COLUMN profile_picture text;
  END IF;
END $$;