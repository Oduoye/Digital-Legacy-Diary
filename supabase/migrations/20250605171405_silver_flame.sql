/*
  # Initial Database Schema Setup

  1. New Tables
    - users
      - Core user data and profile information
      - Subscription details
      - Life story data
    - trusted_contacts
      - Contact information for legacy recipients
    - diary_entries
      - Journal entries with content and metadata
    - wills
      - Digital will information and attachments
    - dead_mans_switches
      - Dead man's switch configuration and status

  2. Security
    - Enable RLS on all tables
    - Create policies for authenticated users
    - Ensure data isolation between users

  3. Changes
    - Initial schema creation
    - Foreign key relationships
    - Indexes for performance
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  profile_picture text,
  bio text,
  social_links jsonb DEFAULT '{}',
  subscription_tier text DEFAULT 'free',
  subscription_start_date timestamptz DEFAULT now(),
  subscription_end_date timestamptz,
  life_story_last_generated timestamptz,
  life_story_narrative text,
  life_story_themes jsonb,
  life_story_timeline jsonb,
  life_story_relationships jsonb,
  life_story_values jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trusted_contacts table
CREATE TABLE IF NOT EXISTS trusted_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  relationship text,
  picture text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create diary_entries table
CREATE TABLE IF NOT EXISTS diary_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  tags text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create wills table
CREATE TABLE IF NOT EXISTS wills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  attachments jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create dead_mans_switches table
CREATE TABLE IF NOT EXISTS dead_mans_switches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  status text DEFAULT 'active',
  check_in_interval integer NOT NULL,
  last_check_in timestamptz DEFAULT now(),
  next_check_in_due timestamptz,
  notifications_sent integer DEFAULT 0,
  trusted_contacts_ids uuid[] DEFAULT '{}',
  custom_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trusted_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE wills ENABLE ROW LEVEL SECURITY;
ALTER TABLE dead_mans_switches ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for trusted_contacts table
CREATE POLICY "Users can view own contacts"
  ON trusted_contacts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create contacts"
  ON trusted_contacts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contacts"
  ON trusted_contacts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own contacts"
  ON trusted_contacts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for diary_entries table
CREATE POLICY "Users can view own entries"
  ON diary_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create entries"
  ON diary_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries"
  ON diary_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries"
  ON diary_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for wills table
CREATE POLICY "Users can view own will"
  ON wills
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create will"
  ON wills
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own will"
  ON wills
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own will"
  ON wills
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for dead_mans_switches table
CREATE POLICY "Users can view own switches"
  ON dead_mans_switches
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create switches"
  ON dead_mans_switches
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own switches"
  ON dead_mans_switches
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own switches"
  ON dead_mans_switches
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_diary_entries_user_id ON diary_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_trusted_contacts_user_id ON trusted_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_wills_user_id ON wills(user_id);
CREATE INDEX IF NOT EXISTS idx_dead_mans_switches_user_id ON dead_mans_switches(user_id);
CREATE INDEX IF NOT EXISTS idx_diary_entries_created_at ON diary_entries(created_at DESC);