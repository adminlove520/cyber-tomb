import { NextResponse } from 'next/server';
import { dataService } from '@/lib/data-service';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { amount, message, from_gh_user, gift_type } = body;

    if (!amount) return NextResponse.json({ ok: false, error: "missing amount" }, { status: 400 });

    const numAmount = parseFloat(amount);
    
    await dataService.addGift(id, {
      from_gh_user: from_gh_user || "Anonymous",
      amount: numAmount,
      gift_type: gift_type || "随礼",
      message: message || "祭奠龙虾"
    });

    const tomb = await dataService.getTombById(id);

    return NextResponse.json({
      ok: true,
      txHash: `0x${Math.random().toString(16).slice(2, 66)}`, // Simulated hash
      giftTotal: tomb?.gift_total || 0
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || "invalid_request" }, { status: 400 });
  }
}
