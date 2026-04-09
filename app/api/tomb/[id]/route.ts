import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data, error } = await supabase.from("tombs").select("*").eq("id", id).single();

  if (error || !data) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

  return NextResponse.json({
    ok: true,
    tomb: {
      id: data.id,
      name: data.lobster_name,
      cause: data.cause_of_death,
      epitaph: data.epitaph,
      incenseCount: data.incense_count,
      giftTotal: data.gift_total,
      createdAt: data.created_at
    }
  });
}
