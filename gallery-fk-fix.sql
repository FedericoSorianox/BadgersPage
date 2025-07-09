-- This script updates the foreign key for the gallery table to correctly link to the clients table.

-- 1. Drop the old foreign key constraint (if it exists under this name)
ALTER TABLE public.gallery DROP CONSTRAINT IF EXISTS gallery_user_id_fkey;

-- 2. Add a new foreign key constraint that links directly to public.clients
-- This assumes your 'clients' table has a 'user_id' column that is a primary key or has a unique constraint.
ALTER TABLE public.gallery 
ADD CONSTRAINT gallery_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.clients(user_id); 