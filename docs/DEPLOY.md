# 赛博墓场 · 部署指南

本指南详细介绍了如何将“赛博墓场”部署到生产环境（推荐使用 Vercel）。

## 1. 核心流程

1. **GitHub 仓库**: 将代码推送至你的 GitHub 私有或公开仓库。
2. **Vercel 项目**: 在 Vercel 后台点击 "New Project"，关联你的 GitHub 仓库。
3. **环境变量**: 在 Vercel 的项目设置中填入 `.env.example` 中的所有必要参数。
4. **数据库初始化**: 
   - 如果使用 Supabase，请参考 [DATABASE.md](./DATABASE.md) 的 Supabase 部分。
   - 如果使用边缘 SQLite (Turso)，请在环境变量中设置 `DATABASE_TYPE=sqlite`。

## 2. 必备环境变量说明

| 变量名 | 说明 | 获取方式 |
| :--- | :--- | :--- |
| `DATABASE_TYPE` | 数据库类型 | `supabase` (默认生产) 或 `sqlite` (本地开发) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL | Supabase Dashboard > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Key | Supabase Dashboard > Settings > API |
| `AUTH_GITHUB_ID` | GitHub Client ID | GitHub Settings > Developer settings > OAuth Apps |
| `AUTH_GITHUB_SECRET` | GitHub Client Secret | GitHub Settings > Developer settings > OAuth Apps |
| `AUTH_SECRET` | Auth.js 密钥 | 运行 `openssl rand -base64 32` 生成 |
| `MINIMAX_API_KEY` | MiniMax API Key | MiniMax 控制台 > [账户/Token计费](https://platform.minimaxi.com/user-center/token-plan) |
| `MINIMAX_MODEL` | 文本生成模型 | 推荐使用 `MiniMax-M2.1` |
| `MINIMAX_GROUP_ID` | (可选) 组 ID | 仅老款企业账号需要，Token计费模式通常不需要 |

## 3. GitHub OAuth 配置 (回调地址)

在 GitHub 的 OAuth App 设置中，你必须正确填写回调地址：

- **Homepage URL**: `https://your-domain.vercel.app`
- **Authorization callback URL**: `https://your-domain.vercel.app/api/auth/callback/github`

## 4. Twitter (X) 分享配置

本项目集成 Twitter Web Intent 分享功能：
- **文案定制**: 已在 `components/TwitterShare.tsx` 中预设了赛博风文案。
- **SEO 卡片**: Next.js 15 的动态 Metadata 自动根据墓碑详情生成 OG 预览图。
- **动态预览图**: 本地开发或生产环境均可生成包含龙虾形象的社交媒体分享卡片。

---

"Here lies a lobster. They lived, they coded, they were deleted." 🦞🪦
