-- This script enables Row Level Security (RLS) for the 'clients' table
-- and adds policies to protect user data.

-- 1. Enable RLS on the 'clients' table
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- 2. Create a policy to allow users to view their own data
CREATE POLICY "Users can view their own client data"
ON public.clients FOR SELECT
USING (auth.uid() = user_id);

-- 3. Create a policy to allow admins to view all client data
CREATE POLICY "Admins can view all client data"
ON public.clients FOR SELECT
USING (
  (SELECT role FROM public.clients WHERE user_id = auth.uid()) = 'admin'
);

-- 4. Create a policy to allow users to update their own data
-- Note: This assumes you might want this functionality later.
CREATE POLICY "Users can update their own client data"
ON public.clients FOR UPDATE
USING (auth.uid() = user_id);

-- 5. Create a policy to allow admins to update any data
CREATE POLICY "Admins can update any client data"
ON public.clients FOR UPDATE
USING (
  (SELECT role FROM public.clients WHERE user_id = auth.uid()) = 'admin'
); 