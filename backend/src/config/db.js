const { PrismaClient } = require('@prisma/client');

/**
 * 初始化Prisma客户端
 * 这里添加了日志选项，便于在开发环境中调试
 */
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

/**
 * 测试数据库连接
 */
const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log('✅ 数据库连接成功');
    return true;
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
    return false;
  }
};

module.exports = { 
  prisma,
  testConnection
}; 