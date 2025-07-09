-- Script de configuración para Supabase
-- Ejecuta este script en el SQL Editor de tu proyecto de Supabase

-- 1. Crear la tabla profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Crear políticas de seguridad
-- Política para lectura de perfiles propios
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Política para inserción de perfiles propios
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Política para actualización de perfiles propios
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 4. Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Crear trigger para actualizar updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 6. Crear función para insertar perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Crear trigger para insertar perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Crear un usuario administrador (reemplaza con tu email)
-- INSERT INTO profiles (id, email, role) 
-- VALUES ('tu-user-id-aqui', 'tu-email@ejemplo.com', 'admin')
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 9. Verificar la configuración
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'profiles'; 

-- 10. Crear la tabla productos
CREATE TABLE IF NOT EXISTS productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  imagen TEXT,
  categoria TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Habilitar RLS para productos
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- 12. Crear políticas para productos (lectura pública)
CREATE POLICY "Productos are viewable by everyone" ON productos
  FOR SELECT USING (true);

-- Nueva función para obtener el rol del usuario
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.clients WHERE user_id = auth.uid();
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12a. Política para que los administradores puedan insertar productos
CREATE POLICY "Admins can insert products" ON productos
  FOR INSERT WITH CHECK (get_user_role() = 'admin');

-- 12b. Política para que los administradores puedan actualizar productos
CREATE POLICY "Admins can update products" ON productos
  FOR UPDATE USING (get_user_role() = 'admin');

-- 12c. Política para que los administradores puedan eliminar productos
CREATE POLICY "Admins can delete products" ON productos
  FOR DELETE USING (get_user_role() = 'admin');

-- 13. Crear trigger para actualizar updated_at en productos
CREATE TRIGGER update_productos_updated_at 
  BEFORE UPDATE ON productos 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 14. Insertar algunos productos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, imagen, categoria, stock) VALUES
  ('Kimono Blanco', 'Kimono de Jiu Jitsu de alta calidad, color blanco', 89.99, '/products/kimono blanco.jpg', 'Kimonos', 10),
  ('Kimono Azul', 'Kimono de Jiu Jitsu de alta calidad, color azul', 89.99, '/products/kimono blanco.jpg', 'Kimonos', 8),
  ('Lycra BJJ', 'Lycra para Jiu Jitsu No-Gi, diseño moderno', 45.99, '/products/Lycra bjj.jpg', 'Lycras', 15),
  ('Lycra Muay Thai', 'Lycra para Muay Thai, cómoda y resistente', 39.99, '/products/lycra_muay_thai.jpg', 'Lycras', 12),
  ('Cinturones', 'Cinturones de Jiu Jitsu de diferentes colores', 15.99, '/products/cinturones.jpg', 'Accesorios', 20),
  ('Cabezal RDX', 'Cabezal de protección RDX para sparring', 25.99, '/products/cabezal rdx.png', 'Protección', 5),
  ('Coderas RDX', 'Coderas de protección RDX', 19.99, '/products/rdx coderas.jpg', 'Protección', 8),
  ('Bolso Deportivo', 'Bolso deportivo para llevar tu equipamiento', 35.99, '/products/bolso.jpg', 'Accesorios', 7),
  ('Barritas Energéticas', 'Barritas energéticas para recuperación', 2.99, '/products/barritas.jpg', 'Nutrición', 50),
  ('Power Ade', 'Bebida energética Power Ade', 1.99, '/products/power ade.png', 'Nutrición', 30)
ON CONFLICT (id) DO NOTHING; 

-- 15. Crear Políticas para el Bucket de Imágenes de Productos
-- Primero, asegurarse de que la función get_user_role existe
-- CREATE OR REPLACE FUNCTION get_user_role()... (ya debería existir)

-- Políticas para el bucket 'product-images'
CREATE POLICY "Public read for product images"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'product-images' );

CREATE POLICY "Admin insert for product images"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'product-images' AND get_user_role() = 'admin' );

CREATE POLICY "Admin update for product images"
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'product-images' AND get_user_role() = 'admin' );

CREATE POLICY "Admin delete for product images"
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'product-images' AND get_user_role() = 'admin' ); 