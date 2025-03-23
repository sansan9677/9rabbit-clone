const { prisma } = require('../config/db');
const { 
  generateToken,
  hashPassword, 
  comparePassword 
} = require('../config/auth');

/**
 * 用户注册
 */
const register = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '该邮箱已被注册'
      });
    }

    // 哈希密码
    const hashedPassword = await hashPassword(password);

    // 创建新用户
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: 'CUSTOMER'
      }
    });

    // 创建用户的购物车
    await prisma.cart.create({
      data: {
        userId: newUser.id
      }
    });

    // 生成令牌
    const token = generateToken(newUser);

    // 从返回结果中排除密码
    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: '注册过程中发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 用户登录
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '无效的邮箱或密码'
      });
    }

    // 验证密码
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '无效的邮箱或密码'
      });
    }

    // 生成令牌
    const token = generateToken(user);

    // 从返回结果中排除密码
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: '登录成功',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: '登录过程中发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 刷新令牌
 */
const refreshToken = async (req, res) => {
  try {
    // 这里假设用户已经通过某种方式认证（例如，刷新令牌）
    // 实际应用中可能需要更复杂的逻辑
    const { userId } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 生成新令牌
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: '令牌刷新成功',
      data: { token }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(500).json({
      success: false,
      message: '刷新令牌过程中发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 忘记密码
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 检查用户是否存在
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // 为了安全，即使用户不存在，也返回成功
      return res.status(200).json({
        success: true,
        message: '如果该邮箱已注册，您将收到重置密码的邮件'
      });
    }

    // 在实际应用中，您应该:
    // 1. 生成密码重置令牌
    // 2. 将令牌存储在数据库中
    // 3. 发送包含重置链接的电子邮件

    return res.status(200).json({
      success: true,
      message: '如果该邮箱已注册，您将收到重置密码的邮件'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      message: '处理忘记密码请求时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 重置密码
 */
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // 在实际应用中，您应该:
    // 1. 验证令牌
    // 2. 确保令牌没有过期
    // 3. 找到与令牌关联的用户

    // 这里为简化示例，假设我们已经找到了用户
    const userId = 'mock-user-id';

    // 哈希新密码
    const hashedPassword = await hashPassword(newPassword);

    // 更新用户密码
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return res.status(200).json({
      success: true,
      message: '密码已成功重置'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      message: '重置密码过程中发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 修改密码
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    // 验证当前密码
    const isPasswordValid = await comparePassword(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '当前密码不正确'
      });
    }

    // 哈希新密码
    const hashedPassword = await hashPassword(newPassword);

    // 更新密码
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return res.status(200).json({
      success: true,
      message: '密码已成功更新'
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({
      success: false,
      message: '更改密码过程中发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 登出
 */
const logout = async (req, res) => {
  try {
    // 在无状态 JWT 认证中，客户端只需丢弃令牌
    // 但为了增强安全性，可以实现令牌黑名单
    
    return res.status(200).json({
      success: true,
      message: '已成功登出'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: '登出过程中发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  logout
}; 