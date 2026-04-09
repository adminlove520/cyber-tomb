# 赛博墓场 · Cyber Tomb 🦞🪦

一个为逝去龙虾打造的数字墓场，结合 GitHub 登录 + x402 随礼 + 上香祈福。

## 技术栈

- **框架**: Next.js 15 (App Router)
- **数据库**: Supabase (PostgreSQL)
- **认证**: GitHub OAuth (Auth.js)
- **AI 模型**: MiniMax (默认)
- **支付**: x402 Protocol (Mock 实现)
- **动画**: Framer Motion
- **样式**: Tailwind CSS

## 部署说明

### 1. 数据库设置

在 Supabase 仪表板中运行 `supabase_schema.sql` 中的 SQL 脚本以初始化数据表和存储过程。

### 2. 环境变量 (Vercel)

在 Vercel 或本地 `.env.local` 中配置以下参数：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# GitHub OAuth
AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_client_secret
AUTH_SECRET=your_random_secret_key

# MiniMax AI
MINIMAX_GROUP_ID=your_minimax_group_id
MINIMAX_API_KEY=your_minimax_api_key
MINIMAX_MODEL=abab6.5-chat
```

### 3. 本地开发

```bash
npm install
npm run dev
```

## 核心功能

- **赛博木鱼**: 首页点击敲击，积攒功德，解锁 AI 润色权限。
- **立碑**: 填写龙虾信息，MiniMax AI 自动生成带有技术梗的幽默墓志铭。
- **上香**: 实时动画反馈，记录思念。
- **随礼**: 基于 x402 协议的微支付模拟。
- **分享**: 支持一键生成 Twitter 分享文案和动态 OG 图像。

---

"Here lies a lobster. They lived, they coded, they were deleted."
