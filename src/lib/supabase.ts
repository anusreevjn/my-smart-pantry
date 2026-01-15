// Supabase client with fallback configuration
// This handles cases where environment variables may not be loaded
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://qkaalrkcdjjqsmeitlid.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrYWFscmtjZGpqcXNtZWl0bGlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzOTMxNzMsImV4cCI6MjA4Mzk2OTE3M30.OERTbB_leBqH-tY5nUKbd2_Y3vy8UVxjSg2El-1qRM0";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
