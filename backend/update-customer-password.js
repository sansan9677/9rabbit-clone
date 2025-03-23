const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function updateCustomerPassword() {
  try {
    // 查找客户账号
    const customer = await prisma.user.findUnique({
      where: { email: 'customer@example.com' }
    });

    if (!customer) {
      console.error('未找到用户:', 'customer@example.com');
      return;
    }

    console.log('找到用户:', {
      id: customer.id,
      email: customer.email,
      role: customer.role
    });

    // 使用相同的加密方式
    const newPassword = 'password123'; // 与test@example.com使用相同的密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    console.log('旧密码哈希:', customer.password);
    console.log('新密码哈希:', hashedPassword);
    
    // 更新用户密码
    const updatedUser = await prisma.user.update({
      where: { email: 'customer@example.com' },
      data: { password: hashedPassword }
    });
    
    console.log('用户密码已更新:', updatedUser.email);
    console.log('如果用户购物车不存在，创建一个');
    
    // 确保该用户有购物车
    await prisma.cart.upsert({
      where: { userId: updatedUser.id },
      update: {},
      create: { userId: updatedUser.id }
    });
    
    console.log('用户数据更新完成，现在可以用密码 "password123" 登录');
  } catch (error) {
    console.error('更新用户密码失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateCustomerPassword(); 