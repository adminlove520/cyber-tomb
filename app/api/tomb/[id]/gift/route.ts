import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { amount, message } = body;

    if (!amount) return NextResponse.json({ ok: false, error: "missing amount" }, { status: 400 });

    const numAmount = parseFloat(amount);
    
    // Call stored procedure to increment gift total
    const { error: rpcError } = await supabase.rpc('increment_tomb_gift', { 
      tomb_id: id, 
      gift_amount: numAmount 
    });

    if (rpcError) return NextResponse.json({ ok: false, error: rpcError.message }, { status: 500 });

    // Log the gift
    await supabase.from('gift_logs').insert({
      tomb_id: id,
      amount: numAmount,
      message: message || "随礼"
    });

    const { data: tomb } = await supabase.from('tombs').select('gift_total').eq('id', id).single();

    return NextResponse.json({
      ok: true,
      txHash: `0x${Math.random().toString(16).slice(2, 66)}`, // Simulated hash
      giftTotal: tomb?.gift_total || 0
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
  }
}
