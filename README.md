# Nodejs Express 数据加密

## 项目描述

实现常用的用户操作场景所涉及的重点数据加密功能，项目是基于 Nodejs Express 框架，使用 TypeScript 开发的 MVC 架构后端服务

## 项目运行

### 安装依赖

```shell
npm install
```

### 启动服务

```shell
npm run start
```

### 启动开发模式

```shell
npm run dev
```

### 项目打包构建

```shell
npm run build
```

生产环境可以选择部署打包后的项目，以提高启动速度与保护源码

## 目录结构

```
├─builder - 项目构建器
├─dist - 打包输出目录
├─frontendApp - 前端单页面应用
├─keys - RSA 密钥
├─src - 项目源码
│  ├─apps - 应用模块
│  ├─configs - 服务配置
│  ├─interfaces - 公共接口
│  ├─models - 公共数据模型
│  ├─privateMiddlewares - 私有中间件
│  ├─publicMiddlewares - 公共中间件
│  ├─serverError - 异常处理
│  └─utils - 工具库
└─static - 静态文件
```
