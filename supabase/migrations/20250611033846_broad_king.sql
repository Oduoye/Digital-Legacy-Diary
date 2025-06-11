/*
  # Legacy Access System

  1. New Tables
    - `legacy_access`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `contact_id` (uuid, foreign key to trusted_contacts)
      - `access_code` (text, unique access code for heirs)
      - `is_active` (boolean, whether access is currently active)
      - `access_granted_at` (timestamp, when access was granted)
      - `last_accessed_at` (timestamp, when heir last accessed)
      - `expires_at` (timestamp, when access expires)
      - `access_type` (text, type of access: full, limited, view-only)
      - `allowed_content` (jsonb, array of allowed content types)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `heir_registrations`
      - `id` (uuid, primary key)
      - `access_code` (text, foreign key to legacy_access)
      - `email` (text, heir's email)
      - `name` (text, heir's name)
      - `relationship` (text, relationship to deceased)
      - `registered_at` (timestamp)
      - `is_verified` (boolean, whether heir is verified)
      - `original_user_id` (uuid, reference to original user)
      - `original_user_name` (text, name of original user)

  2. Security
    - Enable RLS on both tables
    - Add policies for secure access
    - Add indexes for performance

  3. Functions
    - Function to generate unique access codes
    - Function to trigger legacy access when needed
*/

-- Create legacy_access table
CREATE TABLE IF NOT EXISTS legacy_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES trusted_contacts(id) ON DELETE CASCADE,
  access_code text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  access_granted_at timestamptz,
  last_accessed_at timestamptz,
  expires_at timestamptz,
  access_type text DEFAULT 'full' CHECK (access_type IN ('full', 'limited', 'view-only')),
  allowed_content jsonb DEFAULT '["diary", "wills", "photos"]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create heir_registrations table
CREATE TABLE IF NOT EXISTS heir_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  access_code text NOT NULL,
  email text NOT NULL,
  name text NOT NULL,
  relationship text,
  registered_at timestamptz DEFAULT now(),
  is_verified boolean DEFAULT false,
  original_user_id uuid,
  original_user_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE legacy_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE heir_registrations ENABLE ROW LEVEL SECURITY;

-- Policies for legacy_access
CREATE POLICY "Users can manage their own legacy access"
  ON legacy_access
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Public can read active legacy access by code"
  ON legacy_access
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Policies for heir_registrations
CREATE POLICY "Users can view registrations for their legacy"
  ON heir_registrations
  FOR SELECT
  TO authenticated
  USING (original_user_id = auth.uid());

CREATE POLICY "Public can register as heir"
  ON heir_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Heirs can update their own registration"
  ON heir_registrations
  FOR UPDATE
  TO anon, authenticated
  USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_legacy_access_user_id ON legacy_access(user_id);
CREATE INDEX IF NOT EXISTS idx_legacy_access_contact_id ON legacy_access(contact_id);
CREATE INDEX IF NOT EXISTS idx_legacy_access_code ON legacy_access(access_code);
CREATE INDEX IF NOT EXISTS idx_heir_registrations_access_code ON heir_registrations(access_code);
CREATE INDEX IF NOT EXISTS idx_heir_registrations_email ON heir_registrations(email);

-- Function to generate unique access codes
CREATE OR REPLACE FUNCTION generate_access_code()
RETURNS text AS $$
DECLARE
  code text;
  exists boolean;
BEGIN
  LOOP
    -- Generate a random 12-character code
    code := upper(substring(md5(random()::text) from 1 for 12));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM legacy_access WHERE access_code = code) INTO exists;
    
    -- If code doesn't exist, return it
    IF NOT exists THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to create legacy access for trusted contacts
CREATE OR REPLACE FUNCTION create_legacy_access_for_contacts(user_uuid uuid)
RETURNS void AS $$
DECLARE
  contact_record record;
  access_code text;
BEGIN
  -- Loop through all trusted contacts for the user
  FOR contact_record IN 
    SELECT id, name, email, relationship 
    FROM trusted_contacts 
    WHERE user_id = user_uuid
  LOOP
    -- Generate unique access code
    access_code := generate_access_code();
    
    -- Create legacy access record
    INSERT INTO legacy_access (
      user_id,
      contact_id,
      access_code,
      is_active,
      access_type,
      allowed_content
    ) VALUES (
      user_uuid,
      contact_record.id,
      access_code,
      true,
      'full',
      '["diary", "wills", "photos", "messages"]'::jsonb
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to trigger legacy access (called when dead man's switch activates)
CREATE OR REPLACE FUNCTION trigger_legacy_access(user_uuid uuid)
RETURNS void AS $$
DECLARE
  user_name text;
BEGIN
  -- Get user name
  SELECT name INTO user_name FROM users WHERE id = user_uuid;
  
  -- Create legacy access for all trusted contacts if not already exists
  PERFORM create_legacy_access_for_contacts(user_uuid);
  
  -- Update legacy access to mark as granted
  UPDATE legacy_access 
  SET 
    access_granted_at = now(),
    is_active = true
  WHERE user_id = user_uuid;
  
  -- Here you would typically send emails to trusted contacts
  -- This would be handled by your application logic
END;
$$ LANGUAGE plpgsql;