import { dataService } from "@/lib/data-service";
import { auth } from "@/auth";
import Link from "next/link";
import { ChevronLeft, Share2, Heart, Coins, Ghost } from "lucide-react";
import { IncenseVase } from "./IncenseVase";
import { GiftBox } from "./GiftBox";
import { TwitterShare } from "./TwitterShare";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const tomb = await dataService.getTombById(id).catch(() => null);

  if (!tomb) return { title: "赛博墓场 · Cyber Tomb" };

  return {
    title: `${tomb.lobster_name} · 赛博墓场`,
    description: `原因：${tomb.cause_of_death} | 墓志铭：${tomb.epitaph}`,
    openGraph: {
      title: `${tomb.lobster_name} 的电子墓碑`,
      description: `龙虾 ${tomb.lobster_name} 已于 ${tomb.died_at} 入土为安。`,
      images: [tomb.avatar_url || "/images/wooden-fish.svg"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tomb.lobster_name} · 赛博墓场`,
      description: tomb.epitaph,
      images: [tomb.avatar_url || "/images/wooden-fish.svg"],
    },
  };
}

export default async function TombDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const tomb = await dataService.getTombById(id).catch(() => null);

  if (!tomb) {
    notFound();
  }

  const { incenseLogs, giftLogs } = await dataService.getLogs(id);

  return (
    <div className="w-full max-w-5xl px-4 py-12">
      <Link href="/cemetery/all" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors mb-12">
        <ChevronLeft className="w-4 h-4" />
        返回墓园
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Tombstone */}
        <div className="lg:col-span-2 space-y-12">
          <div className="relative group overflow-hidden rounded-[3rem] bg-zinc-900 border-4 border-zinc-800 p-12 text-center shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50"></div>
            
            <div className="mx-auto w-32 h-32 rounded-full bg-zinc-800 border-4 border-zinc-700 flex items-center justify-center mb-8 overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
              {tomb.avatar_url ? (
                <img src={tomb.avatar_url} alt={tomb.lobster_name} className="w-full h-full object-cover" />
              ) : (
                <Ghost className="w-16 h-16 text-zinc-700" />
              )}
            </div>

            <div className="space-y-2 mb-8">
              <h1 className="text-5xl font-black tracking-tighter text-zinc-100">{tomb.lobster_name}</h1>
              <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                安息于 {tomb.died_at}
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-8">
              <div className="relative">
                <span className="absolute -top-6 -left-4 text-6xl text-zinc-800 font-serif">“</span>
                <p className="text-xl text-zinc-400 font-mono italic leading-relaxed">
                  {tomb.epitaph}
                </p>
                <span className="absolute -bottom-10 -right-4 text-6xl text-zinc-800 font-serif">”</span>
              </div>

              <div className="pt-8 border-t border-zinc-800/50 flex flex-col gap-4 items-center">
                <div className="flex gap-2">
                  {tomb.personality_tags?.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-500 text-xs font-bold uppercase tracking-tight">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-zinc-600 font-mono">
                  由 <span className="text-zinc-400">@{tomb.owner_gh_user}</span> 建立
                </div>
              </div>
            </div>
          </div>

          {/* Veneration Logs */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold border-l-4 border-yellow-500 pl-4">留言与祭奠</h2>
            <div className="space-y-4">
              {incenseLogs?.map((log: any) => (
                <div key={log.id} className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-zinc-300">@{log.visitor_gh_user || "匿名访客"}</span>
                    <span className="text-xs text-zinc-600">{new Date(log.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-zinc-400 text-sm">{log.message || "献上一炷清香，愿逻辑永远通顺。"}</p>
                </div>
              ))}
              {incenseLogs?.length === 0 && (
                <div className="text-center py-12 bg-zinc-900/20 rounded-2xl border border-dashed border-zinc-800">
                  <p className="text-zinc-700 font-mono">暂时还没有人来过，你可以是第一个祭奠的人。</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interaction Sidebar */}
        <div className="space-y-8">
          <IncenseVase tombId={tomb.id} initialCount={tomb.incense_count} user={session?.user as any} />
          
          <GiftBox tombId={tomb.id} initialTotal={Number(tomb.gift_total)} user={session?.user as any} />

          <div className="p-8 rounded-[2rem] bg-zinc-900 border border-zinc-800 space-y-6">
            <h3 className="text-lg font-bold">分享墓碑</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              将这份怀念分享到社交网络，让更多人见证这段曾经存在过的逻辑。
            </p>
            <TwitterShare tomb={tomb} />
          </div>
        </div>
      </div>
    </div>
  );
}
