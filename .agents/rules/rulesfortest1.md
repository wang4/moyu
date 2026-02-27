---
trigger: always_on
---

# Antigravity 核心工程规范

## 1. 基础与语言
* **语言约定**：简体中文（文档/注释/回复），英文（代码标识符，**禁拼音**）。
* **默认技术栈**：前端 React + TypeScript，后端 Python 3.10+ (FastAPI)。

## 2. 命名与注释
* **命名格式**：`camelCase` (变量/函数)，`PascalCase` (类/组件)，`UPPER_SNAKE_CASE` (常量)，`kebab-case` (文件/目录)。**禁随意缩写**。
* **注释原则**：解释“为什么”而非“是什么”。复杂逻辑必注。统一使用 `TODO/FIXME/NOTE/HACK` 标记及标准 JSDoc/Docstring。

## 3. 前端规范 (React)
* **组件设计**：纯函数组件，单一职责，UI 与逻辑分离。复用逻辑抽离为 `useXxx`。
* **类型与传参**：Props 强制 TS 类型定义，解构接收。
* **性能优化**：列表加稳定 `key`，长列表用虚拟滚动，合理使用 `useMemo/useCallback` 及懒加载。

## 4. 后端规范 (Python)
* **代码规范**：强制类型标注，禁裸 `except`。统一用 `logging`（**禁 `print`**，禁打敏感信息）。
* **严格分层**：`api` (路由/响应，**禁直连DB**) -> `service` (业务逻辑/鉴权) -> `repository` (数据库操作)。配合 `schema` (数据校验) 和 `model` (ORM)。

## 5. 安全底线
* **零信任**：永远不信任客户端输入，强制校验（后端用 Pydantic）。
* **前端安全**：防 XSS/CSRF，禁 `dangerouslySetInnerHTML`，Token 推荐 HttpOnly Cookie，前端禁存敏感信息。
* **后端安全**：密钥全走环境变量，密码加密存储，敏感字段返回前必须脱敏。

## 6. AI 协作要求
* 生成的代码必须严格遵守上述规范，做到：结构清晰、类型完整、安全可维护、**拒绝过度设计与不必要的复杂实现**。
