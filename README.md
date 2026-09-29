# vue-frontend-template

可复用的 Vue 3 前端骨架，技术栈对齐本工作区 `oj-frontend` 的精简子集，默认对接 [`spring-cloud-template`](../spring-cloud-template) 的 **tpl-gateway**。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 · TypeScript · Vite 6 |
| UI | Element Plus · `@element-plus/icons-vue` · 自动导入 |
| 状态 | Pinia + pinia-plugin-persistedstate |
| 路由 | Vue Router 4（`meta.needLogin` 守卫） |
| 请求 | Axios（Bearer JWT · 业务码 `40100` / HTTP 401） |
| 包管理 | pnpm（推荐） |

不含 Monaco / Markdown / ECharts，需要时再自行接入。

## 目录

```
src/
  api/demo/       # 对接 tpl-service-a 的示例 API
  axios/          # baseURL + 拦截器
  components/     # 顶栏
  router/         # 路由与登录守卫
  store/          # user（token 持久化）
  views/          # Home / Login / ItemDemo / OrderDemo
```

## 环境要求

- Node.js 18+（建议 LTS）
- pnpm 8+
- 已启动的 `spring-cloud-template`：中间件 + `tpl-service-a` + `tpl-gateway`（网关默认 **8080**）

## 快速开始

```bash
cd vue-frontend-template
pnpm install
pnpm dev
```

浏览器打开 Vite 提示的本地地址（默认 `http://localhost:5173`）。

### 环境变量

| 文件 | 变量 | 说明 |
|------|------|------|
| `.env.development` | `VITE_API_BASE_URL=/api` | 开发走 Vite 代理 |
| `.env.production` | `VITE_API_BASE_URL=/api` | 生产同源，由 Nginx 反代 |

`vite.config.ts` 将 `/api` 代理到 `http://localhost:8080`（tpl-gateway）。

## 与 gateway 的约定

路由：Gateway 收到 `/api/{svc}/**`，`StripPrefix=1` 后转发为 `/{svc}/**`。

前端 `axios` 的 `baseURL` 为 `/api`，业务路径写 `/a/...`、`/b/...`，最终请求为 `/api/a/...`。

| 示例 | 说明 |
|------|------|
| `GET /api/a/health` | 探活（公开） |
| `GET /api/a/token?userId=1` | 演示发 JWT（公开） |
| `POST /api/a/items` | 创建商品（公开） |
| `GET /api/a/items/search?q=` | ES 搜索（公开，需 ES） |
| `POST /api/a/orders` | 下单（需 `Authorization: Bearer <token>`） |

业务响应形态：`{ code, data, message }`，成功 `code === 200`，未登录 `40100`。

## 页面说明

| 路径 | 作用 |
|------|------|
| `/` | 首页 + gateway 探活 |
| `/user/login` | 调 `/a/token` 写入 Pinia |
| `/demo/items` | 创建 / 按 ID 查 / 搜索 |
| `/demo/order` | 需登录的下单演示（可勾选 fail 回滚） |

## 脚本

```bash
pnpm dev        # 开发
pnpm typecheck  # vue-tsc
pnpm build      # 类型检查 + 构建
pnpm preview    # 预览 dist
```

## 独立仓库

本目录自带独立 `.git`，可单独推到远程；与 `oj-frontend` / `spring-cloud-template` 无强制耦合。复制到新项目后改 `package.json` 的 `name` 与 README 即可。
