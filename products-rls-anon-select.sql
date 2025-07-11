-- Habilita RLS en la tabla de productos si no está habilitada
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

-- Permite el acceso de lectura pública a los productos que están marcados como visibles.
-- Esto es necesario para que la página de la tienda pública (/tienda) pueda mostrar productos.
CREATE POLICY "Allow public read access to visible products"
ON public.productos
FOR SELECT
TO anon
USING (is_visible = true); 