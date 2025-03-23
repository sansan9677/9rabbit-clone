const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // 首先删除相关的外键引用
    console.log('正在删除相关的引用数据...');
    
    // 删除订单项
    await prisma.orderItem.deleteMany({});
    console.log('- 已删除所有订单项');
    
    // 删除购物车项
    await prisma.cartItem.deleteMany({});
    console.log('- 已删除所有购物车项');
    
    // 删除收藏项
    await prisma.favoriteItem.deleteMany({});
    console.log('- 已删除所有收藏项');
    
    // 然后清空当前的商品数据
    await prisma.product.deleteMany({});
    console.log('已清空原有商品数据');
    
    // 确保分类存在
    const femaleCategory = await prisma.category.upsert({
      where: { name: '女性玩具' },
      update: {},
      create: {
        name: '女性玩具',
        image: 'https://example.com/images/female-toys.jpg'
      }
    });
    
    const maleCategory = await prisma.category.upsert({
      where: { name: '男性玩具' },
      update: {},
      create: {
        name: '男性玩具',
        image: 'https://example.com/images/male-toys.jpg'
      }
    });
    
    console.log('已确保分类存在');

    // 定义新的商品数据
    const productsData = [
      {
        id: '1',
        name: 'KISTOY Polly Plus二代仿爱欲吸棒器',
        description: '最新款女性玩具，舒适体验',
        price: 86.00,
        comparePrice: 123.00,
        stock: 25,
        images: [
          'https://example.com/images/kistoy-polly-plus.jpg'
        ],
        categoryId: femaleCategory.id,
        featured: true
      },
      {
        id: '2',
        name: '小怪兽魔吮初型版HPV吸吮APP远程控制陶瓷白',
        description: '智能远程控制，APP互动体验',
        price: 117.00,
        comparePrice: 156.00,
        stock: 18,
        images: [
          'https://example.com/images/monster-app-white.jpg'
        ],
        categoryId: femaleCategory.id,
        featured: false
      },
      {
        id: '3',
        name: '小怪兽魔吮初型版HPV智能APP远程追踪版动态',
        description: '追踪版本，动态体验，智能交互',
        price: 125.00,
        comparePrice: 156.00,
        stock: 12,
        images: [
          'https://example.com/images/monster-app-tracking.jpg'
        ],
        categoryId: femaleCategory.id,
        featured: true
      },
      {
        id: '4',
        name: '小怪兽抑菌版HPV学控型少女学机两色白夜版',
        description: '抑菌设计，学控型号，适合初学者',
        price: 62.00,
        comparePrice: 78.00,
        stock: 0,
        images: [
          'https://example.com/images/monster-student-white.jpg'
        ],
        categoryId: femaleCategory.id,
        featured: false
      },
      {
        id: '5',
        name: '网易春风TryFun元力2代智能延时伸缩元力版飞机杯',
        description: '智能延时，多功能伸缩，舒适体验',
        price: 312.00,
        comparePrice: 350.00,
        stock: 0,
        images: [
          'https://example.com/images/tryfun-smart.jpg'
        ],
        categoryId: maleCategory.id,
        featured: true
      },
      {
        id: '6',
        name: '网易春风型牌Plus全自动APP操控飞机杯-北美授权',
        description: 'APP远程操控，全自动体验，北美官方授权',
        price: 187.00,
        comparePrice: 212.00,
        stock: 7,
        images: [
          'https://example.com/images/netease-app-controlled.jpg'
        ],
        categoryId: maleCategory.id,
        featured: false
      },
      {
        id: '7',
        name: '对子哈特Toyheart R20飞机杯',
        description: '经典设计，舒适体验',
        price: 70.00,
        comparePrice: 101.00,
        stock: 30,
        images: [
          'https://example.com/images/toyheart-r20.jpg'
        ],
        categoryId: maleCategory.id,
        featured: true
      },
      {
        id: '8',
        name: '谜姬杯卡有爱的印象东京名器使用电动飞机杯-三',
        description: '东京设计，电动体验，多功能使用',
        price: 101.00,
        comparePrice: 133.00,
        stock: 15,
        images: [
          'https://example.com/images/tokyo-electric.jpg'
        ],
        categoryId: maleCategory.id,
        featured: false
      }
    ];
    
    // 批量创建商品
    for (const productData of productsData) {
      await prisma.product.create({
        data: productData
      });
    }
    
    console.log(`成功添加 ${productsData.length} 个新商品`);
    
    // 验证更新结果
    const updatedProducts = await prisma.product.findMany({
      include: {
        category: true
      }
    });
    
    console.log('\n====== 更新后的商品数据 ======');
    console.log(`总计: ${updatedProducts.length} 个商品\n`);
    
    for (let i = 0; i < updatedProducts.length; i++) {
      const product = updatedProducts[i];
      console.log(`商品 ${i+1}:`);
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
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 