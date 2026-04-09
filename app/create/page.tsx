import { auth, signIn } from "@/auth";
import { TombForm } from "./TombForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function CreateTombPage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 text-center mt-20">
        <h1 className="text-4xl font-bold">先登录，再立碑</h1>
        <p className="text-zinc-500">我们需要验证你的 GitHub 身份，以确保你是龙虾的朋友而非路过的 Bug。</p>
        <form
          action={async () => {
            "use server";
            await signIn("github");
          }}
        >
          <button className="px-8 py-4 bg-zinc-100 text-black font-bold rounded-xl hover:bg-white transition-all">
            使用 GitHub 登录
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl px-4 py-12">
      <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors mb-8">
        <ChevronLeft className="w-4 h-4" />
        返回首页
      </Link>
      
      <div className="space-y-4 mb-12">
        <h1 className="text-5xl font-bold tracking-tight">为逝去的逻辑立碑</h1>
        <p className="text-zinc-500 text-lg">填写龙虾的信息，我们将永远铭记它的存在。</p>
      </div>

      <TombForm user={session.user as any} />
    </div>
  );
}
