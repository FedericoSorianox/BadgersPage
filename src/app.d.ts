// src/app.d.ts
import { SupabaseClient, Session } from '@supabase/supabase-js';

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient;
      session: Session | null;
    }
    interface PageData {
      session: Session | null;
      profile: Profile | null;
      siteSettings: { [key: string]: string };
    }
  }
}

export {};