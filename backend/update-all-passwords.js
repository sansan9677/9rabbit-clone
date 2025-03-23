const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

// 需要更新的用户列表
const usersToUpdate = [
  'admin@example.com',    // 管理员用户
  'merchant@example.com'  // 商家用户
];

async function updateUserPassword(email) {
  try {
    // 查找用户账号
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.error('未找到用户:', email);
      return false;
    }

    console.log('\n找到用户:', {
      id: user.id,
      email: user.email,
      role: user.role
    });

    // 使用标准加密方式
    const newPassword = 'password123'; // 统一使用相同的密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    console.log('旧密码哈希:', user.password);
    console.log('新密码哈希:', hashedPassword);
    
    // 更新用户密码
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });
    
    console.log('用户密码已更新:', updatedUser.email);
    
    // 确保该用户有购物车(如果是Customer或Merchant角色)
    if (user.role === 'CUSTOMER' || user.role === 'MERCHANT') {
      console.log('检查用户购物车...');
      await prisma.cart.upsert({
        where: { userId: updatedUser.id },
        update: {},
        create: { userId: updatedUser.id }
      });
      console.log('已确保用户购物车存在');
    }
    
    return true;
  } catch (error) {
    console.error(`更新用户 ${email} 密码失败:`, error);
    return false;
  }
}

async function updateAllPasswords() {
  console.log('开始更新所有用户密码...');
  
  let successCount = 0;
  
  for (const email of usersToUpdate) {
    const success = await updateUserPassword(email);
    if (success) successCount++;
  }
  
  console.log(`\n密码更新完成: ${successCount}/${usersToUpdate.length} 个用户已更新`);
  console.log('所有更新的用户现在可以使用密码 "password123" 登录');
  
  await prisma.$disconnect();
}

updateAllPasswords(); 