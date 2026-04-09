"use client";

import { Share2 } from "lucide-react";

export function TwitterShare({ tomb }: { tomb: any }) {
  const handleShare = () => {
    const text = `🪦 我的龙虾【${tomb.lobster_name}】已经在【赛博墓场】入土为安了。\n\n死因：${tomb.cause_of_death}\n\n墓志铭：${tomb.epitaph?.slice(0, 50)}...\n\n愿 0 和 1 的世界没有 Bug。🦞✨\n\n#CyberTomb #赛博墓场`;
    const url = window.location.href;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    
    window.open(shareUrl, "_blank");
  };

  return (
    <button
      onClick={handleShare}
      className="w-full py-4 bg-zinc-100 text-black font-bold rounded-xl hover:bg-white transition-all flex items-center justify-center gap-3"
    >
      <Share2 className="w-5 h-5" />
      分享到 Twitter (X)
    </button>
  );
}
