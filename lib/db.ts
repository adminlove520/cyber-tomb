import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient as createLibsqlClient } from '@libsql/client';

const DATABASE_TYPE = (
  process.env.DATABASE_TYPE === 'supabase' || 
  (process.env.NEXT_PUBLIC_SUPABASE_URL && 
   process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
   process.env.NEXT_PUBLIC_SUPABASE_URL.trim() !== '')
) ? 'supabase' : 'sqlite';

let supabase: any;
let libsql: any;

if (DATABASE_TYPE === 'supabase') {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
  supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
} else {
  const libsqlUrl = process.env.LIBSQL_URL || 'file:cyber-tomb.db';
  const libsqlToken = process.env.LIBSQL_AUTH_TOKEN || '';
  libsql = createLibsqlClient({
    url: libsqlUrl,
    ...(libsqlToken ? { authToken: libsqlToken } : {}),
  });
}

export { DATABASE_TYPE, supabase, libsql };
