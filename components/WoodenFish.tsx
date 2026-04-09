"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { getMeritTextsAction, incrementMeritAction, getGlobalStatsAction } from "@/lib/actions";
import { Sparkles, Volume2, Music, Settings2, Palette } from "lucide-react";
import { useTheme } from "./ThemeContext";
import { THEMES, Theme } from "@/lib/theme";

interface MeritEvent {
  id: number;
  text: string;
}

export default function WoodenFish() {
  const { theme, setTheme } = useTheme();
  const [meritCount, setMeritCount] = useState(0);
  const [globalMerits, setGlobalMerits] = useState<number | null>(null);
  const [events, setEvents] = useState<MeritEvent[]>([]);
  const [isKnocking, setIsKnocking] = useState(false);
  const [meritTexts, setMeritTexts] = useState(["功德 +1", "Debug 成功", "内存释放", "逻辑通顺", "代码优雅", "Bug 消失"]);
  const [soundId, setSoundId] = useState<"1" | "2">("1");
  const [bgmEnabled, setBgmEnabled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const lastUpdateRef = useRef<number>(0);
  const knockAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize sounds and fetch data
  useEffect(() => {
    const savedCount = localStorage.getItem("merit_count");
    if (savedCount) setMeritCount(parseInt(savedCount, 10));

    const savedSound = localStorage.getItem("wooden_fish_sound") as "1" | "2";
    if (savedSound) setSoundId(savedSound);
    
    // Initialize Knock Audio
    knockAudioRef.current = new Audio(`/sounds/sound_${soundId}.mp3`);
    knockAudioRef.current.volume = 0.5;

    // Initialize BGM
    bgmAudioRef.current = new Audio("/sounds/bgm.mp3");
    bgmAudioRef.current.loop = true;
    bgmAudioRef.current.volume = 0.4;

    const fetchMeritTexts = async () => {
      try {
        const texts = await getMeritTextsAction();
        if (texts && texts.length > 0) setMeritTexts(texts);
      } catch (e) {
        console.warn("AI texts failed, using defaults", e);
      }
    };
    fetchMeritTexts();

    const fetchStats = async () => {
      try {
        const stats = await getGlobalStatsAction();
        if (stats && stats.total_merits !== undefined) {
          setGlobalMerits(Number(stats.total_merits));
        }
      } catch (e) {
        console.warn("Fetch stats failed", e);
      }
    };
    
    fetchStats();
    
    // Fallback polling for local SQLite (Realtime is Supabase-only)
    const pollInterval = setInterval(fetchStats, 5000);
    
    // Supabase Realtime (if configured)
    const channel = supabase
      .channel("global-stats")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "global_stats", filter: "key=eq.total_merits" }, (payload) => {
        setGlobalMerits(Number(payload.new.value));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
      bgmAudioRef.current?.pause();
    };
  }, []);

  // Update knock audio when soundId changes
  useEffect(() => {
    if (knockAudioRef.current) {
      knockAudioRef.current.src = `/sounds/sound_${soundId}.mp3`;
      localStorage.setItem("wooden_fish_sound", soundId);
    }
  }, [soundId]);
  
  // Handle BGM playback
  useEffect(() => {
    if (bgmEnabled) {
      bgmAudioRef.current?.play().catch(() => {
        console.warn("BGM auto-play blocked by browser. User interaction required.");
        setBgmEnabled(false);
      });
    } else {
      bgmAudioRef.current?.pause();
    }
  }, [bgmEnabled]);

  const knock = useCallback(async () => {
    setIsKnocking(true);
    const newCount = meritCount + 1;
    setMeritCount(newCount);
    localStorage.setItem("merit_count", newCount.toString());

    if (Date.now() - lastUpdateRef.current > 2000) {
      lastUpdateRef.current = Date.now();
      await incrementMeritAction(1);
    }

    if (knockAudioRef.current) {
      knockAudioRef.current.currentTime = 0;
      knockAudioRef.current.play().catch(e => console.warn("Sound play failed", e));
    }

    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(40);

    const id = Date.now();
    const randomText = meritTexts[Math.floor(Math.random() * meritTexts.length)];
    setEvents(prev => [...prev, { id, text: randomText }]);
    setTimeout(() => setEvents(prev => prev.filter(e => e.id !== id)), 1000);
    setTimeout(() => setIsKnocking(false), 100);
  }, [meritCount, meritTexts, soundId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        knock();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [knock]);

  return (
    <div className="flex flex-col items-center gap-8 select-none relative w-full max-w-xl transition-all duration-1000 p-8 rounded-[4rem] card-themed">
      {/* Merit Display */}
      <div className="flex flex-col items-center gap-2">
        <h2 className={cn(
          "text-5xl font-black italic tracking-tighter transition-all",
          theme === 'cyber' && "text-themed-primary drop-shadow-[0_0_10px_hsla(var(--primary),0.5)]",
          theme === 'zen' && "text-themed-dim font-serif",
          theme === 'classic' && "text-themed-accent"
        )}>
          个人功德: {meritCount.toLocaleString()}
        </h2>
        {globalMerits !== null && (
          <div className="text-sm font-mono text-themed-dim uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            全服累计功德: <span className="text-themed-primary">{globalMerits.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="relative group cursor-pointer" onClick={knock}>
        <AnimatePresence>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 1, y: 0, scale: 0.5 }}
              animate={{ opacity: 0, y: -200, scale: 2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className={cn(
                "absolute top-0 left-1/2 -translate-x-1/2 text-2xl font-black whitespace-nowrap pointer-events-none drop-shadow-xl z-50",
                theme === 'cyber' && "text-themed-accent font-mono",
                theme === 'zen' && "text-themed-dim font-serif",
                theme === 'classic' && "text-themed-primary font-bold"
              )}
            >
              {event.text}
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.div
          animate={isKnocking ? { scale: 0.85, rotate: -5 } : { scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 600, damping: 10 }}
          className={cn(
            "w-80 h-80 rounded-[5rem] flex items-center justify-center border-4 transition-all overflow-hidden relative shadow-2xl",
            theme === 'cyber' && "bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border-themed-border shadow-primary/10",
            theme === 'zen' && "bg-stone-200/10 border-stone-400/20 shadow-none",
            theme === 'classic' && "bg-gradient-to-tr from-amber-950 to-amber-900 border-amber-800"
          )}
        >
          {/* Subtle Glow Layer */}
          <div className={cn(
            "absolute inset-0 opacity-20",
            theme === 'cyber' && "bg-[radial-gradient(circle_at_center,_hsla(var(--primary),1)_0%,_transparent_70%)]",
            theme === 'zen' && "bg-stone-500/5",
            theme === 'classic' && "bg-amber-500/10"
          )} />
          
          <img 
            src="/images/wooden-fish.svg" 
            alt="Wooden Fish" 
            className={cn(
              "w-60 h-60 pointer-events-none transition-all group-hover:scale-110",
              theme === 'cyber' && "filter brightness-50 sepia(100%) hue-rotate(180deg) saturate(300%) opacity-70",
              theme === 'zen' && "filter grayscale brightness-75 opacity-60",
              theme === 'classic' && "filter brightness-75 sepia(100%) hue-rotate(0deg) saturate(200%)"
            )}
          />
        </motion.div>

        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] text-themed-dim font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-500">
          点击敲击 · Tap to Vibrate
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-4 mt-12 w-full">
        <div className="flex items-center gap-2 bg-themed-card p-1 rounded-full border border-themed-border backdrop-blur-xl">
          <button 
            onClick={() => setBgmEnabled(!bgmEnabled)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-full transition-all text-xs font-black uppercase tracking-widest",
              bgmEnabled 
                ? "bg-primary text-background shadow-lg shadow-primary/40" 
                : "text-themed-dim hover:text-themed-primary"
            )}
          >
            <Music className={cn("w-4 h-4", bgmEnabled && "animate-spin")} />
            {bgmEnabled ? "播放中 · 大悲咒" : "伴奏 · 大悲咒"}
          </button>
          
          <div className="w-[1px] h-6 bg-themed-border opacity-50"></div>
          
          <button 
            onClick={() => setSoundId(soundId === "1" ? "2" : "1")}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-themed-dim hover:text-themed-primary transition-all text-xs font-black uppercase tracking-widest"
          >
            <Volume2 className="w-4 h-4" />
            {soundId === "1" ? "木鱼声" : "钟鸣声"}
          </button>

          <div className="w-[1px] h-6 bg-themed-border opacity-50"></div>

          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={cn(
              "p-3 rounded-full transition-all",
              showSettings ? "bg-primary/20 text-themed-primary" : "text-themed-dim hover:text-themed-primary"
            )}
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>

        {/* Theme Switcher */}
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-2 bg-themed-card rounded-2xl border border-themed-border backdrop-blur-xl"
          >
            <Palette className="w-4 h-4 text-themed-dim ml-2" />
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                  theme === t.id ? "bg-primary text-background" : "text-themed-dim hover:text-themed-primary"
                )}
              >
                <span>{t.icon}</span>
                {t.name}
              </button>
            ))}
          </motion.div>
        )}
      </div>
      
      {meritCount >= 999 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-4 rounded-3xl bg-primary/10 border border-primary/20 text-themed-primary text-xs flex items-center gap-3"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="font-black uppercase tracking-widest flex items-center gap-2">
            功德圆满: <span className="text-foreground italic">已解锁 AI 深度超度权限</span>
          </span>
        </motion.div>
      )}
    </div>
  );
}
