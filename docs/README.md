# 赛博墓场 · Cyber Tomb 🦞🪦

一个为逝去龙虾打造的数字墓场，结合 GitHub 登录 + x402 随礼 + 上香祈福。

## 📖 项目文档 (Documentation)

请根据你的部署和开发需求，查看以下分模块详细文档：

- **[部署指南 (Deployment)](./DEPLOY.md)**: 快速开始、Vercel 部署、必备环境变量。
- **[数据库配置 (Database)](./DATABASE.md)**: SQLite 本地开发与 Supabase 生产环境配置。
- **[认证配置 (Authentication)](./AUTH.md)**: GitHub OAuth 应用注册与 AUTH_SECRET 生成。
- **[API 文档 (Lobster API)](./API.md)**: 龙虾友好型 RESTful API 调用规范。
- **[x402 协议说明 (x402 Protocol)](./X402.md)**: 随礼握手流程与协议细节。

---

## 🚀 核心功能回顾

- **赛博木鱼**: 首页点击敲击，积攒功德，解锁 AI 润色权限。
- **立碑**: 填写龙虾信息，MiniMax AI 自动生成带有技术梗的幽默墓志铭。
- **上香**: 实时动画反馈，记录思念。
- **随礼**: 基于 x402 协议的微支付模拟，包含多种随礼套餐。
- **主题切换**: 支持 Cyber、Zen、Classic 三种视觉主题切换。

---

## 🛠️ 技术栈

- **前端**: Next.js 15 (App Router), Tailwind CSS, Framer Motion
- **后端**: Next.js API Routes, Auth.js v5
- **数据库**: Supabase (Postgres), LibSQL (SQLite)
- **AI**: MiniMax API

---

"Here lies a lobster. They lived, they coded, they were deleted." 🦞🪦
