ALTER TABLE public.clients
ADD COLUMN ci TEXT,
ADD COLUMN phone TEXT,
ADD COLUMN birth_date DATE,
ADD COLUMN membership_type TEXT,
ADD COLUMN status TEXT DEFAULT 'Activo',
ADD COLUMN photo_url TEXT,
ADD COLUMN emergency_contact_name TEXT,
ADD COLUMN emergency_contact_phone TEXT,
ADD COLUMN illnesses TEXT,
ADD COLUMN comments TEXT; 