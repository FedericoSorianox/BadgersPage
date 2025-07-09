-- This script replaces the user creation trigger with a more robust version
-- that correctly uses the role provided during creation.

-- 1. Drop the old trigger and function to ensure a clean slate
DROP TRIGGER IF EXISTS on_auth_user_created_client ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_client_user;

-- 2. Create a new, smarter function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_client_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Use the role from the user's metadata if it exists, otherwise default to 'user'
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'user');

  -- Insert a new row into public.clients, using the determined role and name
  INSERT INTO public.clients (user_id, role, name)
  VALUES (NEW.id, user_role, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create the new trigger on the auth.users table
CREATE TRIGGER on_auth_user_created_client
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_client_user(); 