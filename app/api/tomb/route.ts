import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const { name, cause, epitaph, personality } = body;

    if (!name) return NextResponse.json({ ok: false, error: "invalid_request: missing field 'name'" }, { status: 400 });
    if (!cause) return NextResponse.json({ ok: false, error: "invalid_request: missing field 'cause'" }, { status: 400 });

    const { data, error } = await supabase.from("tombs").insert({
      owner_gh_user: session?.user?.name || "Anonymous-Lobster",
      lobster_name: name,
      cause_of_death: cause,
      personality_tags: personality || [],
      epitaph: epitaph || "愿天堂没有内存泄漏",
      died_at: new Date().toISOString().split('T')[0]
    }).select().single();

    if (error) return NextResponse.json({ ok: false, error: `database_error: ${error.message}` }, { status: 500 });

    return NextResponse.json({
      ok: true,
      id: data.id,
      url: `/tomb/${data.id}`
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "internal_server_error" }, { status: 500 });
  }
}
