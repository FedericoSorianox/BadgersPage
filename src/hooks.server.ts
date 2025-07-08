import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';

export const handle = async ({ event, resolve }) => {
  event.locals.supabaseClient = createSupabaseServerClient({
    supabaseUrl: 'https://hmohjwrwpuwmyecdxgon.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhtb2hqd3J3cHV3bXllY2R4Z29uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4ODYyMTMsImV4cCI6MjA2NDQ2MjIxM30.MBVkKFd4zfvXxfG_TH5QZTyUTRNeBCTXXFZrB3Q4fEc', // NO la service key, solo la anon key pública
    event
  });

  const { data: { session } } = await event.locals.supabaseClient.auth.getSession();
  event.locals.session = session;

  return resolve(event);
};