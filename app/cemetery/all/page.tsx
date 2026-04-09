import { dataService } from "@/lib/data-service";
import { TombCard } from "@/components/TombCard";
import Link from "next/link";
import { ChevronLeft, Skull } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AllCemeteryPage() {
  let tombs: any[] | null = null;
  let error: any = null;

  try {
    const result = await dataService.getTombs();
    tombs = result.data;
  } catch (e: any) {
    error = e;
  }

  if (error) {
    return <div className="text-red-500">无法连接到墓地数据库: {error.message}</div>;
  }

  return (
    <div className="w-full max-w-6xl px-4 py-8 md:py-12 mx-auto">
      <Link href="/" className="flex items-center gap-2 text-themed-dim hover:text-themed-primary transition-colors mb-8 md:mb-12">
        <ChevronLeft className="w-4 h-4" />
        返回首页
      </Link>

      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">赛博公墓</h1>
          <p className="text-themed-dim text-base md:text-lg max-w-xl">这里安息着无数因 Bug、性能瓶颈、人为失误、或被技术浪潮淘汰的代码逻辑。</p>
        </div>
        <Link 
          href="/create" 
          className="btn-primary-themed w-full md:w-auto"
        >
          为它们立碑
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {tombs?.map((tomb) => (
          <TombCard key={tomb.id} tomb={tomb} />
        ))}
        {tombs?.length === 0 && (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-themed-border rounded-3xl">
            <p className="text-themed-dim font-mono italic">墓地暂时空无一物... 难道所有逻辑都完美运行？</p>
          </div>
        )}
      </div>
    </div>
  );
}
