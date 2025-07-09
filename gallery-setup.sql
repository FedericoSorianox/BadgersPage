-- Create a table for public gallery items
CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID REFERENCES public.clients(user_id) NOT NULL,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  title TEXT
);

-- Enable RLS
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Policies for gallery table
CREATE POLICY "Allow public read access" ON gallery FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert" ON gallery FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow owner to delete" ON gallery FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Allow admin to delete" ON gallery FOR DELETE USING (EXISTS (
  SELECT 1 FROM clients WHERE clients.user_id = auth.uid() AND clients.role = 'admin'
));

-- Create a storage bucket for the gallery
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('gallery', 'gallery', true, 52428800, ARRAY['image/jpeg', 'image/png', 'video/mp4'])
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 52428800, allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'video/mp4'];


-- Policies for gallery storage bucket
-- Drop existing policies if they exist, to avoid conflicts
DROP POLICY IF EXISTS "Allow public read-only access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow owner to delete" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin to delete" ON storage.objects;

CREATE POLICY "Allow public read-only access" ON storage.objects FOR SELECT USING ( bucket_id = 'gallery' );
CREATE POLICY "Allow authenticated users to upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'gallery' );
CREATE POLICY "Allow owner to delete" ON storage.objects FOR DELETE USING ( bucket_id = 'gallery' AND owner = auth.uid() );
CREATE POLICY "Allow admin to delete" ON storage.objects FOR DELETE USING ( bucket_id = 'gallery' AND EXISTS (
  SELECT 1 FROM clients WHERE clients.user_id = auth.uid() AND clients.role = 'admin'
)); 