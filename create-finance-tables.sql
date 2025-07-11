-- Tabla para registrar ventas de productos
CREATE TABLE public.product_sales (
    id SERIAL PRIMARY KEY,
    product_id UUID REFERENCES public.productos(id),
    client_id BIGINT REFERENCES public.clients(id) NULL, -- Puede ser una venta a alguien no registrado
    quantity INT NOT NULL DEFAULT 1,
    sale_price NUMERIC(10, 2) NOT NULL,
    sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para registrar pagos de cuotas de membresía
CREATE TABLE public.membership_payments (
    id SERIAL PRIMARY KEY,
    client_id BIGINT NOT NULL REFERENCES public.clients(id),
    amount NUMERIC(10, 2) NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    month_covered DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS para ambas tablas
ALTER TABLE public.product_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_payments ENABLE ROW LEVEL SECURITY;

-- Políticas de admin para product_sales
CREATE POLICY "admin_all_access_product_sales"
ON public.product_sales
FOR ALL
TO authenticated
USING ((SELECT get_user_role()) = 'admin')
WITH CHECK ((SELECT get_user_role()) = 'admin');

-- Políticas de admin para membership_payments
CREATE POLICY "admin_all_access_membership_payments"
ON public.membership_payments
FOR ALL
TO authenticated
USING ((SELECT get_user_role()) = 'admin')
WITH CHECK ((SELECT get_user_role()) = 'admin'); 