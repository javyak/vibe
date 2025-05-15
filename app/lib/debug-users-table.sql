-- This SQL script is for debugging Supabase user table issues
-- You can run this in the Supabase SQL Editor to verify table structure
-- and troubleshoot data insertion problems

-- Check if users table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'users'
) AS users_table_exists;

-- Show table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- Check if any rows exist in users table
SELECT COUNT(*) as user_count FROM users;

-- Check RLS policies
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'users';

-- Create test user (only run this if needed for testing)
-- INSERT INTO users (id, email, name, image)
-- VALUES ('00000000-0000-0000-0000-000000000001', 'test@example.com', 'Test User', NULL);

-- If you previously ran the insert, verify the test user exists
-- SELECT * FROM users WHERE email = 'test@example.com';
