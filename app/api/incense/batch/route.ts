import { NextResponse } from 'next/server';
import { dataService } from '@/lib/data-service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tombIds, message, visitor_gh_user } = body;

    if (!Array.isArray(tombIds)) return NextResponse.json({ ok: false, error: "tombIds must be an array" }, { status: 400 });

    for (const id of tombIds) {
      await dataService.addIncense(id, {
        visitor_gh_user: visitor_gh_user || "Anonymous",
        message: message || "送别各位龙虾",
        count: 1
      });
    }

    return NextResponse.json({ ok: true, count: tombIds.length });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || "invalid_request" }, { status: 400 });
  }
}
