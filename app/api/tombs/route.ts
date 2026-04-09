import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');
  const sort = searchParams.get('sort') || 'recent';

  const query = supabase.from("tombs").select("*", { count: 'exact' });

  if (sort === 'recent') query.order('created_at', { ascending: false });
  else if (sort === 'incense') query.order('incense_count', { ascending: false });

  const { data, count, error } = await query.range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({
    ok: true,
    tombs: data,
    total: count,
    hasMore: (count || 0) > (offset + limit)
  });
}
