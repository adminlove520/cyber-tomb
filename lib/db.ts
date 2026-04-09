import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient as createLibsqlClient } from '@libsql/client';

const DATABASE_TYPE = process.env.DATABASE_TYPE === 'supabase' ? 'supabase' : 'sqlite';

// Supabase Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// LibSQL Configuration (Local SQLite)
const libsqlUrl = process.env.LIBSQL_URL || 'file:cyber-tomb.db';
const libsqlToken = process.env.LIBSQL_AUTH_TOKEN || '';

const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);
const libsql = createLibsqlClient({
  url: libsqlUrl,
  ...(libsqlToken ? { authToken: libsqlToken } : {}),
});

export { DATABASE_TYPE, supabase, libsql };
