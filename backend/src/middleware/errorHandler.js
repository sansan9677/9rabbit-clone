/**
 * 自定义错误类，用于携带状态码和错误信息
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // 标记是否为操作性错误

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 捕获Prisma错误并返回友好的错误信息
 */
const handlePrismaError = (err) => {
  // 记录原始错误
  console.error('Prisma error details:', err);

  // 处理常见的Prisma错误类型
  if (err.code === 'P2002') {
    // 唯一约束错误
    const field = err.meta?.target?.[0] || 'field';
    return new AppError(`${field} 已存在，请使用其他值`, 400);
  }

  if (err.code === 'P2025') {
    // 记录未找到
    return new AppError('请求的资源不存在', 404);
  }

  // 通用情况
  return new AppError('数据库操作错误', 500);
};

/**
 * 开发环境错误处理
 */
const sendErrorDev = (err, res) => {
  return res.status(err.statusCode || 500).json({
    success: false,
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

/**
 * 生产环境错误处理
 */
const sendErrorProd = (err, res) => {
  // 操作性错误: 发送给客户端
  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({
      success: false,
      status: err.status,
      message: err.message
    });
  }

  // 非操作性错误: 不暴露详细信息给客户端
  console.error('ERROR 💥', err);
  return res.status(500).json({
    success: false,
    status: 'error',
    message: '服务器内部错误'
  });
};

/**
 * 主错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // 基于环境处理错误
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // 处理Prisma错误
    if (err.name === 'PrismaClientKnownRequestError' || 
        err.name === 'PrismaClientValidationError' || 
        err.name === 'PrismaClientInitializationError') {
      error = handlePrismaError(err);
    }

    // JWT错误
    if (err.name === 'JsonWebTokenError') {
      error = new AppError('无效的令牌，请重新登录', 401);
    }

    if (err.name === 'TokenExpiredError') {
      error = new AppError('令牌已过期，请重新登录', 401);
    }

    sendErrorProd(error, res);
  }
};

/**
 * 404错误处理中间件
 */
const notFound = (req, res, next) => {
  const err = new AppError(`找不到 ${req.originalUrl} 路径`, 404);
  next(err);
};

/**
 * 捕获未处理的异步错误
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  AppError,
  errorHandler,
  notFound,
  asyncHandler
}; 