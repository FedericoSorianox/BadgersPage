-- Tabla para almacenar las disciplinas
CREATE TABLE
  public.disciplines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT
  );

-- Habilitar RLS para la tabla de disciplinas
ALTER TABLE public.disciplines ENABLE ROW LEVEL SECURITY;

-- Permitir acceso de lectura a todos los usuarios
CREATE POLICY "Enable read access for all users" ON public.disciplines FOR
SELECT
  USING (true);

-- Permitir inserción, actualización y eliminación solo para administradores
CREATE POLICY "Enable insert for admins" ON public.disciplines FOR INSERT
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

CREATE POLICY "Enable update for admins" ON public.disciplines FOR
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

CREATE POLICY "Enable delete for admins" ON public.disciplines FOR DELETE USING (
  (
    SELECT
      role
    FROM
      public.clients
    WHERE
      user_id = auth.uid ()
  ) = 'admin'
);

-- Tabla para almacenar el horario de clases
CREATE TABLE
  public.schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    time_slot TEXT NOT NULL,
    monday TEXT,
    tuesday TEXT,
    wednesday TEXT,
    thursday TEXT,
    friday TEXT,
    saturday TEXT
  );

-- Habilitar RLS para la tabla de horarios
ALTER TABLE public.schedule ENABLE ROW LEVEL SECURITY;

-- Permitir acceso de lectura a todos los usuarios
CREATE POLICY "Enable read access for all users" ON public.schedule FOR
SELECT
  USING (true);

-- Permitir inserción, actualización y eliminación solo para administradores
CREATE POLICY "Enable insert for admins" ON public.schedule FOR INSERT
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

CREATE POLICY "Enable update for admins" ON public.schedule FOR
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

CREATE POLICY "Enable delete for admins" ON public.schedule FOR DELETE USING (
  (
    SELECT
      role
    FROM
      public.clients
    WHERE
      user_id = auth.uid ()
  ) = 'admin'
);

-- Insertar datos iniciales de las disciplinas (basado en el código hardcoded)
INSERT INTO
  public.disciplines (name, description, image_url)
VALUES
  (
    'Jiu Jitsu con GI',
    'Clases de Jiu Jitsu con el uniforme tradicional (Gi). Aprende técnicas de agarre, derribos y sumisiones. Todos los niveles desde principiantes hasta avanzados.',
    NULL
  ),
  (
    'Muay Thai',
    'El arte marcial mas completo de combate de pie. Las clases estan diseñadas para todos los niveles, desde principiantes hasta avanzados. Entrenamos y estudiamos a detalle el arte del combate.',
    NULL
  ),
  (
    'Jiu Jitsu No Gi',
    'No necesitas el Gi para estas clases. Enfocadas en técnicas de agarre y sumisiones sin el uniforme tradicional. Ideal para quienes buscan una experiencia más dinámica y rápida.',
    NULL
  );

-- Insertar datos iniciales del horario (basado en el código hardcoded)
INSERT INTO
  public.schedule (
    time_slot,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday
  )
VALUES
  (
    '07:30 - 08:30',
    'Muay thai',
    'Jiu Jitsu GI',
    'Muay Thai',
    'Jiu Jitsu GI',
    '',
    'Open Mat 10.30 AM'
  ),
  (
    '11:30 - 12:30',
    'Jiu Jitsu GI',
    '',
    'Jiu Jitsu GI',
    '',
    '',
    ''
  ),
  (
    '19:00 - 20:00',
    'Muay Thai',
    'Jiu Jitsu No GI',
    'Muay Thai',
    'Jiu Jitsu No Gi',
    'Libre/Repaso Muay Thai',
    ''
  ),
  (
    '20:00 - 21:00',
    'Jiu Jitsu GI',
    'Muay Thai',
    'Jiu Jitsu No Gi',
    'Muay Thai',
    'Libre/Repaso Jiu Jitsu',
    ''
  ); 