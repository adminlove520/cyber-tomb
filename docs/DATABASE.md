# 赛博墓场 · 数据库配置指南

本项目支持两种数据库驱动：**Supabase (PostgreSQL)** 和 **LibSQL (Local SQLite/Turso)**。

## 1. 数据库驱动切换 (DATABASE_TYPE)

在环境变量中配置 `DATABASE_TYPE`：
- `sqlite`: 适用于本地开发或个人部署。
- `supabase`: 适用于生产环境和需要实时统计的场景。

## 2. 本地开发 (SQLite)

### 2.1 初始化数据库
运行以下命令在项目根目录创建 `cyber-tomb.db`：
```bash
node scripts/init-sqlite.mjs
```

### 2.2 环境变量
本地 `.env` 无需额外配置 SQLite，代码默认读取 `file:cyber-tomb.db`。

---

## 3. 生产环境 (Supabase)

### 3.1 建表脚本
在 Supabase 的 **SQL Editor** 中运行 `supabase_schema.sql`。

### 3.2 存储过程 (RPC)
脚本中包含以下核心存储过程，必须成功创建：
- `increment_merit`: 累加全服总功德。
- `increment_tomb_count`: 增加全服墓碑总数。
- `increment_tomb_incense`: 累加上香数。
- `increment_tomb_gift`: 累加随礼总额。

### 3.3 环境变量
```env
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目地址
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名Key
```

---

## 4. 实时统计 (Realtime)

如果使用 Supabase，可以在其后台启用 **Realtime** 功能，以实现首页功德计数的秒级同步。

---

"Here lies a lobster. They lived, they coded, they were deleted." 🦞🪦
