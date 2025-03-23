const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // 查询所有商品
    const products = await prisma.product.findMany({
      orderBy: { id: 'asc' },
      include: {
        category: true
      }
    });
    
    console.log('====== 数据库中的商品数据 ======');
    console.log(`总计: ${products.length} 个商品\n`);
    
    for (const product of products) {
      console.log(`ID: ${product.id}`);
      console.log(`名称: ${product.name}`);
      console.log(`价格: ${product.price}¥ ${product.comparePrice ? `(原价: ${product.comparePrice}¥)` : ''}`);
      console.log(`库存: ${product.stock}`);
      console.log(`分类: ${product.category.name}`);
      console.log(`描述: ${product.description || '无描述'}`);
      console.log(`精选: ${product.featured ? '是' : '否'}`);
      console.log(`状态: ${product.stock > 0 ? '在售' : '缺货'}`);
      console.log('=========================================');
    }
    
    // 查询分类信息
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
    
    console.log('\n====== 商品分类 ======');
    for (const category of categories) {
      console.log(`分类名称: ${category.name}`);
      console.log(`商品数量: ${category._count.products}`);
      console.log('-------------------------');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 