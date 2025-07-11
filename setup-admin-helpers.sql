-- Script definitivo para configurar los permisos de administrador.

-- 1. Crear tabla para almacenar los IDs de los administradores
-- Se usa CREATE TABLE IF NOT EXISTS para que no falle si la tabla ya existe.
CREATE TABLE IF NOT EXISTS public.admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Paso 2 (antes Paso 0): Limpiar la política antigua que causaba el bucle infinito.
-- Ahora que la tabla seguro existe, podemos intentar borrar la política.
DROP POLICY IF EXISTS "Admins can view admins" ON public.admins;


-- 3. Crear la función is_admin
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Esta función, al ser SECURITY DEFINER, se ejecuta con los privilegios del creador (postgres)
  -- y puede leer la tabla `admins` sin que se le apliquen las políticas de RLS.
  RETURN EXISTS (
    SELECT 1
    FROM public.admins
    WHERE user_id = p_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Habilitar RLS en la tabla de admins.
-- Solo el superusuario (y funciones SECURITY DEFINER como is_admin) podrán leerla.
-- Esto es seguro y previene el bucle de políticas anterior.
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY; 