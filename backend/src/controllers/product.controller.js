const { prisma } = require('../config/db');

/**
 * 获取所有产品
 */
const getAllProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      sort = 'createdAt', 
      order = 'desc',
      featured 
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // 构建查询条件
    const where = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (featured === 'true') {
      where.featured = true;
    }

    // 构建排序条件
    const orderBy = {};
    if (sort === 'price') {
      orderBy.price = order.toLowerCase();
    } else if (sort === 'name') {
      orderBy.name = order.toLowerCase();
    } else {
      orderBy.createdAt = order.toLowerCase();
    }

    // 执行查询
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        },
        skip,
        take,
        orderBy
      }),
      prisma.product.count({ where })
    ]);

    return res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get all products error:', error);
    return res.status(500).json({
      success: false,
      message: '获取产品列表时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 获取推荐产品
 */
const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const products = await prisma.product.findMany({
      where: {
        featured: true
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    return res.status(500).json({
      success: false,
      message: '获取推荐产品时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 搜索产品
 */
const searchProducts = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: '请提供搜索关键词'
      });
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } }
        ]
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Search products error:', error);
    return res.status(500).json({
      success: false,
      message: '搜索产品时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 获取产品详情
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '产品不存在'
      });
    }

    // 可选：获取相关产品
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: id }
      },
      take: 4,
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({
      success: true,
      data: {
        product,
        relatedProducts
      }
    });
  } catch (error) {
    console.error('Get product by id error:', error);
    return res.status(500).json({
      success: false,
      message: '获取产品详情时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 创建新产品
 */
const createProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      comparePrice, 
      stock, 
      images, 
      categoryId, 
      featured 
    } = req.body;

    // 验证分类是否存在
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return res.status(400).json({
        success: false,
        message: '分类不存在'
      });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        stock: parseInt(stock),
        images,
        categoryId,
        featured: featured || false
      }
    });

    return res.status(201).json({
      success: true,
      message: '产品已成功创建',
      data: newProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({
      success: false,
      message: '创建产品时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 更新产品
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      price, 
      comparePrice, 
      stock, 
      images, 
      categoryId, 
      featured 
    } = req.body;

    // 检查产品是否存在
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '产品不存在'
      });
    }

    // 如果提供了分类ID，验证分类是否存在
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId }
      });

      if (!category) {
        return res.status(400).json({
          success: false,
          message: '分类不存在'
        });
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        stock: stock ? parseInt(stock) : undefined,
        images,
        categoryId,
        featured: featured !== undefined ? featured : undefined,
        updatedAt: new Date()
      }
    });

    return res.status(200).json({
      success: true,
      message: '产品已成功更新',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({
      success: false,
      message: '更新产品时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 删除产品
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // 检查产品是否存在
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '产品不存在'
      });
    }

    await prisma.product.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: '产品已成功删除'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({
      success: false,
      message: '删除产品时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 添加或移除产品收藏
 */
const toggleFavoriteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // 检查产品是否存在
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '产品不存在'
      });
    }

    // 检查是否已收藏
    const existingFavorite = await prisma.favoriteItem.findFirst({
      where: {
        productId: id,
        userId
      }
    });

    if (existingFavorite) {
      // 如果已收藏，则移除
      await prisma.favoriteItem.delete({
        where: { id: existingFavorite.id }
      });

      return res.status(200).json({
        success: true,
        message: '已从收藏中移除',
        data: { favorited: false }
      });
    } else {
      // 如果未收藏，则添加
      await prisma.favoriteItem.create({
        data: {
          userId,
          productId: id
        }
      });

      return res.status(200).json({
        success: true,
        message: '已添加到收藏',
        data: { favorited: true }
      });
    }
  } catch (error) {
    console.error('Toggle favorite error:', error);
    return res.status(500).json({
      success: false,
      message: '操作收藏时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 获取用户收藏的产品
 */
const getFavoriteProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [favorites, total] = await Promise.all([
      prisma.favoriteItem.findMany({
        where: { userId },
        include: {
          product: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.favoriteItem.count({ where: { userId } })
    ]);

    // 转换结果格式，提取产品信息
    const products = favorites.map(fav => fav.product);

    return res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get favorite products error:', error);
    return res.status(500).json({
      success: false,
      message: '获取收藏产品时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  searchProducts,
  toggleFavoriteProduct,
  getFavoriteProducts
}; 