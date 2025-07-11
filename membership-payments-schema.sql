CREATE TABLE public.membership_payments (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    client_id BIGINT NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_month INT NOT NULL CHECK (payment_month >= 1 AND payment_month <= 12),
    payment_year INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Adding a unique constraint to prevent duplicate payments for the same client, month, and year.
CREATE UNIQUE INDEX membership_payments_client_month_year_idx ON public.membership_payments (client_id, payment_month, payment_year);

-- Enable RLS
ALTER TABLE public.membership_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage all payments"
ON public.membership_payments
FOR ALL
USING (
  public.get_user_role() = 'admin'
)
WITH CHECK (
  public.get_user_role() = 'admin'
); 