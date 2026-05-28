# WordMaster

给自己写一个愿意每天打开的背单词软件。

---

## 🔥 特色功能：程序员扫盲词库

**这是 WordMaster 最独特的功能 — 专为程序员设计的英文扫盲词库。**

你是不是也遇到过这种情况——刷 LeetCode 时看到 `src`、`dst`、`ptr`、`alloc` 一脸懵？看开源项目源码时，`middleware`、`singleton`、`mutex` 不知道在干嘛？**问题不在于代码复杂，而在于你不认识这些命名里的英文。**

WordMaster 内置了 **194 个程序员高频缩写和术语**，按场景分为 6 个子类：

| 子类 | 词数 | 典型词汇 |
|------|------|----------|
| 通用变量缩写 | 44 | arr, str, ptr, buf, ctx, fd, ret, argc… |
| 算法与数据结构 | 49 | src, dst, lo, hi, vis, dp, adj, freq… |
| 函数与生命周期 | 38 | init, alloc, parse, serialize, dfs, bfs… |
| 系统与工程 | 30 | pid, mutex, sock, stdin, EOF, npos… |
| 面向对象与设计模式 | 15 | singleton, factory, handler, middleware… |
| Git 与工程协作 | 18 | repo, commit, rebase, TODO, FIXME, LGTM… |

**学习体验的差异化设计：**

- **代码例句代替传统例句** — 闪卡背面直接展示代码片段（`int *ptr = &val;`），不是干巴巴的英文句子
- **等宽字体渲染** — 代码例句用 SF Mono / Fira Code 等宽字体展示，所见即所得
- **只开闪卡 + 选择模式** — 程序员不需要默写拼写，知道意思就行，拼写模式自动隐藏
- **6 个子类独立可选** — 刷算法前只看"算法与数据结构"，写系统编程前只看"系统与工程"

**怎么用：** 打开页面 → 点击左下角 📚 按钮 → 选择「程序员」→ 展开选子类 → 开始扫盲。

> 💡 打开页面时会有一个引导气泡指向 📚 按钮，别错过。

---

## 当前功能

- **三种学习模式** — 闪卡（点击翻转）、选择题、拼写默写
- **艾宾浩斯复习** — 7 级间隔复习算法（10分钟 → 1天 → 2天 → 4天 → 7天 → 15天 → 30天）
- **四词库** — CET-4（3739 词）、CET-6（2345 词）、程序员（194 词 / 6 子类）、自定义导入
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
├── index.html              # 应用主体（HTML + CSS + JS）
├── data/
│   ├── cet4.js             # CET-4 词库（3739 词）
│   ├── cet6.js             # CET-6 词库（2345 词）
│   ├── programmer.js       # 程序员词库（194 词 / 6 子类）
│   └── custom-words.js     # 自定义词库模板
├── convert.js              # 词库格式转换脚本（JSONL → JS）
├── PROJECT.md              # 项目路线图与成长规划
└── README.md
```

## 路线图

详见 [PROJECT.md](./PROJECT.md) — 从单机工具到社交化产品的完整演进路线。

v0（当前）→ v1（打磨单机体验）→ v2（引入后端）→ v3（社交化）→ v4（产品化）
