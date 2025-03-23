const { prisma } = require('../config/db');

/**
 * 获取所有分类
 */
const getAllCategories = async (req, res) => {
  try {
    const { includeProducts = 'false' } = req.query;
    
    // 是否包含产品信息
    const include = includeProducts === 'true' ? {
      products: {
        select: {
          id: true,
          name: true,
          price: true,
          images: true
        },
        take: 5
      }
    } : {};
    
    // 获取所有顶级分类
    const categories = await prisma.category.findMany({
      where: {
        parentId: null
      },
      include: {
        ...include,
        children: {
          include
        },
        _count: {
          select: {
            products: true,
            children: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get all categories error:', error);
    return res.status(500).json({
      success: false,
      message: '获取分类列表时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 获取分类详情
 */
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: {
          select: {
            id: true,
            name: true
          }
        },
        children: {
          select: {
            id: true,
            name: true,
            image: true,
            _count: {
              select: {
                products: true
              }
            }
          }
        },
        _count: {
          select: {
            products: true,
            children: true
          }
        }
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在'
      });
    }

    return res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Get category by id error:', error);
    return res.status(500).json({
      success: false,
      message: '获取分类详情时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 获取分类下的产品
 */
const getCategoryProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);
    
    // 检查分类是否存在
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        children: {
          select: { id: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在'
      });
    }
    
    // 构建查询条件，包括子分类的产品
    const childIds = category.children.map(child => child.id);
    const where = {
      OR: [
        { categoryId: id },
        { categoryId: { in: childIds } }
      ]
    };

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
        category: {
          id: category.id,
          name: category.name,
          image: category.image
        },
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
    console.error('Get category products error:', error);
    return res.status(500).json({
      success: false,
      message: '获取分类产品时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 创建新分类
 */
const createCategory = async (req, res) => {
  try {
    const { name, image, parentId } = req.body;

    // 如果提供了父分类ID，验证其是否存在
    if (parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: parentId }
      });

      if (!parentCategory) {
        return res.status(400).json({
          success: false,
          message: '父分类不存在'
        });
      }
    }

    // 检查分类名称是否已存在
    const existingCategory = await prisma.category.findFirst({
      where: { name }
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: '分类名称已存在'
      });
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        image,
        parentId
      }
    });

    return res.status(201).json({
      success: true,
      message: '分类已成功创建',
      data: newCategory
    });
  } catch (error) {
    console.error('Create category error:', error);
    return res.status(500).json({
      success: false,
      message: '创建分类时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 更新分类
 */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, parentId } = req.body;

    // 检查分类是否存在
    const category = await prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在'
      });
    }

    // 如果要修改分类名称，检查是否已存在该名称的其他分类
    if (name && name !== category.name) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          name,
          id: { not: id }
        }
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: '分类名称已存在'
        });
      }
    }

    // 如果提供了父分类ID，验证其是否存在，并防止循环引用
    if (parentId && parentId !== category.parentId) {
      if (parentId === id) {
        return res.status(400).json({
          success: false,
          message: '分类不能作为自己的父分类'
        });
      }

      const parentCategory = await prisma.category.findUnique({
        where: { id: parentId }
      });

      if (!parentCategory) {
        return res.status(400).json({
          success: false,
          message: '父分类不存在'
        });
      }

      // 检查是否会形成循环引用
      let currentParent = parentCategory;
      while (currentParent.parentId) {
        if (currentParent.parentId === id) {
          return res.status(400).json({
            success: false,
            message: '此操作将导致循环引用'
          });
        }
        
        currentParent = await prisma.category.findUnique({
          where: { id: currentParent.parentId }
        });
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        image,
        parentId,
        updatedAt: new Date()
      }
    });

    return res.status(200).json({
      success: true,
      message: '分类已成功更新',
      data: updatedCategory
    });
  } catch (error) {
    console.error('Update category error:', error);
    return res.status(500).json({
      success: false,
      message: '更新分类时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 删除分类
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // 检查分类是否存在
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        products: true
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在'
      });
    }

    // 检查是否有子分类
    if (category.children.length > 0) {
      return res.status(400).json({
        success: false,
        message: '无法删除包含子分类的分类，请先删除所有子分类'
      });
    }

    // 检查是否有关联的产品
    if (category.products.length > 0) {
      return res.status(400).json({
        success: false,
        message: '无法删除包含产品的分类，请先删除或转移所有关联产品'
      });
    }

    await prisma.category.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: '分类已成功删除'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    return res.status(500).json({
      success: false,
      message: '删除分类时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryProducts
}; 