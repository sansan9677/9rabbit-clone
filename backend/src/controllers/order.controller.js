const { prisma } = require('../config/db');

/**
 * 创建新订单
 */
const createOrder = async (req, res) => {
  try {
    const { addressId, items, paymentMethod } = req.body;
    const userId = req.user.id;

    // 验证地址是否存在且属于当前用户
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId
      }
    });

    if (!address) {
      return res.status(400).json({
        success: false,
        message: '地址不存在或不属于当前用户'
      });
    }

    // 验证商品是否存在且有库存
    const productIds = items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds }
      }
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: '部分商品不存在'
      });
    }

    // 检查库存并计算总金额
    let totalAmount = 0;
    const orderItems = [];
    const stockUpdates = [];

    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `商品不存在: ${item.productId}`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `商品 "${product.name}" 库存不足，当前库存: ${product.stock}`
        });
      }

      // 计算项目总价
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price
      });

      // 减少库存
      stockUpdates.push(
        prisma.product.update({
          where: { id: product.id },
          data: { stock: product.stock - item.quantity }
        })
      );
    }

    // 开始事务
    const order = await prisma.$transaction(async (prisma) => {
      // 创建订单
      const newOrder = await prisma.order.create({
        data: {
          userId,
          addressId,
          totalAmount,
          paymentMethod,
          status: 'PENDING',
          items: {
            create: orderItems
          }
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  images: true
                }
              }
            }
          },
          shippingAddress: true
        }
      });

      // 更新产品库存
      for (const update of stockUpdates) {
        await update;
      }

      // 如果用户有购物车，清空购物车中的相关商品
      const cart = await prisma.cart.findUnique({
        where: { userId }
      });

      if (cart) {
        await prisma.cartItem.deleteMany({
          where: {
            cartId: cart.id,
            productId: { in: productIds }
          }
        });
      }

      return newOrder;
    });

    return res.status(201).json({
      success: true,
      message: '订单已成功创建',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({
      success: false,
      message: '创建订单时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 获取当前用户的所有订单
 */
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);
    
    // 构建查询条件
    const where = { userId };
    if (status) {
      where.status = status;
    }
    
    // 执行查询
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  images: true
                }
              }
            }
          },
          shippingAddress: true
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where })
    ]);
    
    return res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    return res.status(500).json({
      success: false,
      message: '获取订单列表时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 获取订单详情
 */
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // 构建查询条件，管理员可以查看任何订单
    const where = { id };
    if (userRole !== 'ADMIN') {
      where.userId = userId;
    }
    
    const order = await prisma.order.findFirst({
      where,
      include: {
        items: {
          include: {
            product: true
          }
        },
        shippingAddress: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true
          }
        }
      }
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在或您无权查看'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order by id error:', error);
    return res.status(500).json({
      success: false,
      message: '获取订单详情时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 取消订单
 */
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // 构建查询条件，管理员可以取消任何订单
    const where = { id };
    if (userRole !== 'ADMIN') {
      where.userId = userId;
    }
    
    // 查找订单
    const order = await prisma.order.findFirst({
      where,
      include: {
        items: true
      }
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在或您无权操作'
      });
    }
    
    // 只有待付款的订单才能取消
    if (order.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: `无法取消${order.status === 'CANCELLED' ? '已取消' : '已支付'}的订单`
      });
    }
    
    // 开始事务
    const updatedOrder = await prisma.$transaction(async (prisma) => {
      // 更新订单状态
      const updated = await prisma.order.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          updatedAt: new Date()
        }
      });
      
      // 恢复商品库存
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        });
      }
      
      return updated;
    });
    
    return res.status(200).json({
      success: true,
      message: '订单已成功取消',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    return res.status(500).json({
      success: false,
      message: '取消订单时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 处理订单支付
 */
const processPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentId } = req.body;
    const userId = req.user.id;
    
    // 查找订单
    const order = await prisma.order.findFirst({
      where: {
        id,
        userId
      }
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在或您无权操作'
      });
    }
    
    // 检查订单状态
    if (order.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: `无法支付${order.status === 'CANCELLED' ? '已取消' : '已支付'}的订单`
      });
    }
    
    // 在实际应用中，这里应该调用支付网关API来处理支付
    // 这里我们简单地更新订单状态，假设支付已成功
    
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: 'PAID',
        paymentId,
        updatedAt: new Date()
      }
    });
    
    return res.status(200).json({
      success: true,
      message: '支付成功',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Process payment error:', error);
    return res.status(500).json({
      success: false,
      message: '处理支付时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 获取所有订单（管理员功能）
 */
const getAllOrders = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      sort = 'createdAt', 
      order = 'desc',
      search 
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);
    
    // 构建查询条件
    const where = {};
    if (status) {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { id: { contains: search } }
      ];
    }
    
    // 构建排序条件
    const orderBy = {};
    if (sort === 'totalAmount') {
      orderBy.totalAmount = order.toLowerCase();
    } else {
      orderBy.createdAt = order.toLowerCase();
    }
    
    // 执行查询
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              items: true
            }
          }
        },
        skip,
        take,
        orderBy
      }),
      prisma.order.count({ where })
    ]);
    
    return res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    return res.status(500).json({
      success: false,
      message: '获取订单列表时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 更新订单状态（管理员功能）
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // 验证状态是否有效
    const validStatuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: '无效的订单状态'
      });
    }
    
    // 查找订单
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true
      }
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }
    
    // 开始事务
    const updatedOrder = await prisma.$transaction(async (prisma) => {
      // 如果从其他状态变为取消状态，需要恢复库存
      if (status === 'CANCELLED' && order.status !== 'CANCELLED') {
        for (const item of order.items) {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity
              }
            }
          });
        }
      }
      
      // 如果从取消状态变为其他状态，需要重新减少库存
      if (order.status === 'CANCELLED' && status !== 'CANCELLED') {
        for (const item of order.items) {
          const product = await prisma.product.findUnique({
            where: { id: item.productId }
          });
          
          if (product.stock < item.quantity) {
            throw new Error(`商品 "${product.name}" 库存不足，无法恢复订单`);
          }
          
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          });
        }
      }
      
      // 更新订单状态
      const updated = await prisma.order.update({
        where: { id },
        data: {
          status,
          updatedAt: new Date()
        }
      });
      
      return updated;
    });
    
    return res.status(200).json({
      success: true,
      message: '订单状态已更新',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    return res.status(500).json({
      success: false,
      message: '更新订单状态时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  processPayment,
  getAllOrders,
  updateOrderStatus
}; 