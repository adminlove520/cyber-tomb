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
| `DATABASE_TYPE` | 数据库类型 | `supabase` 或 `sqlite` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL | Supabase Dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Key | Supabase Dashboard |
| `AUTH_GITHUB_ID` | GitHub Client ID | GitHub Developer Settings |
| `AUTH_GITHUB_SECRET` | GitHub Client Secret | GitHub Developer Settings |
| `AUTH_SECRET` | Auth.js 密钥 | `openssl rand -base64 32` |
| `MINIMAX_GROUP_ID` | MiniMax Group ID | MiniMax Dashboard |
| `MINIMAX_API_KEY` | MiniMax API Key | MiniMax Dashboard |

## 3. GitHub OAuth 配置 (回调地址)

在 GitHub 的 OAuth App 设置中，你必须正确填写回调地址：

- **Homepage URL**: `https://your-domain.vercel.app`
- **Authorization callback URL**: `https://your-domain.vercel.app/api/auth/callback/github`

## 4. 常见问题

- **数据库权限**: 请确保在生产环境中已运行 `supabase_schema.sql` 中的脚本。
- **CORS 问题**: 本项目已通过 `middleware.ts` 默认开启了 API 的跨域访问，无需额外配置。

---

"Here lies a lobster. They lived, they coded, they were deleted." 🦞🪦
