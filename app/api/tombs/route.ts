import { NextResponse } from 'next/server';
import { dataService } from '@/lib/data-service';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');
  const sort = searchParams.get('sort') || 'recent';

  try {
    const { data, count, hasMore } = await dataService.getTombs(limit, offset, sort);

    return NextResponse.json({
      ok: true,
      tombs: data,
      total: count,
      hasMore
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
