# 9Rabbit电子商务平台 - 后端API

这是9Rabbit电子商务平台的后端API服务，提供了完整的电子商务功能，包括用户认证、商品管理、购物车操作、订单处理等功能。

## 技术栈

- **Node.js** - JavaScript运行时环境
- **Express.js** - Web应用框架
- **Prisma ORM** - 数据库ORM工具
- **PostgreSQL** - 关系型数据库
- **JWT** - 用户认证
- **Bcrypt** - 密码加密

## 项目结构

```
backend/
├── prisma/                # Prisma配置和迁移文件
│   ├── schema.prisma      # 数据库模式定义
│   └── migrations/        # 数据库迁移记录
├── src/
│   ├── config/            # 配置文件
│   │   └── db.js          # 数据库配置
│   ├── controllers/       # 控制器（业务逻辑）
│   │   ├── auth.controller.js    # 认证相关功能
│   │   ├── cart.controller.js    # 购物车相关功能
│   │   ├── category.controller.js # 分类相关功能
│   │   ├── order.controller.js   # 订单相关功能
│   │   ├── product.controller.js # 商品相关功能
│   │   └── user.controller.js    # 用户相关功能
│   ├── middleware/        # 中间件
│   │   ├── auth.js        # 身份验证中间件
│   │   └── errorHandler.js # 错误处理中间件
│   ├── routes/            # 路由定义
│   │   ├── auth.routes.js      # 认证路由
│   │   ├── cart.routes.js      # 购物车路由
│   │   ├── category.routes.js  # 分类路由
│   │   ├── order.routes.js     # 订单路由
│   │   ├── product.routes.js   # 商品路由
│   │   └── user.routes.js      # 用户路由
│   └── index.js           # 应用入口文件
├── .env                   # 环境变量
├── package.json           # 项目依赖
└── README.md              # 项目说明
```

## 安装和设置

1. **安装依赖**

```bash
cd backend
npm install
```

2. **配置环境变量**

创建一个`.env`文件在项目根目录，并添加以下变量：

```env
# 应用设置
PORT=4000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# 数据库设置
DATABASE_URL="postgresql://username:password@localhost:5432/9rabbit?schema=public"

# JWT设置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

3. **生成Prisma客户端**

```bash
npx prisma generate
```

4. **应用数据库迁移**

```bash
npx prisma migrate dev
```

## 运行开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:4000` 上运行。

## API文档

### 认证API

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/refresh-token` - 刷新访问令牌
- `POST /api/auth/forgot-password` - 请求密码重置
- `POST /api/auth/reset-password` - 使用重置令牌重置密码
- `PUT /api/auth/change-password` - 修改密码
- `POST /api/auth/logout` - 用户登出

### 用户API

#### 用户档案
- `GET /api/users/profile` - 获取当前用户的个人资料
- `PUT /api/users/profile` - 更新当前用户的个人资料
- `DELETE /api/users/profile` - 删除当前用户的账户

#### 地址管理
- `GET /api/users/addresses` - 获取当前用户的地址列表
- `POST /api/users/addresses` - 创建新地址
- `PUT /api/users/addresses/:id` - 更新地址
- `DELETE /api/users/addresses/:id` - 删除地址
- `PUT /api/users/addresses/:id/default` - 设置默认地址

#### 管理员功能
- `GET /api/users` - 获取所有用户（管理员功能）
- `GET /api/users/:id` - 根据ID获取用户信息（管理员功能）
- `PUT /api/users/:id` - 根据ID更新用户信息（管理员功能）
- `DELETE /api/users/:id` - 根据ID删除用户（管理员功能）

### 商品API

- `GET /api/products` - 获取所有商品
- `GET /api/products/featured` - 获取推荐商品
- `GET /api/products/search` - 搜索商品
- `GET /api/products/:id` - 根据ID获取商品详情
- `POST /api/products` - 创建新商品（管理员功能）
- `PUT /api/products/:id` - 更新商品（管理员功能）
- `DELETE /api/products/:id` - 删除商品（管理员功能）
- `POST /api/products/:id/favorite` - 添加或移除商品收藏
- `GET /api/products/favorites` - 获取用户收藏的商品

### 分类API

- `GET /api/categories` - 获取所有分类
- `GET /api/categories/:id` - 根据ID获取分类
- `GET /api/categories/:id/products` - 获取分类下的商品
- `POST /api/categories` - 创建新分类（管理员功能）
- `PUT /api/categories/:id` - 更新分类（管理员功能）
- `DELETE /api/categories/:id` - 删除分类（管理员功能）

### 订单API

- `POST /api/orders` - 创建新订单
- `GET /api/orders/my` - 获取当前用户的所有订单
- `GET /api/orders/:id` - 获取订单详情
- `POST /api/orders/:id/cancel` - 取消订单
- `POST /api/orders/:id/payment` - 处理订单支付
- `GET /api/orders` - 获取所有订单（管理员功能）
- `PUT /api/orders/:id/status` - 更新订单状态（管理员功能）

### 购物车API

- `GET /api/cart` - 获取当前用户的购物车
- `POST /api/cart/items` - 添加商品到购物车
- `PUT /api/cart/items/:itemId` - 更新购物车中的商品数量
- `DELETE /api/cart/items/:itemId` - 从购物车中移除商品
- `DELETE /api/cart` - 清空购物车