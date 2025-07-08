# BadgersPage - CRM Final

## Configuración del Proyecto

### 1. Variables de Entorno

Para que la autenticación funcione correctamente, necesitas configurar las variables de entorno de Supabase:

1. Crea un archivo `.env.local` en la raíz del proyecto
2. Agrega las siguientes variables:

```env
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
```

### 2. Configuración de Supabase

Asegúrate de que tu proyecto de Supabase tenga:

1. **Tabla `profiles`** con la siguiente estructura:
   ```sql
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     email TEXT,
     role TEXT DEFAULT 'user',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. **Políticas de seguridad** para la tabla `profiles`:
   ```sql
   -- Permitir lectura de perfiles propios
   CREATE POLICY "Users can view own profile" ON profiles
     FOR SELECT USING (auth.uid() = id);

   -- Permitir inserción de perfiles propios
   CREATE POLICY "Users can insert own profile" ON profiles
     FOR INSERT WITH CHECK (auth.uid() = id);

   -- Permitir actualización de perfiles propios
   CREATE POLICY "Users can update own profile" ON profiles
     FOR UPDATE USING (auth.uid() = id);
   ```

### 3. Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

### 4. Páginas de Debug

El proyecto incluye páginas de debug para ayudar con la configuración:

- `/env-check` - Verifica las variables de entorno y conexión a Supabase
- `/debug` - Muestra el estado de autenticación y perfil del usuario

### 5. Solución de Problemas

#### Error: "Cannot find module './$types.js'"
Este error indica que SvelteKit no ha generado los tipos. Ejecuta:
```bash
npm run dev
```

#### Error: "Variables de entorno de Supabase no configuradas"
Asegúrate de que el archivo `.env.local` existe y tiene las variables correctas.

#### Redirección a login desde /admin
1. Verifica que estás logueado correctamente
2. Verifica que tu usuario tiene el rol 'admin' en la tabla `profiles`
3. Usa la página `/debug` para verificar el estado de autenticación

### 6. Estructura del Proyecto

```
src/
├── routes/
│   ├── admin/          # Panel de administrador (requiere rol 'admin')
│   ├── login/          # Página de login
│   ├── debug/          # Página de debug
│   └── env-check/      # Verificación de configuración
├── lib/
│   ├── supabaseClient.ts  # Cliente de Supabase
│   └── db-check.ts        # Utilidades para verificar BD
└── hooks.server.ts        # Configuración del servidor
```

### 7. Roles de Usuario

- `user` - Usuario normal
- `admin` - Administrador (acceso a `/admin`)

Para cambiar el rol de un usuario, actualiza la tabla `profiles` en Supabase:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'tu-email@ejemplo.com';
``` 