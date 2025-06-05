/*
  # Add RLS policy for user registration

  1. Changes
    - Add RLS policy to allow new users to insert their own profile data
    - This fixes the "new row violates row-level security policy" error during registration

  2. Security
    - Policy ensures users can only insert rows where their auth.uid matches the row id
    - Maintains security while allowing necessary registration functionality
*/

-- Add policy to allow users to insert their own profile during registration
CREATE POLICY "Users can insert own profile during registration"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);