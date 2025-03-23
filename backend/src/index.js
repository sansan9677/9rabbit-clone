const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { testConnection } = require('./config/db');

// 加载环境变量
dotenv.config();

// 导入路由
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const orderRoutes = require('./routes/order.routes');
const cartRoutes = require('./routes/cart.routes');

// 创建Express应用
const app = express();

// 设置中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet()); // 增强安全性
app.use(morgan('dev')); // 日志记录

// 配置CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 基本路由
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '欢迎使用9Rabbit电子商务API',
    version: '1.0.0'
  });
});

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);

// 404处理
app.use(notFound);

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  
  // 测试数据库连接
  await testConnection();
});

// 处理未捕获的异常
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常：', err);
  process.exit(1);
});

// 处理未捕获的Promise拒绝
process.on('unhandledRejection', (err) => {
  console.error('未处理的Promise拒绝：', err);
  process.exit(1);
}); 