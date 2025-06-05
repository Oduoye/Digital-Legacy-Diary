/*
  # Fix Users Table RLS Policy

  1. Changes
    - Add RLS policy to allow new users to create their profile during registration
    - Policy allows unauthenticated (anon) users to insert into users table
    - Policy ensures user can only create profile with matching auth.uid()

  2. Security
    - Maintains data integrity by enforcing user_id match
    - Only allows users to create their own profile
*/

-- Add policy for new user registration
CREATE POLICY "Enable insert for new user registration" ON public.users
    FOR INSERT
    TO anon
    WITH CHECK (auth.uid() = id);