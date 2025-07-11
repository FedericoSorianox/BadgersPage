DROP FUNCTION IF EXISTS get_all_products_for_admin();

CREATE OR REPLACE FUNCTION get_all_products_for_admin()
RETURNS TABLE(
    id UUID,
    nombre TEXT,
    descripcion TEXT,
    precio NUMERIC,
    imagen TEXT,
    categoria TEXT,
    stock INTEGER,
    created_at TIMESTAMPTZ,
    is_visible BOOLEAN,
    costo NUMERIC
) AS $$
BEGIN
  IF get_user_role() = 'admin' THEN
    RETURN QUERY
    SELECT
        p.id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.imagen,
        p.categoria,
        p.stock,
        p.created_at,
        p.is_visible,
        p.cost
    FROM
        public.productos p;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 