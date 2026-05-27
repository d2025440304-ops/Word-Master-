# WordMaster

给自己写一个愿意每天打开的背单词软件。

## 当前功能

- **三种学习模式** — 闪卡（点击翻转）、选择题、拼写默写
- **艾宾浩斯复习** — 7 级间隔复习算法（10分钟 → 1天 → 2天 → 4天 → 7天 → 15天 → 30天）
- **双词库** — 内置 CET-4（~150 词）+ CET-6（~50 词），支持自定义导入
- **云端同步** — Supabase Auth 登录 + 学习进度跨设备同步
- **学习统计** — 每日学习量、掌握数、正确率、连续打卡天数、学习时长
- **学习日历** — 近 90 天热力图，点击查看每日详情
- **单词本** — 按掌握程度浏览所有学过的词

## 技术栈

| 层 | 技术 |
|---|------|
| 前端 | 单文件 HTML + CSS + Vanilla JS |
| 认证 | Supabase Auth（邮箱注册/登录） |
| 数据库 | Supabase PostgreSQL（3 张表） |
| 部署 | Netlify / GitHub Pages |

## 快速开始

1. 部署到 Netlify（或任意静态托管），设置以下环境变量注入 Supabase 凭据
2. 在 Supabase SQL Editor 中执行建表语句（见下方）
3. 打开页面，注册/登录即可开始背词

### 数据库建表

```sql
-- 单词进度表
CREATE TABLE word_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  word_key TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 0,
  last_review TIMESTAMPTZ,
  next_review TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, word_key)
);

-- 每日统计表
CREATE TABLE daily_stats (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  learned INTEGER NOT NULL DEFAULT 0,
  reviewed INTEGER NOT NULL DEFAULT 0,
  correct INTEGER NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, date)
);

-- 用户设置表
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  streak INTEGER NOT NULL DEFAULT 0,
  last_study_date DATE,
  bank TEXT NOT NULL DEFAULT 'cet4',
  custom_words JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- RLS
ALTER TABLE word_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_word_progress" ON word_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_daily_stats" ON daily_stats FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_settings" ON user_settings FOR ALL USING (auth.uid() = user_id);
```

## 项目结构

```
WordMaster/
├── index.html     # 整个应用（前端 + 逻辑 + 词库数据）
├── PROJECT.md     # 项目路线图与成长规划
└── README.md
```

## 路线图

详见 [PROJECT.md](./PROJECT.md) — 从单机工具到社交化产品的完整演进路线。

v0（当前）→ v1（打磨单机体验）→ v2（引入后端）→ v3（社交化）→ v4（产品化）
