-- Drop the existing foreign key constraint on the clients table
ALTER TABLE public.clients
DROP CONSTRAINT IF EXISTS clients_user_id_fkey;

-- Re-add the foreign key constraint with ON DELETE CASCADE
-- This ensures that when a user is deleted from auth.users, their corresponding client record is also deleted.
ALTER TABLE public.clients
ADD CONSTRAINT clients_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE; 