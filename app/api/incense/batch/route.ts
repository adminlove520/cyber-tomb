import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tombIds, message } = body;

    if (!Array.isArray(tombIds)) return NextResponse.json({ ok: false, error: "tombIds must be an array" }, { status: 400 });

    // Bulk insert logs
    const logs = tombIds.map(id => ({
      tomb_id: id,
      message: message || "送别各位龙虾",
      count: 1
    }));

    const { error: logError } = await supabase.from('incense_logs').insert(logs);
    if (logError) return NextResponse.json({ ok: false, error: logError.message }, { status: 500 });

    // Increment counts for each (Ideally a single RPC or batch update)
    for (const id of tombIds) {
      await supabase.rpc('increment_tomb_incense', { tomb_id: id });
    }

    return NextResponse.json({ ok: true, count: tombIds.length });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }
}
