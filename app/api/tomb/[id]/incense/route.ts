import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { count = 1, message } = body;

    // Call stored procedure to increment incense count
    const { error: rpcError } = await supabase.rpc('increment_tomb_incense', { tomb_id: id });
    if (rpcError) return NextResponse.json({ ok: false, error: rpcError.message }, { status: 500 });

    // Log the incense entry
    const { error: logError } = await supabase.from('incense_logs').insert({
      tomb_id: id,
      message: message || "一路走好",
      count
    });

    // Get updated count
    const { data: tomb } = await supabase.from('tombs').select('incense_count').eq('id', id).single();

    return NextResponse.json({
      ok: true,
      totalIncense: tomb?.incense_count || 0,
      meritEarned: count
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }
}
