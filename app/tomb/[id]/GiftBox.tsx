"use client";

import { useState } from "react";
import { addGiftAction } from "@/lib/actions";
import { Coins, Loader2, Wallet, CheckCircle, ArrowRightLeft, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const GIFT_PACKAGES = [
  { id: '1', name: "一炷香", amount: 0.01, icon: "🕯️" },
  { id: '2', name: "三炷香", amount: 0.03, icon: "✨" },
  { id: '3', name: "花圈", amount: 0.10, icon: "🪷" },
  { id: '4', name: "棺木", amount: 0.50, icon: "⚰️" },
  { id: '5', name: "电子挽联", amount: 1.00, icon: "📜" },
  { id: '6', name: "超级功德箱", amount: 5.00, icon: "💎" },
];

export function GiftBox({ tombId, initialTotal, user }: { tombId: string, initialTotal: number, user?: any }) {
  const [total, setTotal] = useState(initialTotal);
  const [step, setStep] = useState<'select' | 'confirm' | 'paying' | 'success'>('select');
  const [selectedPkg, setSelectedPkg] = useState<typeof GIFT_PACKAGES[0] | null>(null);

  const startPayment = (pkg: typeof GIFT_PACKAGES[0]) => {
    setSelectedPkg(pkg);
    setStep('confirm');
  };

  const handlePay = async () => {
    if (!selectedPkg) return;
    setStep('paying');
    
    // Simulate x402 Protocol Handshake (Clawbot Style)
    await new Promise(r => setTimeout(r, 1500)); 
    
    try {
      await addGiftAction(tombId, {
        from_gh_user: user?.username || user?.name || "Anonymous",
        amount: selectedPkg.amount,
        gift_type: selectedPkg.name
      });

      setTotal(prev => prev + selectedPkg.amount);
      setStep('success');
      setTimeout(() => setStep('select'), 3000);
    } catch (e) {
      console.error(e);
      setStep('select');
    }
  };

  return (
    <div className="p-8 rounded-[3rem] card-themed shadow-2xl relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] pointer-events-none group-hover:bg-primary/20 transition-all duration-700" />
      
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Coins className="w-5 h-5 text-themed-primary" />
          </div>
          <h3 className="text-xl font-black italic tracking-tighter text-themed-primary">x402 随礼</h3>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-themed-dim font-mono uppercase tracking-widest">Total Honor</span>
          <span className="font-mono text-themed-accent font-black text-lg">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'select' && (
          <motion.div 
            key="select"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-2 gap-3"
          >
            {GIFT_PACKAGES.map((pkg: any) => (
              <button
                key={pkg.id}
                onClick={() => startPayment(pkg)}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-themed-card border border-themed-border hover:border-themed-primary/50 transition-all group/btn active:scale-95"
              >
                <span className="text-2xl mb-2 group-hover/btn:scale-125 transition-transform">{pkg.icon}</span>
                <span className="text-xs font-bold text-themed-dim group-hover/btn:text-themed-primary">{pkg.name}</span>
                <span className="text-[10px] text-themed-dim/60 font-mono mt-1">${pkg.amount}</span>
              </button>
            ))}
          </motion.div>
        )}

        {step === 'confirm' && selectedPkg && (
          <motion.div 
            key="confirm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-3xl bg-themed-card border border-themed-border space-y-4">
              <div className="flex items-center justify-between text-xs text-themed-dim font-mono">
                <span>Transaction</span>
                <span className="text-themed-dim font-bold uppercase tracking-widest">Insecure-Handshake</span>
              </div>
              <div className="flex items-center gap-4 py-2">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-2xl">
                  {selectedPkg.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-themed-primary">{selectedPkg.name}</h4>
                  <p className="text-[10px] text-themed-dim font-mono italic">Lobster Respect Pack</p>
                </div>
                <div className="text-right">
                  <span className="text-themed-accent font-black text-lg font-mono">${selectedPkg.amount}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-themed-border flex items-center gap-2 text-[10px] text-themed-dim">
                <ShieldCheck className="w-3 h-3 text-green-500" />
                x402 Protocol: Secure Peer Validation Active
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setStep('select')}
                className="btn-secondary-themed text-xs py-3"
              >
                取消 (Abort)
              </button>
              <button 
                onClick={handlePay}
                className="btn-primary-themed text-xs py-3"
              >
                确认支付 (Execute)
              </button>
            </div>
          </motion.div>
        )}

        {step === 'paying' && (
          <motion.div 
            key="paying"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 space-y-6 text-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
              <ArrowRightLeft className="w-12 h-12 text-themed-primary animate-spin" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-bold text-themed-primary">x402 Handshake in progress...</p>
              <p className="text-[10px] text-themed-dim font-mono italic">
                Signing transaction with peer identity...
                <br/>
                Verifying state consistency...
              </p>
            </div>
          </motion.div>
        )}

        {step === 'success' && selectedPkg && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-10 space-y-6 text-center"
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-black text-themed-primary">支付成功!</h4>
              <p className="text-xs text-themed-dim max-w-[200px] leading-relaxed">
                感谢你对 {selectedPkg.name} 的慷慨。
                <br />
                龙虾的灵魂已收到这份礼物。
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-center gap-2 text-[9px] font-mono text-themed-dim opacity-50 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
        <Wallet className="w-3 h-3" />
        Protocol: x402-v1.2-alpha
      </div>
    </div>
  );
}
