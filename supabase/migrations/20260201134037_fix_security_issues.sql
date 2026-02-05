/*
  # Fix Security Issues

  ## Changes
  1. **Remove Unused Index**
     - Drop `idx_favorites_station_id` which is redundant due to the composite unique index `favorites_device_id_station_id_key`
  
  2. **Fix Insecure RLS Policies**
     - Drop all existing policies that use `true` (allowing unrestricted access)
     - Since this app uses device-based identification without authentication, RLS cannot be properly enforced
     - Disable RLS to avoid false sense of security
     - Note: Consider implementing proper authentication (e.g., Supabase Auth) for production use

  ## Security Notes
  - Without authentication, row-level security cannot properly validate device ownership
  - Current approach relies on client-side device_id which can be spoofed
  - For production: implement Supabase Auth and use auth.uid() in RLS policies
  
  ## Auth Connection Strategy
  - The Auth DB connection strategy needs to be changed from fixed (10 connections) to percentage-based
  - This must be done through Supabase Dashboard: Settings > Database > Connection Pooling
  - Set Auth pooler to use a percentage (recommended: 10%) instead of fixed number
*/

-- 1. Drop unused index
DROP INDEX IF EXISTS idx_favorites_station_id;

-- 2. Drop insecure RLS policies
DROP POLICY IF EXISTS "Anyone can delete favorites for their device" ON favorites;
DROP POLICY IF EXISTS "Anyone can insert favorites" ON favorites;
DROP POLICY IF EXISTS "Anyone can read favorites for their device" ON favorites;

-- Since there's no authentication system, we'll disable RLS
-- This is more honest than having policies that give false security
ALTER TABLE favorites DISABLE ROW LEVEL SECURITY;

-- Note: For proper security, implement authentication:
-- 1. Enable Supabase Auth in your application
-- 2. Add a user_id column: ALTER TABLE favorites ADD COLUMN user_id uuid REFERENCES auth.users(id);
-- 3. Re-enable RLS: ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
-- 4. Create proper policies:
--    CREATE POLICY "Users can manage own favorites" ON favorites
--      FOR ALL TO authenticated
--      USING (auth.uid() = user_id)
--      WITH CHECK (auth.uid() = user_id);
