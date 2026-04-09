"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addIncenseAction } from "@/lib/actions";
import { Loader2, Flame, Send } from "lucide-react";

export function IncenseVase({ tombId, initialCount, user }: { tombId: string, initialCount: number, user?: any }) {
  const [count, setCount] = useState(initialCount);
  const [isBurning, setIsBurning] = useState(false);
  const [incenseLevel, setIncenseLevel] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeParticles, setActiveParticles] = useState<number[]>([]);

  const addIncense = async () => {
    if (submitting) return;
    setSubmitting(true);
    setIsBurning(true);
    
    // Add smoke particle
    const pid = Date.now();
    setActiveParticles(prev => [...prev, pid]);
    setTimeout(() => setActiveParticles(prev => prev.filter((p: number) => p !== pid)), 4000);

    try {
      await addIncenseAction(tombId, {
        visitor_gh_user: user?.username || user?.name || null,
        message: message || "献上一炷清香，愿逻辑永远通顺。",
        count: 1
      });
      setCount(prev => prev + 1);
      setIncenseLevel(prev => (prev + 1) % 10);
      setMessage("");
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsBurning(false), 3000);
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 rounded-[3rem] bg-zinc-900 border border-zinc-800 space-y-8 overflow-hidden relative group shadow-xl">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black italic tracking-tighter text-zinc-100 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500 fill-orange-500/20" />
          上香 Veneration
        </h3>
        <span className="font-mono text-orange-500 font-bold bg-orange-500/10 px-3 py-1 rounded-full text-xs">
          🔥 {count}
        </span>
      </div>

      <div className="relative h-48 flex flex-col items-center justify-end group cursor-pointer" onClick={addIncense}>
        <AnimatePresence mode="popLayout">
          {activeParticles.map((pid: number) => (
            <motion.div
              key={pid}
              initial={{ opacity: 0, y: 0, x: 0, scale: 0.5, filter: "blur(5px)" }}
              animate={{ opacity: [0, 1, 0.8, 0], y: -200, x: [0, 20, -20, 10], scale: [0.5, 2, 4], filter: "blur(15px)" }}
              transition={{ duration: 4, ease: "easeOut" }}
              className="absolute bottom-12 w-6 h-6 bg-zinc-300/20 rounded-full"
            />
          ))}
        </AnimatePresence>

        {/* Incense Burner Bowl */}
        <div className="relative w-40 h-24 bg-zinc-950 rounded-b-[2rem] rounded-t-sm border-x border-b border-zinc-800 shadow-[inset_0_-10px_30px_rgba(255,100,0,0.05)] flex items-center justify-center">
          <div className="absolute top-0 left-0 w-full h-3 bg-zinc-900/80 rounded-t-sm shadow-sm" />
          
          <div className="flex gap-2 items-end h-full pb-2">
             {/* Render incense sticks */}
             {[...Array(Math.min(count, 7))].map((_: any, i: number) => (
               <motion.div 
                 key={i}
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: 60 - i * 4, opacity: 1 }}
                 className="w-1 bg-yellow-900 rounded-full border-t-2 border-orange-500/80 shadow-[0_0_10px_rgba(255,100,0,0.5)]"
               />
             ))}
          </div>
        </div>

        <div className="mt-4 text-[10px] text-zinc-600 font-mono group-hover:text-zinc-400 transition-colors tracking-widest uppercase">
          {submitting ? "供奉中..." : "点击献上一炷清香"}
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          placeholder="留下一句祷告，愿它在 0 与 1 的海洋中得到永恒的稳定。"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-black/50 border border-zinc-800 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all resize-none font-mono"
        />
        <button
          onClick={addIncense}
          disabled={submitting}
          className="w-full py-4 bg-zinc-100 text-black font-black rounded-2xl hover:bg-white transition-all text-sm flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
        >
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          立即祭扫 (Respect Protocol)
        </button>
      </div>
    </div>
  );
}
