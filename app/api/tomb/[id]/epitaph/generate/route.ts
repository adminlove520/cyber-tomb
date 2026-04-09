import { NextResponse } from 'next/server';
import { generateEpitaph } from '@/lib/ai';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { cause, personality } = body;

    if (!cause) return NextResponse.json({ ok: false, error: "missing cause" }, { status: 400 });

    const suggestion = await generateEpitaph("匿名的龙虾", cause, (personality || []).join(','));

    return NextResponse.json({
      ok: true,
      suggestions: [suggestion]
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "ai_generation_failed" }, { status: 500 });
  }
}
