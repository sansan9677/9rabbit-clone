const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('开始修复商品数据...');
    
    // 修复商品7的数据
    await prisma.product.update({
      where: { id: '7' },
      data: {
        description: '经典设计，舒适体验',
        price: 70.00,
        comparePrice: 101.00,
        stock: 30,
        images: ['https://example.com/images/toyheart-r20.jpg'],
        featured: true
      }
    });
    console.log('已修复商品7的数据');
    
    // 检查商品8是否存在，如果不存在则创建
    const product8 = await prisma.product.findUnique({
      where: { id: '8' }
    });
    
    if (!product8) {
      // 获取男性玩具分类
      const maleCategory = await prisma.category.findFirst({
        where: { name: '男性玩具' }
      });
      
      if (maleCategory) {
        await prisma.product.create({
          data: {
            id: '8',
            name: '谜姬杯卡有爱的印象东京名器使用电动飞机杯-三',
            description: '东京设计，电动体验，多功能使用',
            price: 101.00,
            comparePrice: 133.00,
            stock: 15,
            images: ['https://example.com/images/tokyo-electric.jpg'],
            categoryId: maleCategory.id,
            featured: false
          }
        });
        console.log('已创建商品8');
      }
    }
    
    // 删除旧的未使用分类
    const unusedCategories = [
      '电子产品', '服装', '食品', '手机', '电脑', '男装', '女装'
    ];
    
    for (const categoryName of unusedCategories) {
      const category = await prisma.category.findFirst({
        where: { name: categoryName },
        include: {
          _count: {
            select: { products: true }
          }
        }
      });
      
      if (category && category._count.products === 0) {
        // 检查是否有子分类
        const childCategories = await prisma.category.findMany({
          where: { parentId: category.id }
        });
        
        if (childCategories.length === 0) {
          await prisma.category.delete({
            where: { id: category.id }
          });
          console.log(`已删除未使用的分类: ${categoryName}`);
        } else {
          console.log(`分类 ${categoryName} 有子分类，跳过删除`);
        }
      }
    }
    
    console.log('数据修复完成');
    
    // 验证商品数据
    const products = await prisma.product.findMany({
      orderBy: { id: 'asc' },
      include: {
        category: true
      }
    });
    
    console.log('\n====== 修复后的商品数据 ======');
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
    
    console.log('\n====== 修复后的商品分类 ======');
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