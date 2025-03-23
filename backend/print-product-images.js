const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('====== 检查数据库中的商品图片URL ======');
    
    const products = await prisma.product.findMany({
      include: {
        category: true
      }
    });
    
    for (const product of products) {
      console.log(`\n商品 ID: ${product.id}`);
      console.log(`名称: ${product.name}`);
      console.log(`图片URLs: ${JSON.stringify(product.images)}`);
    }
    
    console.log('\n====== 检查完成 ======');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 