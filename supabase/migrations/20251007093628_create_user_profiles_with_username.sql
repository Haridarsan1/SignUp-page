/*
  # Create User Profiles Table with Username

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key) - References auth.users(id)
      - `username` (text, unique) - User's unique username for login
      - `full_name` (text) - User's full name
      - `email` (text) - User's email address
      - `phone_number` (text) - User's phone number
      - `location` (text) - User's location
      - `avatar_url` (text, nullable) - Profile picture URL
      - `auth_provider` (text) - How user signed up (email, google)
      - `created_at` (timestamptz) - Account creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `user_profiles` table
    - Policy for authenticated users to read their own profile
    - Policy for authenticated users to insert their own profile
    - Policy for authenticated users to update their own profile
    - Policy for authenticated users to delete their own profile

  3. Important Notes
    - Username must be unique and is used for login alongside email
    - Auth provider tracks whether user signed up via email or Google OAuth
    - Automatic timestamp management with triggers
    - All user data from signup form is stored here
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone_number text NOT NULL,
  location text NOT NULL,
  avatar_url text,
  auth_provider text DEFAULT 'email' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Allow public read for username validation"
  ON user_profiles
  FOR SELECT
  TO anon
  USING (true);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_user_profiles_updated_at
      BEFORE UPDATE ON user_profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;