const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true
      }
    });
    
    console.log('====== 数据库中的所有商品 ======');
    console.log(`总计: ${products.length} 个商品\n`);
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`商品 ${i+1}:`);
      console.log(`ID: ${product.id}`);
      console.log(`名称: ${product.name}`);
      console.log(`价格: ${product.price}¥ ${product.comparePrice ? `(原价: ${product.comparePrice}¥)` : ''}`);
      console.log(`库存: ${product.stock}`);
      console.log(`分类: ${product.category.name}`);
      console.log(`描述: ${product.description || '无描述'}`);
      console.log(`精选: ${product.featured ? '是' : '否'}`);
      console.log(`图片: ${product.images.join(', ')}`);
      console.log(`创建时间: ${new Date(product.createdAt).toLocaleString('zh-CN')}`);
      console.log('=========================================');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 