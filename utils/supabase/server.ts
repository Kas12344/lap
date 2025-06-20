
// utils/supabase/server.ts
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { type Database } from '@/types/supabase'; // Optional: only if you're using types

export function createClient() {
  return createServerComponentClient<Database>({ cookies });
}
