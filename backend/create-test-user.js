const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function createTestUser() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        role: 'CUSTOMER'
      }
    });
    
    console.log('测试用户已创建:', user);
    
    // 创建用户的购物车
    await prisma.cart.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id }
    });
    
    console.log('用户购物车已创建');
  } catch (error) {
    console.error('创建测试用户失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser(); 