# 炫酷商城

这是一个基于Next.js、TypeScript和Tailwind CSS开发的现代电商网站。

## 环境变量设置

本项目使用Supabase进行用户认证和数据存储。部署前需要设置以下环境变量：

1. `NEXT_PUBLIC_SUPABASE_URL` - Supabase项目URL
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase匿名公共密钥

### 在Vercel上设置环境变量

1. 登录Vercel控制台
2. 进入项目设置
3. 找到"Environment Variables"选项
4. 添加上述两个环境变量及其值

### 本地开发

在本地开发时，可以创建`.env.local`文件并添加以下内容：

```
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
```

## 项目运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 功能

- 用户认证（登录、注册、密码重置）
- 产品浏览和搜索
- 购物车功能
- 个人中心
- 收藏夹 