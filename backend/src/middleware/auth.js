const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');

/**
 * 验证用户身份
 * 该中间件从请求头中获取JWT令牌，验证令牌有效性，并将用户信息附加到req对象
 */
const authenticate = async (req, res, next) => {
  try {
    // 从请求头或cookie中获取令牌
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未提供访问令牌，认证失败'
      });
    }
    
    // 验证令牌
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 从数据库中获取用户
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: '用户不存在或令牌无效'
        });
      }
      
      // 将用户信息附加到req对象
      req.user = user;
      req.token = token;
      
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: '访问令牌无效或已过期'
      });
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({
      success: false,
      message: '身份验证过程中发生错误'
    });
  }
};

/**
 * 验证用户角色权限
 * 该中间件检查用户是否具有指定的角色
 * @param {...string} roles - 允许访问的角色列表
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未通过身份验证，请先登录'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: '权限不足，无法访问此资源'
      });
    }
    
    next();
  };
};

module.exports = {
  authenticate,
  authorize
}; 