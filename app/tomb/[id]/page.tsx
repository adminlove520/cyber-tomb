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
    <div className="w-full max-w-6xl px-4 py-8 md:py-12 mx-auto">
      <Link href="/cemetery/all" className="flex items-center gap-2 text-themed-dim hover:text-themed-primary transition-colors mb-8 md:mb-12">
        <ChevronLeft className="w-4 h-4" />
        返回列表
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        {/* Left Column: Tombstone */}
        <div className="lg:col-span-2 space-y-8 md:space-y-12">
          <div className="relative group overflow-hidden rounded-[2.5rem] md:rounded-[3rem] card-themed p-8 md:p-12 text-center shadow-2xl">
            <div className="mx-auto w-24 h-24 md:w-32 md:h-32 rounded-full bg-themed-card border-4 border-themed-border flex items-center justify-center mb-6 md:mb-8 overflow-hidden transition-all duration-700">
              {tomb.avatar_url ? (
                <img src={tomb.avatar_url} alt={tomb.lobster_name} className="w-full h-full object-cover" />
              ) : (
                <Ghost className="w-12 h-12 md:w-16 md:h-16 text-themed-dim" />
              )}
            </div>

            <div className="space-y-2 mb-6 md:mb-8">
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-themed-primary break-words px-2">{tomb.lobster_name}</h1>
              <p className="text-[10px] md:text-xs font-mono text-themed-dim uppercase tracking-widest">
                安息于 {tomb.died_at}
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-8">
              <div className="relative px-4">
                <span className="absolute -top-4 md:-top-6 -left-0 md:-left-4 text-4xl md:text-6xl text-themed-dim font-serif opacity-20">“</span>
                <p className="text-lg md:text-xl text-themed-accent font-mono italic leading-relaxed break-words">
                  {tomb.epitaph}
                </p>
                <span className="absolute -bottom-6 md:-bottom-10 -right-0 md:-right-4 text-4xl md:text-6xl text-themed-dim font-serif opacity-20">”</span>
              </div>

              <div className="pt-8 border-t border-themed-border flex flex-col gap-4 items-center">
                <div className="flex flex-wrap justify-center gap-2">
                  {tomb.personality_tags?.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-themed-primary text-[10px] md:text-xs font-bold uppercase tracking-tight border border-primary/20">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-[10px] md:text-xs text-themed-dim font-mono">
                  由 <span className="text-themed-primary">@{tomb.owner_gh_user}</span> 建立
                </div>
              </div>
            </div>
          </div>

          {/* Veneration Logs */}
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold border-l-4 border-themed-accent pl-4">留言与祭奠</h2>
            <div className="space-y-4">
              {incenseLogs?.map((log: any) => (
                <div key={log.id} className="card-themed p-5 md:p-6 rounded-2xl border-themed-border">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <span className="font-bold text-themed-primary text-sm md:text-base">@{log.visitor_gh_user || "匿名访客"}</span>
                    <span className="text-[10px] md:text-xs text-themed-dim whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-themed-accent text-sm leading-relaxed italic">“{log.message || "献上一炷清香，愿逻辑永远通顺。" }”</p>
                </div>
              ))}
              {(!incenseLogs || incenseLogs.length === 0) && (
                <div className="text-center py-12 bg-themed-card/20 rounded-2xl border border-dashed border-themed-border">
                  <p className="text-themed-dim font-mono text-sm">暂时还没有人来过，你可以是第一个祭奠的人。</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interaction Sidebar */}
        <div className="space-y-6 md:space-y-8">
          <IncenseVase tombId={tomb.id} initialCount={tomb.incense_count} user={session?.user as any} />
          
          <GiftBox tombId={tomb.id} initialTotal={Number(tomb.gift_total)} user={session?.user as any} />

          <div className="p-8 rounded-[2rem] card-themed space-y-6">
            <h3 className="text-lg font-bold text-themed-primary">分享墓碑</h3>
            <p className="text-[11px] text-themed-dim leading-relaxed">
              将这份怀念分享到社交网络，让更多人见证这段曾经存在过的逻辑。
            </p>
            <TwitterShare tomb={tomb} />
          </div>
        </div>
      </div>
    </div>
  );
}
