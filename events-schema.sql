-- Tabla para almacenar los eventos del calendario
CREATE TABLE
  public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    title TEXT NOT NULL,
    event_date DATE NOT NULL,
    description TEXT,
    image_url TEXT -- Nueva columna para la imagen
  );

-- Habilitar RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Permitir acceso de lectura a todos
CREATE POLICY "Enable read access for all users" ON public.events FOR
SELECT
  USING (true);

-- Permitir a los administradores insertar eventos
CREATE POLICY "Enable insert for admins" ON public.events FOR INSERT
WITH
  CHECK (
    (
      SELECT
        role
      FROM
        public.clients
      WHERE
        user_id = auth.uid ()
    ) = 'admin'
  );

-- Permitir a los administradores actualizar eventos
CREATE POLICY "Enable update for admins" ON public.events FOR
UPDATE
  USING (
    (
      SELECT
        role
      FROM
        public.clients
      WHERE
        user_id = auth.uid ()
    ) = 'admin'
  );

-- Permitir a los administradores eliminar eventos
CREATE POLICY "Enable delete for admins" ON public.events FOR DELETE USING (
  (
    SELECT
      role
    FROM
      public.clients
    WHERE
      user_id = auth.uid ()
  ) = 'admin'
);

-- Insertar un par de eventos de ejemplo con image_url nulo
INSERT INTO
  public.events (title, event_date, description, image_url)
VALUES
  (
    'Seminario de Defensa Personal',
    CURRENT_DATE + INTERVAL '10 days',
    'Seminario intensivo de 3 horas enfocado en técnicas de defensa personal para situaciones reales.',
    NULL
  ),
  (
    'Competencia Interna de Jiu Jitsu',
    CURRENT_DATE + INTERVAL '30 days',
    '¡Demuestra tus habilidades en nuestra competencia amistosa interna! Habrá premios para los ganadores.',
    NULL
  ); 