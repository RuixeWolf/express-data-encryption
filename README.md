# Nodejs Express 数据加密

## 项目描述

基于 Nodejs Express 框架，使用 TypeScript 开发的 MVC 架构后端服务，实现常用的用户操作场景所涉及的重点数据加密功能

## 主要功能

- 非对称加密传输时的重点数据（如：密码）
- 单向加密储存时的重点数据
- 使用 Token 验证客户端的会话状态
- Token 有时限，客户端访问时自动续约
- 限制同一用户同时登录的客户端数量

## 前端项目

- [GitHub](https://github.com/RuixeWolf/vue-data-encryption)
- [Gitee](https://gitee.com/RuixeWolf/vue-data-encryption)

## 项目运行

### 生成 RSA 私钥与公钥

```shell
mkdir keys && cd keys
openssl genrsa -out rsa_1024_priv.pem 1024
openssl rsa -pubout -in rsa_1024_priv.pem -out rsa_1024_pub.pem
```

### 添加前端应用

```shell
mkdir frontendApp
cp /path/to/frontendProject/dist/* ./frontendApp
```

### 添加静态文件目录

```shell
mkdir static
```

### 配置数据库

- 设置 MongoDB URL 环境变量，环境变量名称默认为：`EXPRESS_MONGODB_URL`
- MongoDB URL 环境变量内容为：`mongodb://[user]:[password]@[host]:[port]/[dbName]?authSource=[dbName]`

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
