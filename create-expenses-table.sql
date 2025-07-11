-- enable RLS
CREATE TABLE public.expenses (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    concept TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    category TEXT,
    expense_date DATE NOT NULL
);

-- enable RLS
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- policy for admin access
CREATE POLICY "admin_all_access"
ON public.expenses
FOR ALL
TO authenticated
USING (
  (SELECT get_user_role()) = 'admin'
)
WITH CHECK (
  (SELECT get_user_role()) = 'admin'
); 