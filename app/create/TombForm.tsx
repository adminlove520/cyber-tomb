"use client";

import { useState } from "react";
import { createTomb, generateAIEpitaphAction } from "@/lib/actions";
import { Loader2, Sparkles } from "lucide-react";

const PERSONALITIES = [
  "内存臃肿过度",
  "被升级坑死",
  "沉默不语",
  "太爱说 No",
  "寿终正寝",
  "代码耦合至死"
];

export function TombForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [epitaph, setEpitaph] = useState("");
  const [formValues, setFormValues] = useState({
    name: "",
    cause: "",
    personality: PERSONALITIES[0],
    died_at: new Date().toISOString().split('T')[0],
  });

  const generateEpitaph = async () => {
    if (!formValues.name || !formValues.cause) {
      alert("请先填写龙虾名字和死因");
      return;
    }
    setGenerating(true);
    try {
      const result = await generateAIEpitaphAction(
        formValues.name,
        formValues.cause,
        formValues.personality
      );
      setEpitaph(result);
    } catch (e) {
      console.error(e);
      alert("AI 暂时罢工了，请稍后再试。");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <form action={createTomb} className="space-y-8">
      <div className="space-y-2">
        <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">龙虾名字</label>
        <input
          name="name"
          required
          placeholder="如：EasyUpdate 核心逻辑"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">性格/类型</label>
          <select
            name="personality"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
            onChange={(e) => setFormValues({ ...formValues, personality: e.target.value })}
          >
            {PERSONALITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">离去日期</label>
          <input
            name="died_at"
            type="date"
            defaultValue={formValues.died_at}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">具体死因</label>
        <textarea
          name="cause"
          required
          rows={3}
          placeholder="例如：在升级 OpenSSL 3.5.5 时，由于 GLIBC 版本冲突导致动态链接库崩溃。"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          onChange={(e) => setFormValues({ ...formValues, cause: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">墓志铭</label>
          <button
            type="button"
            onClick={generateEpitaph}
            disabled={generating}
            className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            AI 辅助撰写
          </button>
        </div>
        <textarea
          name="epitaph"
          required
          rows={4}
          value={epitaph}
          onChange={(e) => setEpitaph(e.target.value)}
          placeholder="让这段逻辑走得有尊严一点..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        onClick={() => setLoading(true)}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        立下墓碑 (Confirm Burial)
      </button>
    </form>
  );
}
