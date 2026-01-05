# 增强编辑插件拆分 Walkthrough

## 概述

成功将原始的单文件 [main.js](file:///c:/Obsidian%20Vault/ZH%E5%A2%9E%E5%BC%BA%E7%BC%96%E8%BE%91/main.js)（2234行，116KB）转换为模块化的 TypeScript 项目结构。

## 创建的文件

### 项目配置

| 文件 | 说明 |
|------|------|
| [package.json](file:///c:/Obsidian%20Vault/ZH%E5%A2%9E%E5%BC%BA%E7%BC%96%E8%BE%91/package.json) | 项目依赖和构建脚本 |
| [tsconfig.json](file:///c:/Obsidian%20Vault/ZH%E5%A2%9E%E5%BC%BA%E7%BC%96%E8%BE%91/tsconfig.json) | TypeScript 配置 |
| [esbuild.config.mjs](file:///c:/Obsidian%20Vault/ZH%E5%A2%9E%E5%BC%BA%E7%BC%96%E8%BE%91/esbuild.config.mjs) | esbuild 打包配置 |

### 源码模块

| 文件 | 说明 |
|------|------|
| [src/main.ts](file:///c:/Obsidian%20Vault/ZH%E5%A2%9E%E5%BC%BA%E7%BC%96%E8%BE%91/src/main.ts) | 主入口文件，包含 MyPlugin 类 |
| [src/settings.ts](file:///c:/Obsidian%20Vault/ZH%E5%A2%9E%E5%BC%BA%E7%BC%96%E8%BE%91/src/settings.ts) | Settings 类 |
| [src/settings-tab.ts](file:///c:/Obsidian%20Vault/ZH%E5%A2%9E%E5%BC%BA%E7%BC%96%E8%BE%91/src/settings-tab.ts) | 设置面板 UI |
| [src/globals.ts](file:///c:/Obsidian%20Vault/ZH%E5%A2%9E%E5%BC%BA%E7%BC%96%E8%BE%91/src/globals.ts) | 全局变量声明 |
| [src/data/char-tables.ts](file:///c:/Obsidian%20Vault/ZH%E5%A2%9E%E5%BC%BA%E7%BC%96%E8%BE%91/src/data/char-tables.ts) | 简繁体字表数据 |
| [src/utils/editor.ts](file:///c:/Obsidian%20Vault/ZH%E5%A2%9E%E5%BC%BA%E7%BC%96%E8%BE%91/src/utils/editor.ts) | 编辑器工具函数 |
| [src/features/all-features.ts](file:///c:/Obsidian%20Vault/ZH%E5%A2%9E%E5%BC%BA%E7%BC%96%E8%BE%91/src/features/all-features.ts) | 功能方法实现（部分） |

## 项目结构

```
增强编辑/
├── src/
│   ├── main.ts                    # 主入口
│   ├── settings.ts                # 设置类
│   ├── settings-tab.ts            # 设置面板
│   ├── globals.ts                 # 全局变量
│   ├── data/
│   │   └── char-tables.ts         # 简繁体字表
│   ├── utils/
│   │   └── editor.ts              # 编辑器工具
│   └── features/
│       └── all-features.ts        # 功能实现
├── package.json
├── tsconfig.json
├── esbuild.config.mjs
├── manifest.json                  # Obsidian 插件清单
└── main.js                        # 构建输出
```

## 验证结果

### 构建命令

```bash
npm install   # ✅ 成功安装 16 个包
npm run build # ✅ 成功构建
```

### 构建输出

- 输出文件：[main.js](file:///c:/Obsidian%20Vault/ZH%E5%A2%9E%E5%BC%BA%E7%BC%96%E8%BE%91/main.js)（36KB，压缩后）
- 构建工具：esbuild
- 目标格式：CommonJS (cjs)

## 待完成工作

> [!IMPORTANT]
> 主入口文件中的大部分功能方法目前标记为 `TODO` 存根。

以下功能方法需要从原 [main.js](file:///c:/Obsidian%20Vault/ZH%E5%A2%9E%E5%BC%BA%E7%BC%96%E8%BE%91/main.js) 迁移完整实现：

- 光标跳转、切换文件列表
- 转换内部链接、同义链接
- 粗体、高亮、斜体等格式转换
- 智能符号、标题语法
- 文字/背景颜色、上下标
- 括选文本、删除段落、待办列表
- 智能粘贴、标注文本获取
- 嵌入网址、折叠标题
- 空行空格处理
- 简繁转换、标点转换、路径转换等

## 使用方法

### 开发模式（监听文件变化）

```bash
npm run dev
```

### 生产构建

```bash
npm run build
# 或
bun run build
```