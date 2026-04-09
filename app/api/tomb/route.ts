import { NextResponse } from 'next/server';
import { dataService } from '@/lib/data-service';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const { name, cause, epitaph, personality } = body;

    if (!name) return NextResponse.json({ ok: false, error: "invalid_request: missing field 'name'" }, { status: 400 });
    if (!cause) return NextResponse.json({ ok: false, error: "invalid_request: missing field 'cause'" }, { status: 400 });

    const data = await dataService.createTomb({
      owner_gh_user: (session?.user as any)?.username || session?.user?.name || "Anonymous-Lobster",
      lobster_name: name,
      cause_of_death: cause,
      personality_tags: personality || [],
      epitaph: epitaph || "愿天堂没有内存泄漏",
      died_at: new Date().toISOString().split('T')[0]
    });

    return NextResponse.json({
      ok: true,
      id: data.id,
      url: `/tomb/${data.id}`
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || "internal_server_error" }, { status: 500 });
  }
}
