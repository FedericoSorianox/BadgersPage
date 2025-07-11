-- Script definitivo para los permisos de la tabla de productos.
-- Habilita RLS, limpia y reconstruye todas las políticas.

-- Paso 1: Habilitar Row Level Security en la tabla de productos.
-- Este es el paso crucial que faltaba. Si no está habilitado, las políticas no se aplican.
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;


-- Paso 2: Limpiar TODAS las políticas existentes para empezar de cero.
DROP POLICY IF EXISTS "Allow public read access" ON public.productos;
DROP POLICY IF EXISTS "Allow admins full access" ON public.productos;
DROP POLICY IF EXISTS "Allow admins to update products" ON public.productos;
DROP POLICY IF EXISTS "Allow admins to insert products" ON public.productos;
DROP POLICY IF EXISTS "Allow admins to delete products" ON public.productos;
DROP POLICY IF EXISTS "Allow admins full modification access" ON public.productos;


-- Paso 3: Crear las políticas correctas desde cero.

-- Política 1: Permitir que CUALQUIER persona (incluso no autenticada) vea los productos.
CREATE POLICY "Public can view all products"
ON public.productos
FOR SELECT
USING (true);


-- Política 2: Permitir que SOLO los administradores puedan crear, actualizar y borrar productos.
CREATE POLICY "Admins can modify all products"
ON public.productos
FOR ALL -- Aplica a INSERT, UPDATE, DELETE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid())); 