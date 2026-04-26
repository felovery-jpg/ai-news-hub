# 🚀 AI News Hub - 部署操作手册

> 全自动AI资讯网站，每天自动采集、AI处理、发布、SEO提交。
> **预计完成时间：30-45分钟（一次性操作）**

---

## 架构概览

```
GitHub (代码仓库)
  ↓ push → 自动部署
Vercel (网站托管，免费)
  ↑ 数据读取
Supabase (数据库，免费)
  ↑ 每天写入
GitHub Actions (定时任务，免费)
  → 每天6:00 UTC调用 /api/collect
  → 触发新闻采集 + AI摘要 + Bing IndexNow提交
  → 每周一提交sitemap到Google/Bing
```

---

## Step 1：注册必要账号

请按顺序注册（都是免费的）：

### 1.1 GitHub
- 访问：https://github.com/signup
- 用途：存放代码 + 运行定时任务（每天免费2000分钟）

### 1.2 Vercel
- 访问：https://vercel.com/signup
- 选择：用GitHub账号登录（免费）
- 用途：托管网站，全球CDN，自动HTTPS

### 1.3 Supabase
- 访问：https://supabase.com/dashboard/sign-up
- 选择：用GitHub账号登录（免费）
- 免费额度：500MB数据库，无限读取

### 1.4 Google AI Studio（Gemini API）
- 访问：https://ai.google.dev/
- 点击：Get API Key → Create API Key
- 免费额度：每天1500次请求，足够使用

---

## Step 2：创建GitHub仓库并上传代码

### 方法A：命令行（推荐）
```bash
cd ai-news-site
git init
git add .
git commit -m "Initial commit: AI News Hub"
# 在GitHub上创建新仓库后：
git remote add origin https://github.com/你的用户名/ai-news-site.git
git push -u origin main
```

### 方法B：GitHub Desktop
1. 下载 GitHub Desktop
2. File → Add Local Repository → 选择 ai-news-site 文件夹
3. Publish repository（设为Public以使用免费GitHub Actions）

---

## Step 3：初始化Supabase数据库

1. 登录 https://app.supabase.com
2. 点击 **New Project**，填写：
   - Name: `ai-news-hub`
   - Password: 设置数据库密码（记住）
   - Region: 选 **Southeast Asia (Singapore)** （亚洲最快）
3. 等待项目创建（约2分钟）
4. 进入 **SQL Editor**（左侧菜单）
5. 复制 `supabase/schema.sql` 的全部内容粘贴，点击 **Run**
6. 记录以下信息：
   - **Project URL**：设置页面 → API → `https://xxxx.supabase.co`
   - **anon public key**：设置页面 → API → anon key
   - **service_role key**：设置页面 → API → service_role key（🔒保密）

---

## Step 4：部署到Vercel

1. 登录 https://vercel.com
2. 点击 **Add New → Project**
3. 导入你的 GitHub 仓库
4. 在 **Environment Variables** 中添加以下变量：

```
NEXT_PUBLIC_SUPABASE_URL         = https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY    = eyJhbGc...（anon key）
SUPABASE_SERVICE_ROLE_KEY        = eyJhbGc...（service role key）
NEXT_PUBLIC_SITE_URL             = https://你的项目名.vercel.app
CRON_SECRET_KEY                  = 随机字符串（如：abc123def456...）
GEMINI_API_KEY                   = 你的Gemini API Key
INDEXNOW_KEY                     = 随机字符串（如：abc123def456）
```

5. 点击 **Deploy**，等待部署完成（约3分钟）

---

## Step 5：配置GitHub Actions Secrets

1. 进入你的GitHub仓库
2. Settings → Secrets and variables → Actions → New repository secret
3. 添加以下Secrets（与Vercel环境变量相同）：

| Secret名称 | 值 |
|-----------|---|
| `SITE_URL` | 你的Vercel网址 |
| `CRON_SECRET_KEY` | 与Vercel中相同的随机密钥 |
| `INDEXNOW_KEY` | 与Vercel中相同的IndexNow密钥 |

4. 进入 Actions 标签页，点击 **Daily AI News Collection** → **Run workflow** 测试一次

---

## Step 6：IndexNow验证文件

