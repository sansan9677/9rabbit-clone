const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // 创建用户
    const admin = await prisma.user.create({
      data: {
        id: '5edaaaec-7a35-4da4-911d-1a18a58fcd0a',
        email: 'admin@example.com',
        password: '$2a$10$eMeIfHzM9Wj/T8PkI.fFm.vXeJwkf82Gq4b/5LZM2cxqQ7B8KbWau', // 123456
        name: '管理员',
        phone: '13800138000',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        role: 'ADMIN',
      },
    });

    const customer = await prisma.user.create({
      data: {
        id: '82bb1fcbca1c56e6dcb5f878acf6f55f',
        email: 'customer@example.com',
        password: '$2a$10$eMeIfHzM9Wj/T8PkI.fFm.vXeJwkf82Gq4b/5LZM2cxqQ7B8KbWau', // 123456
        name: '测试用户',
        phone: '13900139000',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        role: 'CUSTOMER',
      },
    });

    const merchant = await prisma.user.create({
      data: {
        id: '202503230852232_兔子',
        email: 'merchant@example.com',
        password: '$2a$10$eMeIfHzM9Wj/T8PkI.fFm.vXeJwkf82Gq4b/5LZM2cxqQ7B8KbWau', // 123456
        name: '商家用户',
        phone: '13700137000',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        role: 'MERCHANT',
      },
    });

    console.log('用户创建完成');

    // 创建分类
    const electronics = await prisma.category.create({
      data: {
        id: 'c1',
        name: '电子产品',
        image: 'https://example.com/images/electronics.jpg',
      },
    });

    const clothing = await prisma.category.create({
      data: {
        id: 'c2',
        name: '服装',
        image: 'https://example.com/images/clothing.jpg',
      },
    });

    const food = await prisma.category.create({
      data: {
        id: 'c3',
        name: '食品',
        image: 'https://example.com/images/food.jpg',
      },
    });

    // 子分类
    const phones = await prisma.category.create({
      data: {
        id: 'c4',
        name: '手机',
        image: 'https://example.com/images/phones.jpg',
        parentId: 'c1',
      },
    });

    const computers = await prisma.category.create({
      data: {
        id: 'c5',
        name: '电脑',
        image: 'https://example.com/images/computers.jpg',
        parentId: 'c1',
      },
    });

    const mensClothing = await prisma.category.create({
      data: {
        id: 'c6',
        name: '男装',
        image: 'https://example.com/images/mens.jpg',
        parentId: 'c2',
      },
    });

    const womensClothing = await prisma.category.create({
      data: {
        id: 'c7',
        name: '女装',
        image: 'https://example.com/images/womens.jpg',
        parentId: 'c2',
      },
    });

    console.log('分类创建完成');

    // 创建产品
    const iphone = await prisma.product.create({
      data: {
        id: 'p1',
        name: 'iPhone 14 Pro',
        description: '最新款iPhone，搭载A16芯片',
        price: 6999.00,
        comparePrice: 7999.00,
        stock: 100,
        images: [
          'https://example.com/images/iphone14pro_1.jpg',
          'https://example.com/images/iphone14pro_2.jpg'
        ],
        categoryId: 'c4',
        featured: true,
      },
    });

    const macbook = await prisma.product.create({
      data: {
        id: 'p2',
        name: 'MacBook Pro 14"',
        description: 'M2 Pro芯片，16GB内存，512GB存储',
        price: 14999.00,
        comparePrice: 15999.00,
        stock: 50,
        images: [
          'https://example.com/images/macbookpro_1.jpg',
          'https://example.com/images/macbookpro_2.jpg'
        ],
        categoryId: 'c5',
        featured: true,
      },
    });

    const shirt = await prisma.product.create({
      data: {
        id: 'p3',
        name: '男士休闲衬衫',
        description: '100%纯棉，舒适透气',
        price: 199.00,
        comparePrice: 299.00,
        stock: 200,
        images: [
          'https://example.com/images/shirt_1.jpg',
          'https://example.com/images/shirt_2.jpg'
        ],
        categoryId: 'c6',
        featured: false,
      },
    });

    const dress = await prisma.product.create({
      data: {
        id: 'p4',
        name: '女士连衣裙',
        description: '夏季新款，清凉舒适',
        price: 299.00,
        comparePrice: 399.00,
        stock: 150,
        images: [
          'https://example.com/images/dress_1.jpg',
          'https://example.com/images/dress_2.jpg'
        ],
        categoryId: 'c7',
        featured: true,
      },
    });

    const fruitBox = await prisma.product.create({
      data: {
        id: 'p5',
        name: '有机水果礼盒',
        description: '精选有机水果，健康美味',
        price: 199.00,
        comparePrice: 299.00,
        stock: 30,
        images: [
          'https://example.com/images/fruitbox_1.jpg',
          'https://example.com/images/fruitbox_2.jpg'
        ],
        categoryId: 'c3',
        featured: false,
      },
    });

    console.log('产品创建完成');

    // 创建地址
    const address1 = await prisma.address.create({
      data: {
        id: 'a1',
        street: '中关村大街1号',
        city: '北京市',
        state: '北京',
        zipCode: '100080',
        country: '中国',
        isDefault: true,
        userId: customer.id,
      },
    });

    const address2 = await prisma.address.create({
      data: {
        id: 'a2',
        street: '南京路123号',
        city: '上海市',
        state: '上海',
        zipCode: '200001',
        country: '中国',
        isDefault: false,
        userId: customer.id,
      },
    });

    const address3 = await prisma.address.create({
      data: {
        id: 'a3',
        street: '天河路45号',
        city: '广州市',
        state: '广东省',
        zipCode: '510000',
        country: '中国',
        isDefault: true,
        userId: merchant.id,
      },
    });

    console.log('地址创建完成');

    // 创建购物车
    const cart = await prisma.cart.create({
      data: {
        id: 'cart1',
        userId: customer.id,
        items: {
          create: [
            {
              id: 'ci1',
              productId: 'p1',
              quantity: 1,
            },
            {
              id: 'ci2',
              productId: 'p3',
              quantity: 2,
            },
          ],
        },
      },
    });

    console.log('购物车创建完成');

    // 创建收藏
    const favorite1 = await prisma.favoriteItem.create({
      data: {
        id: 'f1',
        userId: customer.id,
        productId: 'p2',
      },
    });

    const favorite2 = await prisma.favoriteItem.create({
      data: {
        id: 'f2',
        userId: customer.id,
        productId: 'p4',
      },
    });

    const favorite3 = await prisma.favoriteItem.create({
      data: {
        id: 'f3',
        userId: merchant.id,
        productId: 'p1',
      },
    });

    console.log('收藏创建完成');

    // 创建订单
    const order1 = await prisma.order.create({
      data: {
        id: 'o1',
        userId: customer.id,
        totalAmount: 7198.00,
        status: 'DELIVERED',
        addressId: 'a1',
        paymentMethod: 'Alipay',
        paymentId: 'pay_123456',
        createdAt: new Date('2023-01-15T10:30:00Z'),
        items: {
          create: [
            {
              id: 'oi1',
              productId: 'p1',
              quantity: 1,
              price: 6999.00,
              createdAt: new Date('2023-01-15T10:30:00Z'),
            },
            {
              id: 'oi2',
              productId: 'p3',
              quantity: 1,
              price: 199.00,
              createdAt: new Date('2023-01-15T10:30:00Z'),
            },
          ],
        },
      },
    });

    const order2 = await prisma.order.create({
      data: {
        id: 'o2',
        userId: customer.id,
        totalAmount: 199.00,
        status: 'SHIPPED',
        addressId: 'a1',
        paymentMethod: 'WeChat Pay',
        paymentId: 'pay_234567',
        createdAt: new Date('2023-02-20T14:20:00Z'),
        items: {
          create: [
            {
              id: 'oi3',
              productId: 'p3',
              quantity: 1,
              price: 199.00,
              createdAt: new Date('2023-02-20T14:20:00Z'),
            },
          ],
        },
      },
    });

    const order3 = await prisma.order.create({
      data: {
        id: 'o3',
        userId: merchant.id,
        totalAmount: 6999.00,
        status: 'PENDING',
        addressId: 'a3',
        paymentMethod: 'Credit Card',
        paymentId: 'pay_345678',
        items: {
          create: [
            {
              id: 'oi4',
              productId: 'p1',
              quantity: 1,
              price: 6999.00,
            },
          ],
        },
      },
    });

    console.log('订单创建完成');

    console.log('数据库填充完成！');
  } catch (error) {
    console.error('数据库填充过程中发生错误：', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 