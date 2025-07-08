// src/app.d.ts
import type { SupabaseClient, Session } from '@supabase/supabase-js';

declare global {
  namespace App {
    interface Locals {
      supabaseClient: SupabaseClient;
      session: Session | null;
    }
  }
}

export {};