-- Crear el bucket 'avatars' para las fotos de perfil de los socios
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- Políticas de seguridad para el bucket 'avatars'
-- Permite acceso de lectura público para que las imágenes se puedan mostrar en la app
CREATE POLICY "Public read access for avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Permite a los administradores subir, actualizar o eliminar avatares
CREATE POLICY "Admin access for avatars"
ON storage.objects FOR ALL
USING ( (SELECT get_user_role()) = 'admin' )
WITH CHECK ( (SELECT get_user_role()) = 'admin' ); 