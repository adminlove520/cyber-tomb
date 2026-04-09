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
    <form action={createTomb} className="space-y-6 md:space-y-8 card-themed p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] w-full max-w-2xl mx-auto">
      <div className="space-y-2 text-left">
        <label className="text-xs md:text-sm font-bold text-themed-dim uppercase tracking-widest">龙虾名字</label>
        <input
          name="name"
          required
          placeholder="如：EasyUpdate 核心逻辑"
          className="input-themed"
          onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 text-left">
          <label className="text-xs md:text-sm font-bold text-themed-dim uppercase tracking-widest">性格/类型</label>
          <div className="relative">
            <select
              name="personality"
              className="input-themed appearance-none cursor-pointer pr-10"
              onChange={(e) => setFormValues({ ...formValues, personality: e.target.value })}
            >
              {PERSONALITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-themed-dim">
              ▼
            </div>
          </div>
        </div>
        <div className="space-y-2 text-left">
          <label className="text-xs md:text-sm font-bold text-themed-dim uppercase tracking-widest">离去日期</label>
          <input
            name="died_at"
            type="date"
            defaultValue={formValues.died_at}
            className="input-themed"
          />
        </div>
      </div>

      <div className="space-y-2 text-left">
        <label className="text-xs md:text-sm font-bold text-themed-dim uppercase tracking-widest">具体死因</label>
        <textarea
          name="cause"
          required
          rows={3}
          placeholder="例如：在升级 OpenSSL 3.5.5 时，由于 GLIBC 版本冲突导致动态链接库崩溃。"
          className="input-themed"
          onChange={(e) => setFormValues({ ...formValues, cause: e.target.value })}
        />
      </div>

      <div className="space-y-2 text-left">
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs md:text-sm font-bold text-themed-dim uppercase tracking-widest">墓志铭</label>
          <button
            type="button"
            onClick={generateEpitaph}
            disabled={generating}
            className="flex items-center gap-1.5 text-[10px] md:text-xs text-themed-accent hover:brightness-125 transition-all disabled:opacity-50"
          >
            {generating ? <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />}
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
          className="input-themed"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        onClick={() => setLoading(true)}
        className="w-full btn-primary-themed py-4 md:py-5 text-sm md:text-base mt-4"
      >
        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        立下墓碑 (Confirm Burial)
      </button>
    </form>
  );
}
