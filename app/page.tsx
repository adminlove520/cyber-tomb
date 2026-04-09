import WoodenFish from "@/components/WoodenFish";
import Link from "next/link";
import { Ghost, Skull, Plus, Terminal } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-16 w-full max-w-5xl text-center py-24">
      <div className="space-y-6 relative">
        {/* Decorative Background Text */}
        <div className="absolute -top-20 -left-20 text-[120px] font-black text-zinc-900/40 select-none pointer-events-none -z-10 rotate-12">
          CYBER
        </div>
        <div className="absolute -bottom-20 -right-20 text-[120px] font-black text-zinc-900/40 select-none pointer-events-none -z-10 -rotate-6">
          TOMB
        </div>

        <h1 className="text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-white to-blue-600 drop-shadow-2xl">
          赛博墓场
        </h1>
        <div className="flex items-center justify-center gap-4 text-zinc-500 font-black uppercase tracking-[0.5em] text-xs">
          <Terminal className="w-3 h-3" />
          Here lies a lobster. They lived, they coded, they were deleted.
        </div>
      </div>

      <WoodenFish />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full px-4">
        <Link 
          href="/cemetery/all" 
          className="group flex flex-col items-center p-10 rounded-[3rem] bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 transition-all hover:scale-105 active:scale-95"
        >
          <div className="p-4 rounded-3xl bg-blue-500/10 mb-6 group-hover:bg-blue-500/20 transition-all">
            <Skull className="w-10 h-10 text-zinc-400 group-hover:text-blue-400" />
          </div>
          <h3 className="text-2xl font-black uppercase italic tracking-tighter">全部墓碑</h3>
          <p className="text-[10px] text-zinc-600 mt-2 font-mono tracking-widest uppercase italic font-bold">Inspect all souls</p>
        </Link>
        <Link 
          href="/create" 
          className="group flex flex-col items-center p-10 rounded-[3rem] bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/5"
        >
          <div className="p-4 rounded-3xl bg-green-500/10 mb-6 group-hover:bg-green-500/20 transition-all">
            <Plus className="w-10 h-10 text-zinc-400 group-hover:text-green-400" />
          </div>
          <h3 className="text-2xl font-black uppercase italic tracking-tighter">立碑</h3>
          <p className="text-[10px] text-zinc-600 mt-2 font-mono tracking-widest uppercase italic font-bold">New Burial Entry</p>
        </Link>
        <Link 
          href="/cemetery/recent" 
          className="group flex flex-col items-center p-10 rounded-[3rem] bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 transition-all hover:scale-105 active:scale-95"
        >
          <div className="p-4 rounded-3xl bg-purple-500/10 mb-6 group-hover:bg-purple-500/20 transition-all">
            <Ghost className="w-10 h-10 text-zinc-400 group-hover:text-purple-400" />
          </div>
          <h3 className="text-2xl font-black uppercase italic tracking-tighter">最近新增</h3>
          <p className="text-[10px] text-zinc-600 mt-2 font-mono tracking-widest uppercase italic font-bold">Recently Deceased</p>
        </Link>
      </div>

      <div className="mt-20 flex flex-col items-center gap-2">
         <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Powered by Lobster-AI-Engine</p>
         <div className="w-12 h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
      </div>
    </div>
  );
}
