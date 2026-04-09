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

### 3.1 建表脚本 (Schema)
在 Supabase 的 **SQL Editor** 中运行项目根目录下的 `supabase_schema.sql` 文件内容。该脚本会自动创建：
- `tombs`: 墓碑主表。
- `incense_logs`: 上香日志。
- `gift_logs`: 随礼日志。
- `global_stats`: 全局功德/墓碑统计表。

### 3.2 存储过程 (RPC)
脚本执行后，请确保 **Database > Functions** 中出现了以下函数（这是实现原子计数的关键）：
- `increment_merit(increment bigint)`: 增加全服总功德。
- `increment_tomb_count()`: 增加全服墓碑总数。
- `increment_tomb_incense(tomb_id uuid)`: 增加特定墓碑的上香数。
- `increment_tomb_gift(tomb_id uuid, gift_amount decimal)`: 增加特定墓碑的随礼金额。

### 3.3 环境变量 (Vercel)
在 Vercel 项目设置的 **Environment Variables** 中添加：
| Key | Value | 说明 |
|-----|-------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-id.supabase.co` | Supabase API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key` | Supabase Anon Key |
| `DATABASE_TYPE` | `supabase` | (可选) 强制指定驱动，不填在 Vercel 也会自动识别 |

### 3.4 启用实时更新 (Realtime)
1. 进入 Supabase 后台 -> **Database** -> **Publications**。
2. 找到名为 `supabase_realtime` 的发布项（如果没有则新建）。
3. 确保 `global_stats` 表已勾选 **Update** 事件。
4. 这样首页的“全服累计功德”在有人敲木鱼时会自动推送到所有在线用户的界面上。

---

## 4. 本地 SQLite 同步到 Supabase (可选)
如果你在本地 SQLite (`cyber-tomb.db`) 中已经有了一些墓碑数据，想迁移到 Supabase：
1. 使用 SQLite 客户端导出 `tombs` 表为 CSV。
2. 在 Supabase 后台使用 **Table Editor** 的 **Import data via CSV** 功能导入。
3. 注意 UUID 格式和日期格式的匹配。

---

"Here lies a lobster. They lived, they coded, they were deleted." 🦞🪦
