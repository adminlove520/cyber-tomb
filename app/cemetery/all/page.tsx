import { dataService } from "@/lib/data-service";
import { TombCard } from "@/components/TombCard";
import Link from "next/link";
import { ChevronLeft, Skull } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AllCemeteryPage() {
  const { data: tombs, error } = await dataService.getTombs().catch(e => ({ data: null, error: e }));

  if (error) {
    return <div className="text-red-500">无法连接到墓地数据库: {error.message}</div>;
  }

  return (
    <div className="w-full max-w-6xl px-4 py-12">
      <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors mb-12">
        <ChevronLeft className="w-4 h-4" />
        返回首页
      </Link>

      <div className="flex justify-between items-end mb-12">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold tracking-tight">赛博公墓</h1>
          <p className="text-zinc-500 text-lg max-w-xl">这里安息着无数因 Bug、性能瓶颈、人为失误、或被技术浪潮淘汰的代码逻辑。</p>
        </div>
        <Link 
          href="/create" 
          className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all"
        >
          为它们立碑
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tombs?.map((tomb) => (
          <TombCard key={tomb.id} tomb={tomb} />
        ))}
        {tombs?.length === 0 && (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
            <p className="text-zinc-600 font-mono italic">墓地暂时空无一物... 难道所有逻辑都完美运行？</p>
          </div>
        )}
      </div>
    </div>
  );
}
