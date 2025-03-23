-- 添加用户数据
INSERT INTO "User" (id, email, password, name, phone, avatar, role, "createdAt", "updatedAt") VALUES
('5edaaaec-7a35-4da4-911d-1a18a58fcd0a', 'admin@example.com', '$2a$10$eMeIfHzM9Wj/T8PkI.fFm.vXeJwkf82Gq4b/5LZM2cxqQ7B8KbWau', '管理员', '13800138000', 'https://randomuser.me/api/portraits/men/1.jpg', 'ADMIN', NOW(), NOW()),
('82bb1fcbca1c56e6dcb5f878acf6f55f', 'customer@example.com', '$2a$10$eMeIfHzM9Wj/T8PkI.fFm.vXeJwkf82Gq4b/5LZM2cxqQ7B8KbWau', '测试用户', '13900139000', 'https://randomuser.me/api/portraits/women/1.jpg', 'CUSTOMER', NOW(), NOW()),
('202503230852232_兔子', 'merchant@example.com', '$2a$10$eMeIfHzM9Wj/T8PkI.fFm.vXeJwkf82Gq4b/5LZM2cxqQ7B8KbWau', '商家用户', '13700137000', 'https://randomuser.me/api/portraits/men/2.jpg', 'MERCHANT', NOW(), NOW());

-- 添加分类数据
INSERT INTO "Category" (id, name, image, "parentId", "createdAt", "updatedAt") VALUES
('c1', '电子产品', 'https://example.com/images/electronics.jpg', NULL, NOW(), NOW()),
('c2', '服装', 'https://example.com/images/clothing.jpg', NULL, NOW(), NOW()),
('c3', '食品', 'https://example.com/images/food.jpg', NULL, NOW(), NOW()),
('c4', '手机', 'https://example.com/images/phones.jpg', 'c1', NOW(), NOW()),
('c5', '电脑', 'https://example.com/images/computers.jpg', 'c1', NOW(), NOW()),
('c6', '男装', 'https://example.com/images/mens.jpg', 'c2', NOW(), NOW()),
('c7', '女装', 'https://example.com/images/womens.jpg', 'c2', NOW(), NOW());

-- 添加产品数据
INSERT INTO "Product" (id, name, description, price, "comparePrice", stock, images, "categoryId", featured, "createdAt", "updatedAt") VALUES
('p1', 'iPhone 14 Pro', '最新款iPhone，搭载A16芯片', 6999.00, 7999.00, 100, ARRAY['https://example.com/images/iphone14pro_1.jpg', 'https://example.com/images/iphone14pro_2.jpg'], 'c4', true, NOW(), NOW()),
('p2', 'MacBook Pro 14"', 'M2 Pro芯片，16GB内存，512GB存储', 14999.00, 15999.00, 50, ARRAY['https://example.com/images/macbookpro_1.jpg', 'https://example.com/images/macbookpro_2.jpg'], 'c5', true, NOW(), NOW()),
('p3', '男士休闲衬衫', '100%纯棉，舒适透气', 199.00, 299.00, 200, ARRAY['https://example.com/images/shirt_1.jpg', 'https://example.com/images/shirt_2.jpg'], 'c6', false, NOW(), NOW()),
('p4', '女士连衣裙', '夏季新款，清凉舒适', 299.00, 399.00, 150, ARRAY['https://example.com/images/dress_1.jpg', 'https://example.com/images/dress_2.jpg'], 'c7', true, NOW(), NOW()),
('p5', '有机水果礼盒', '精选有机水果，健康美味', 199.00, 299.00, 30, ARRAY['https://example.com/images/fruitbox_1.jpg', 'https://example.com/images/fruitbox_2.jpg'], 'c3', false, NOW(), NOW());

-- 添加地址数据
INSERT INTO "Address" (id, street, city, state, "zipCode", country, "isDefault", "userId", "createdAt", "updatedAt") VALUES
('a1', '中关村大街1号', '北京市', '北京', '100080', '中国', true, '82bb1fcbca1c56e6dcb5f878acf6f55f', NOW(), NOW()),
('a2', '南京路123号', '上海市', '上海', '200001', '中国', false, '82bb1fcbca1c56e6dcb5f878acf6f55f', NOW(), NOW()),
('a3', '天河路45号', '广州市', '广东省', '510000', '中国', true, '202503230852232_兔子', NOW(), NOW());

-- 添加购物车数据
INSERT INTO "Cart" (id, "userId", "createdAt", "updatedAt") VALUES
('cart1', '82bb1fcbca1c56e6dcb5f878acf6f55f', NOW(), NOW());

-- 添加购物车商品数据
INSERT INTO "CartItem" (id, "cartId", "productId", quantity, "createdAt", "updatedAt") VALUES
('ci1', 'cart1', 'p1', 1, NOW(), NOW()),
('ci2', 'cart1', 'p3', 2, NOW(), NOW());

-- 添加收藏商品数据
INSERT INTO "FavoriteItem" (id, "userId", "productId", "createdAt") VALUES
('f1', '82bb1fcbca1c56e6dcb5f878acf6f55f', 'p2', NOW()),
('f2', '82bb1fcbca1c56e6dcb5f878acf6f55f', 'p4', NOW()),
('f3', '202503230852232_兔子', 'p1', NOW());

-- 添加订单数据
INSERT INTO "Order" (id, "userId", "totalAmount", status, "addressId", "paymentMethod", "paymentId", "createdAt", "updatedAt") VALUES
('o1', '82bb1fcbca1c56e6dcb5f878acf6f55f', 7198.00, 'DELIVERED', 'a1', 'Alipay', 'pay_123456', '2023-01-15 10:30:00', NOW()),
('o2', '82bb1fcbca1c56e6dcb5f878acf6f55f', 199.00, 'SHIPPED', 'a1', 'WeChat Pay', 'pay_234567', '2023-02-20 14:20:00', NOW()),
('o3', '202503230852232_兔子', 6999.00, 'PENDING', 'a3', 'Credit Card', 'pay_345678', NOW(), NOW());

-- 添加订单项数据
INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, price, "createdAt", "updatedAt") VALUES
('oi1', 'o1', 'p1', 1, 6999.00, '2023-01-15 10:30:00', NOW()),
('oi2', 'o1', 'p3', 1, 199.00, '2023-01-15 10:30:00', NOW()),
('oi3', 'o2', 'p3', 1, 199.00, '2023-02-20 14:20:00', NOW()),
('oi4', 'o3', 'p1', 1, 6999.00, NOW(), NOW()); 