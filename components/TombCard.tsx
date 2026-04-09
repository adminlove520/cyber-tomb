"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Tomb } from "@/lib/types";
import { Ghost, MapPin, Calendar } from "lucide-react";

export function TombCard({ tomb }: { tomb: Tomb }) {
  return (
    <Link href={`/tomb/${tomb.id}`}>
      <motion.div
        whileHover={{ y: -5 }}
        className="group relative flex flex-col bg-zinc-900 border border-zinc-800 rounded-3xl p-6 transition-all hover:border-zinc-700 hover:bg-zinc-800/50"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700">
            {tomb.avatar_url ? (
              <img src={tomb.avatar_url} alt={tomb.lobster_name} className="w-full h-full object-cover" />
            ) : (
              <Ghost className="w-8 h-8 text-zinc-600" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">{tomb.lobster_name}</h3>
            <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1 uppercase tracking-widest font-mono">
              <Calendar className="w-3 h-3" />
              {tomb.died_at}
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div className="text-sm text-zinc-400 font-mono italic">
            "{tomb.epitaph?.slice(0, 80)}..."
          </div>
          <div className="flex flex-wrap gap-2">
            {tomb.personality_tags?.map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-zinc-800 flex justify-between items-center text-xs font-mono text-zinc-500">
          <div>
            由 <span className="text-zinc-300">@{tomb.owner_gh_user}</span> 建立
          </div>
          <div className="flex gap-4">
            <span>🔥 {tomb.incense_count}</span>
            <span>💰 {Number(tomb.gift_total).toFixed(2)}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
