# 赛博墓场 · 认证配置指南

本项目使用 **Auth.js v5** 实现 GitHub OAuth 登录。

## 1. 注册 GitHub OAuth App

前往 GitHub 的 **Developer Settings** > **OAuth Apps**，点击 **New OAuth App**。

### 配置如下：

- **Application name**: `Cyber Tomb (赛博墓场)`
- **Homepage URL**: `http://localhost:3000` (开发环境) 或 `https://your-domain.vercel.app` (生产环境)
- **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github` (开发环境) 或 `https://your-domain.vercel.app/api/auth/callback/github` (生产环境)

---

## 2. 获取 ID 和 Secret

点击 **Register application**，复制 **Client ID** 和 **Client Secret**。

### 写入 `.env`:

```env
AUTH_GITHUB_ID=你的GitHub_Client_ID
AUTH_GITHUB_SECRET=你的GitHub_Client_Secret
```

---

## 3. 生成 Auth Secret (AUTH_SECRET)

运行以下命令生成一个强随机密钥：

```bash
openssl rand -base64 32
```

将结果写入 `.env`:

```env
AUTH_SECRET=生成的随机密钥
```

---

## 4. 常见问题 (Troubleshooting)

- **回调地址错误**: 如果登录后报错 `Callback URL mismatch`，请检查 GitHub 上的 `Authorization callback URL` 是否完全正确。
- **重定向 URL**: 在本地运行时，请确保浏览器访问的是 `localhost:3000` 且与 GitHub 上的配置一致。

---

"Here lies a lobster. They lived, they coded, they were deleted." 🦞🪦
