const { prisma } = require('../config/db');

/**
 * 获取当前用户的购物车
 */
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 查找用户的购物车，如果不存在则创建
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
    }
    
    // 计算总价和项目总数
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    return res.status(200).json({
      success: true,
      data: {
        ...cart,
        totalItems,
        totalAmount
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    return res.status(500).json({
      success: false,
      message: '获取购物车时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 添加商品到购物车
 */
const addItemToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;
    
    // 验证商品是否存在
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在'
      });
    }
    
    // 验证库存
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `商品库存不足，当前库存: ${product.stock}`
      });
    }
    
    // 查找或创建购物车
    let cart = await prisma.cart.findUnique({
      where: { userId }
    });
    
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId }
      });
    }
    
    // 检查购物车中是否已有该商品
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId
      }
    });
    
    let cartItem;
    
    if (existingItem) {
      // 更新商品数量
      const newQuantity = existingItem.quantity + quantity;
      
      // 再次检查库存
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `商品库存不足，当前库存: ${product.stock}`
        });
      }
      
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: { product: true }
      });
    } else {
      // 创建新的购物车商品
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        },
        include: { product: true }
      });
    }
    
    // 获取更新后的购物车
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    // 计算总价和项目总数
    const totalItems = updatedCart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = updatedCart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    return res.status(200).json({
      success: true,
      message: '商品已添加到购物车',
      data: {
        ...updatedCart,
        totalItems,
        totalAmount
      }
    });
  } catch (error) {
    console.error('Add item to cart error:', error);
    return res.status(500).json({
      success: false,
      message: '添加商品到购物车时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 更新购物车中的商品数量
 */
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;
    
    // 验证数量是否有效
    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: '商品数量必须大于0'
      });
    }
    
    // 查找购物车
    const cart = await prisma.cart.findUnique({
      where: { userId }
    });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: '购物车不存在'
      });
    }
    
    // 查找购物车商品
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id
      },
      include: { product: true }
    });
    
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: '购物车商品不存在'
      });
    }
    
    // 验证库存
    if (cartItem.product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `商品库存不足，当前库存: ${cartItem.product.stock}`
      });
    }
    
    // 更新商品数量
    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { product: true }
    });
    
    // 获取更新后的购物车
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    // 计算总价和项目总数
    const totalItems = updatedCart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = updatedCart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    return res.status(200).json({
      success: true,
      message: '购物车商品已更新',
      data: {
        ...updatedCart,
        totalItems,
        totalAmount
      }
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    return res.status(500).json({
      success: false,
      message: '更新购物车商品时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 从购物车中移除商品
 */
const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    
    // 查找购物车
    const cart = await prisma.cart.findUnique({
      where: { userId }
    });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: '购物车不存在'
      });
    }
    
    // 查找购物车商品
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id
      }
    });
    
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: '购物车商品不存在'
      });
    }
    
    // 删除商品
    await prisma.cartItem.delete({
      where: { id: itemId }
    });
    
    // 获取更新后的购物车
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    // 计算总价和项目总数
    const totalItems = updatedCart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = updatedCart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    return res.status(200).json({
      success: true,
      message: '商品已从购物车中移除',
      data: {
        ...updatedCart,
        totalItems,
        totalAmount
      }
    });
  } catch (error) {
    console.error('Remove cart item error:', error);
    return res.status(500).json({
      success: false,
      message: '从购物车中移除商品时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 清空购物车
 */
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 查找购物车
    const cart = await prisma.cart.findUnique({
      where: { userId }
    });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: '购物车不存在'
      });
    }
    
    // 删除所有购物车商品
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });
    
    return res.status(200).json({
      success: true,
      message: '购物车已清空',
      data: {
        id: cart.id,
        userId,
        items: [],
        totalItems: 0,
        totalAmount: 0
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    return res.status(500).json({
      success: false,
      message: '清空购物车时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart
}; 