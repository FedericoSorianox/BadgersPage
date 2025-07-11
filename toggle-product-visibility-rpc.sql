-- Función RPC para cambiar la visibilidad de un producto, con chequeo de admin explícito.
-- Este método es más seguro y robusto que depender únicamente de políticas RLS para actualizaciones complejas.

CREATE OR REPLACE FUNCTION toggle_product_visibility(current_visibility BOOLEAN, product_id_to_update UUID)
RETURNS VOID AS $$
BEGIN
  -- 1. Verificar si el usuario que llama a esta función es administrador.
  -- Si no lo es, la función lanzará un error y se detendrá inmediatamente.
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Permiso denegado. Solo los administradores pueden realizar esta acción.';
  END IF;

  -- 2. Si el usuario es administrador, proceder con la actualización.
  -- La función se ejecuta con los permisos del creador, por lo que puede modificar la tabla
  -- sin que las políticas de UPDATE de RLS interfieran.
  UPDATE public.productos
  SET is_visible = NOT current_visibility
  WHERE id = product_id_to_update;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 