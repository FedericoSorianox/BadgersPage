CREATE TABLE
  public.site_settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_site_settings_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp on row update
CREATE TRIGGER on_site_settings_update
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_site_settings_update();

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policies for site_settings
-- 1. Allow public read access
CREATE POLICY "Allow public read access" ON public.site_settings
  FOR SELECT USING (true);

-- 2. Allow admin full access
CREATE POLICY "Allow admin full access" ON public.site_settings
  FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Insert default values
INSERT INTO public.site_settings (key, value)
VALUES
  ('landing_background_url', '/gallery/1.jpg'),
  ('clases_background_url', '/gallery/2.jpg')
ON CONFLICT (key) DO NOTHING; 