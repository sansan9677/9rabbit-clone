const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// JWT 配置
const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-this',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  algorithm: 'HS256'
};

// 生成 JWT token
const generateToken = (user) => {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    iat: Date.now() / 1000
  };

  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
    algorithm: jwtConfig.algorithm
  });
};

// 验证 JWT token
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    return { valid: true, expired: false, decoded };
  } catch (error) {
    return {
      valid: false,
      expired: error.message === 'jwt expired',
      decoded: null
    };
  }
};

// 密码加密
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// 密码验证
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
  jwtConfig,
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword
}; 