在Vercel部署后，需要将IndexNow key文件放到网站根目录：
1. 在 `public/` 文件夹中创建文件：`public/你的INDEXNOW_KEY.txt`
2. 文件内容只写：你的INDEXNOW_KEY字符串
3. Push到GitHub，Vercel会自动重新部署

---

## Step 7：Google Search Console（可选但重要）

1. 访问 https://search.google.com/search-console
2. Add Property → URL prefix → 输入你的Vercel网址
3. 选择HTML tag验证方式
4. 复制 content="xxxx" 中的值
5. 在Vercel环境变量中添加：
   - `NEXT_PUBLIC_GOOGLE_VERIFICATION` = xxxx
6. 重新部署后，点击Verify
7. Sitemaps → 添加 `sitemap.xml`

---

## Step 8：Google AdSense（流量稳定后申请）

> ⚠️ AdSense申请需要网站有稳定流量（建议有100+文章、每日30+访客后申请）

1. 访问 https://adsense.google.com
2. 申请后获得 `ca-pub-XXXXXXXXXXXXXXXX` 格式的Client ID
3. 在Vercel添加环境变量：
   - `NEXT_PUBLIC_ADSENSE_CLIENT_ID` = ca-pub-XXXXXXXXXXXXXXXX
4. 创建广告单元，获得Slot ID，填入对应变量

---

## 完成！网站功能清单

| 功能 | 状态 | 说明 |
|-----|------|------|
| ✅ 网站首页 | 自动 | 显示最新AI新闻 |
| ✅ AI工具导航页 | 自动 | /tools 展示推广工具 |
| ✅ 文章详情页 | 自动 | /article/[slug] |
| ✅ 每日自动采集 | 自动 | GitHub Actions每天6:00 UTC |
| ✅ AI摘要生成 | 自动 | Gemini API免费版 |
| ✅ SEO sitemap | 自动 | /sitemap.xml 自动更新 |
| ✅ RSS Feed | 自动 | /feed.xml |
| ✅ robots.txt | 自动 | /robots.txt |
| ✅ IndexNow提交 | 自动 | 每篇新文章自动提交 |
| ✅ Bing/Google ping | 自动 | 每周自动ping |
| ✅ 广告位 | 待配置 | 配置AdSense后生效 |
| ✅ 联盟推广链接 | 已嵌入 | AI工具页面 |
| ✅ JSON-LD结构化数据 | 自动 | 每个文章页面 |

---

## 变现路线图

### 阶段1（0-3个月）：积累内容和流量
- GitHub Actions每天自动发布30-100篇AI新闻
- SEO自然增长，目标：每天100+独立访客

### 阶段2（3-6个月）：开启变现
- 申请Google AdSense（预计月收入：$10-100）
- 推广AI工具联盟链接（重点：Jasper AI 30%提成）

### 阶段3（6个月+）：扩大规模
- 添加付费Newsletter
- 接受AI工具赞助内容
- 建立Product Hunt排名

---

## 数据源列表（自动采集）

| 来源 | 类型 | 更新频率 |
|-----|------|--------|
| TechCrunch AI | 新闻 | 每小时 |
| VentureBeat AI | 新闻 | 每小时 |
| The Verge AI | 新闻 | 每小时 |
| HuggingFace Blog | 研究 | 每日 |
| OpenAI Blog | 研究 | 不定期 |
| Google AI Blog | 研究 | 不定期 |
| Anthropic Blog | 研究 | 不定期 |
| GitHub Blog | 开发 | 每日 |
| Wired AI | 新闻 | 每小时 |
| IEEE AI | 学术 | 每周 |
| ML Mastery | 教程 | 每日 |
| AI Weekly | 简报 | 每周 |
| 更多... | ... | ... |

---

## 常见问题

**Q: 采集的内容是否有版权问题？**
A: 本站只显示文章摘要+链接，引导读者到原文阅读。这是新闻聚合站的标准做法，与Google News相同。

**Q: Gemini API用完怎么办？**
A: 免费版每天1500次请求，每篇文章用1次。超出时系统自动fallback到原始摘要，不影响功能。

**Q: 网站多久能被Google收录？**
A: IndexNow提交后Bing通常24小时内收录。Google通常3-7天内收录新域名。

**Q: 可以换成中文版吗？**
A: 当然。修改 `lib/config.ts` 中的 `locale: 'zh-CN'`，RSS源改为中文科技媒体即可。
