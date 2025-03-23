const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('开始更新商品图片URL...');
    
    // 定义一个映射关系，用真实可访问的图片替换测试URL
    const imageMapping = {
      'https://example.com/images/kistoy-polly-plus.jpg': 'https://ext.same-assets.com/3058330213/2058260766.jpeg',
      'https://example.com/images/monster-app-white.jpg': 'https://ext.same-assets.com/3058330213/2058260766.jpeg',
      'https://example.com/images/monster-app-tracking.jpg': 'https://ext.same-assets.com/3058330213/2058260766.jpeg',
      'https://example.com/images/monster-student-white.jpg': 'https://ext.same-assets.com/3058330213/2058260766.jpeg',
      'https://example.com/images/tryfun-smart.jpg': 'https://ext.same-assets.com/3058330213/3156523865.jpeg',
      'https://example.com/images/netease-app-controlled.jpg': 'https://ext.same-assets.com/3058330213/3156523865.jpeg',
      'https://example.com/images/toyheart-r20.jpg': 'https://ext.same-assets.com/3058330213/3156523865.jpeg',
      'https://example.com/images/tokyo-electric.jpg': 'https://ext.same-assets.com/3058330213/3156523865.jpeg'
    };
    
    // 获取所有商品
    const products = await prisma.product.findMany();
    
    // 逐个更新商品图片
    for (const product of products) {
      const updatedImages = product.images.map(img => imageMapping[img] || img);
      
      await prisma.product.update({
        where: { id: product.id },
        data: { images: updatedImages }
      });
      
      console.log(`已更新商品 "${product.name}" 的图片:`);
      console.log(`  原图片: ${JSON.stringify(product.images)}`);
      console.log(`  新图片: ${JSON.stringify(updatedImages)}`);
    }
    
    console.log('\n图片URL更新成功！');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 