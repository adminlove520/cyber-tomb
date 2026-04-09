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
        className="group relative flex flex-col card-themed rounded-3xl p-6 transition-all hover:bg-zinc-900/10"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-themed-card flex items-center justify-center overflow-hidden border border-themed-border">
            {tomb.avatar_url ? (
              <img src={tomb.avatar_url} alt={tomb.lobster_name} className="w-full h-full object-cover" />
            ) : (
              <Ghost className="w-8 h-8 text-themed-dim" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold group-hover:text-themed-accent transition-colors">{tomb.lobster_name}</h3>
            <div className="flex items-center gap-2 text-xs text-themed-dim mt-1 uppercase tracking-widest font-mono">
              <Calendar className="w-3 h-3" />
              {tomb.died_at}
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div className="text-sm text-themed-dim font-mono italic">
            "{tomb.epitaph?.slice(0, 80)}..."
          </div>
          <div className="flex flex-wrap gap-2">
            {tomb.personality_tags?.map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded-full bg-primary/10 text-themed-primary text-[10px] font-bold border border-primary/20">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-themed-border flex justify-between items-center text-xs font-mono text-themed-dim">
          <div>
            由 <span className="text-themed-primary">@{tomb.owner_gh_user}</span> 建立
          </div>
          <div className="flex gap-4">
            <span className="text-themed-accent">🔥 {tomb.incense_count}</span>
            <span className="text-themed-primary">💰 {Number(tomb.gift_total).toFixed(2)}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
