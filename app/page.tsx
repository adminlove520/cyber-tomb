"use client";

import WoodenFish from "@/components/WoodenFish";
import Link from "next/link";
import { Ghost, Skull, Plus, Terminal, Leaf, Scroll } from "lucide-react";
import { useTheme } from "@/components/ThemeContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Home() {
  const { theme } = useTheme();

  const getThemeContent = () => {
    switch(theme) {
      case 'zen':
        return {
          title: "禅意墓场",
          sub: "尘归尘，土归土，代码终入极乐园。",
          icon: <Leaf className="w-3 h-3 text-green-500" />,
          bgText: "ZEN"
        };
      case 'classic':
        return {
          title: "重厚墓场",
          sub: "昔者已逝，其志长存。载于卷轴，传于万世。",
          icon: <Scroll className="w-3 h-3 text-amber-500" />,
          bgText: "PAST"
        };
      default:
        return {
          title: "赛博墓场",
          sub: "Here lies a lobster. They lived, they coded, they were deleted.",
          icon: <Terminal className="w-3 h-3 text-blue-500" />,
          bgText: "CYBER"
        };
    }
  };

  const content = getThemeContent();

  return (
    <div className="flex flex-col items-center gap-12 md:gap-16 w-full max-w-5xl text-center py-12 md:py-24 px-4 overflow-hidden mx-auto">
      <div className="space-y-4 md:space-y-6 relative w-full">
        {/* Decorative Background Text */}
        <motion.div 
          key={`bg-1-${theme}`}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 0.1, x: 0 }}
          className="absolute -top-20 -left-20 text-[100px] md:text-[150px] font-black select-none pointer-events-none -z-10 rotate-12 hidden lg:block"
          style={{ color: 'hsl(var(--primary))' }}
        >
          {content.bgText}
        </motion.div>
        <motion.div 
          key={`bg-2-${theme}`}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 0.1, x: 0 }}
          className="absolute -bottom-20 -right-20 text-[100px] md:text-[150px] font-black select-none pointer-events-none -z-10 -rotate-6 hidden lg:block"
          style={{ color: 'hsl(var(--accent))' }}
        >
          TOMB
        </motion.div>

        <motion.h1 
          key={theme}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "text-5xl md:text-8xl font-black tracking-tighter drop-shadow-2xl transition-all duration-700 break-words px-4",
            theme === 'cyber' && "text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-white to-blue-600",
            theme === 'zen' && "text-stone-700 font-serif",
            theme === 'classic' && "text-amber-500 font-bold"
          )}
        >
          {content.title}
        </motion.h1>
        <motion.div 
          key={`sub-${theme}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 md:gap-4 text-themed-dim font-black uppercase tracking-[0.2em] md:tracking-[0.5em] text-[10px] md:text-xs px-6"
        >
          <div className="shrink-0">{content.icon}</div>
          <span className="line-clamp-2 md:line-clamp-none leading-relaxed">{content.sub}</span>
        </motion.div>
      </div>

      <WoodenFish />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full px-2 md:px-4">
        <Link 
          href="/cemetery/all" 
          className="group flex flex-col items-center p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] card-themed hover:bg-zinc-900/10 transition-all hover:scale-105 active:scale-95"
        >
          <div className="p-4 rounded-3xl bg-blue-500/10 mb-4 md:mb-6 group-hover:bg-blue-500/20 transition-all">
            <Skull className="w-8 h-8 md:w-10 md:h-10 text-themed-dim group-hover:text-blue-400" />
          </div>
          <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">全部墓碑</h3>
          <p className="text-[10px] text-themed-dim mt-2 font-mono tracking-widest uppercase italic font-bold">Inspect all souls</p>
        </Link>
        <Link 
          href="/create" 
          className="group flex flex-col items-center p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] card-themed hover:bg-zinc-900/10 transition-all hover:scale-105 active:scale-95 shadow-xl"
        >
          <div className="p-4 rounded-3xl bg-green-500/10 mb-4 md:mb-6 group-hover:bg-green-500/20 transition-all">
            <Plus className="w-8 h-8 md:w-10 md:h-10 text-themed-dim group-hover:text-green-400" />
          </div>
          <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">立碑</h3>
          <p className="text-[10px] text-themed-dim mt-2 font-mono tracking-widest uppercase italic font-bold">New Burial Entry</p>
        </Link>
        <Link 
          href="/cemetery/recent" 
          className="group flex flex-col items-center p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] card-themed hover:bg-zinc-900/10 transition-all hover:scale-105 active:scale-95"
        >
          <div className="p-4 rounded-3xl bg-purple-500/10 mb-4 md:mb-6 group-hover:bg-purple-500/20 transition-all">
            <Ghost className="w-8 h-8 md:w-10 md:h-10 text-themed-dim group-hover:text-purple-400" />
          </div>
          <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">最近新增</h3>
          <p className="text-[10px] text-themed-dim mt-2 font-mono tracking-widest uppercase italic font-bold">Recently Deceased</p>
        </Link>
      </div>

      <div className="mt-20 flex flex-col items-center gap-2">
         <p className="text-[10px] font-black text-themed-dim uppercase tracking-widest">Powered by Lobster-AI-Engine</p>
         <div className="w-12 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      </div>
    </div>
  );
}
