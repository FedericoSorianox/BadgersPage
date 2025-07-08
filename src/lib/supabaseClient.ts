import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://hmohjwrwpuwmyecdxgon.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhtb2hqd3J3cHV3bXllY2R4Z29uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4ODYyMTMsImV4cCI6MjA2NDQ2MjIxM30.MBVkKFd4zfvXxfG_TH5QZTyUTRNeBCTXXFZrB3Q4fEc'
); 