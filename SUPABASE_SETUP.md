# Supabase GitHub OAuth 设置指南

## 快速开始

按照以下步骤设置 Supabase 和 GitHub OAuth 认证。

## 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com)
2. 注册或登录账户
3. 点击 "New Project"
4. 输入项目名称（如 `nanobanana-ai`）
5. 设置数据库密码
6. 选择地区（推荐选择离你最近的）
7. 点击 "Create new project"，等待部署完成（约 3-5 分钟）

## 2. 获取 Supabase 凭证

项目创建完成后：

1. 点击左侧 "Settings" 菜单
2. 选择 "API"
3. 复制以下凭证：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API Keys** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`（选择 public anon key）
   - **Service Role Key** → `SUPABASE_SERVICE_ROLE_KEY`（**不要分享！**）

## 3. 配置 GitHub OAuth

### 步骤 A：在 Supabase 创建 OAuth 应用

1. 在 Supabase 控制面板，选择 "Authentication" → "Providers"
2. 找到 "GitHub" 并点击启用
3. 你会看到两个字段：
   - **Redirect URL**: `https://your-project-id.supabase.co/auth/v1/callback?provider=github`

### 步骤 B：在 GitHub 创建 OAuth 应用

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 "OAuth Apps" → "New OAuth App"
3. 填写表单：
   - **Application name**: `Nano Banana AI Clone`
   - **Homepage URL**: `http://localhost:3000`（开发环境）
   - **Authorization callback URL**: 从 Supabase 复制的 Redirect URL
   - 点击 "Register application"

4. 创建后，你会看到：
   - **Client ID**
   - **Client Secret**（点击"Generate a new client secret"）

### 步骤 C：在 Supabase 配置 GitHub 提供商

1. 回到 Supabase 的 GitHub 提供商配置页
2. 粘贴从 GitHub 获取的：
   - **Client ID**
   - **Client Secret**
3. 点击 "Save"

## 4. 配置环境变量

在项目根目录编辑 `.env.local` 文件：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...（你的 anon key）
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...（你的 service role key）

# 其他配置
NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Nano Banana
```

**⚠️ 重要：** 
- **永远不要** 在 GitHub 或公开地方分享 `SUPABASE_SERVICE_ROLE_KEY`
- 本地开发时 `.env.local` 已在 `.gitignore` 中，是安全的

## 5. 本地测试

1. 启动开发服务器：
   ```bash
   npm run dev
   ```

2. 访问 `http://localhost:3000`

3. 点击导航栏的 "Sign in with GitHub" 按钮

4. 你会被重定向到 GitHub 登录页面

5. 授权后，你会被重定向到 `/api/auth/github/callback`，然后到 `/dashboard`

## 6. 生产部署（Vercel）

### 步骤 A：部署到 Vercel

```bash
npm install -g vercel
vercel login
vercel
```

### 步骤 B：配置环境变量

1. 在 Vercel 项目设置中，找到 "Environment Variables"
2. 添加：
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

### 步骤 C：更新 GitHub OAuth 回调 URL

1. 回到 GitHub 开发者设置
2. 编辑你的 OAuth 应用
3. 修改 **Authorization callback URL** 为：
   ```
   https://your-vercel-url.vercel.app/api/auth/github/callback
   ```

### 步骤 D：更新 Supabase 回调 URL

在 Supabase 的 GitHub 提供商设置中，如果需要，更新为生产环境的回调 URL。

## 常见问题

### Q: GitHub 登录失败，显示 "Invalid request"
**A:** 
- 检查 GitHub OAuth 应用中的 "Authorization callback URL" 是否正确
- 确保与 Supabase 中的 Redirect URL 一致

### Q: 登录后显示 "No session created"
**A:**
- 检查 `SUPABASE_SERVICE_ROLE_KEY` 是否正确
- 确认 GitHub 提供商在 Supabase 中已启用

### Q: 环境变量未被识别
**A:**
- 重启开发服务器：`npm run dev`
- 确保使用的是 `NEXT_PUBLIC_` 前缀的变量（客户端可见）
- 不带前缀的变量只在服务器端可用

### Q: 本地与生产登录 URL 不同
**A:** 这是正常的。生产环境需要：
- 不同的 GitHub OAuth 应用（或同一个应用配置多个回调 URL）
- 不同的 Supabase 项目（可选，但推荐用于隔离）
- 更新 `.env.local` 中的 `NEXT_PUBLIC_SUPABASE_URL` 指向正确的 Supabase 项目

## 技术细节

### 认证流程

```
用户点击"Sign in with GitHub"
        ↓
客户端调用 POST /api/auth/github
        ↓
服务器调用 signInWithOAuth()
        ↓
服务器返回 GitHub OAuth URL
        ↓
客户端重定向到 GitHub
        ↓
用户授权应用
        ↓
GitHub 重定向到 /api/auth/github/callback?code=...&state=...
        ↓
服务器调用 exchangeCodeForSession()
        ↓
会话保存到 Cookie
        ↓
重定向到 /dashboard
```

### 服务端认证的优势

- ✅ Service Role Key 安全（不暴露给客户端）
- ✅ 完整的 OAuth 流程控制
- ✅ 会话管理更灵活
- ✅ 支持自定义认证逻辑

## 获取用户信息

在任何页面使用 `UserMenu` 组件自动显示已登录用户信息：

```tsx
import { UserMenu } from '@/components/user-menu'

export default function Header() {
  return <UserMenu />
}
```

## 安全建议

1. **永远不要** 在代码中硬编码密钥
2. **使用环境变量** 管理所有敏感凭证
3. **定期轮换** Service Role Key（在 Supabase 中）
4. **限制 GitHub OAuth** 应用的权限范围
5. **启用 Supabase 的 RLS**（行级安全）保护数据库

## 参考资源

- [Supabase GitHub Auth 文档](https://supabase.com/docs/guides/auth/social-login/auth-github)
- [Supabase Server-Side Auth](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [GitHub OAuth 文档](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Next.js 环境变量](https://nextjs.org/docs/basic-features/environment-variables)

---

**需要帮助？** 检查浏览器控制台和服务器日志中的错误信息，或访问 [Supabase Docs](https://supabase.com/docs)。
