import { NextResponse } from 'next/server';
import { dataService } from '@/lib/data-service';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { count = 1, message, visitor_gh_user } = body;

    await dataService.addIncense(id, {
      visitor_gh_user: visitor_gh_user || "Anonymous",
      message: message || "一路走好",
      count
    });

    const tomb = await dataService.getTombById(id);

    return NextResponse.json({
      ok: true,
      totalIncense: tomb?.incense_count || 0,
      meritEarned: count
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || "invalid_request" }, { status: 400 });
  }
}
