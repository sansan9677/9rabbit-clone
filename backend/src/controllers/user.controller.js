const { prisma } = require('../config/db');

/**
 * 获取当前登录用户的个人资料
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: '获取个人资料时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 更新当前登录用户的个人资料
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, avatar } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        avatar,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.status(200).json({
      success: true,
      message: '个人资料已更新',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: '更新个人资料时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 删除当前登录用户的账户
 */
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // 删除用户（级联删除会处理相关数据）
    await prisma.user.delete({
      where: { id: userId }
    });

    return res.status(200).json({
      success: true,
      message: '账户已成功删除'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    return res.status(500).json({
      success: false,
      message: '删除账户时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 获取所有用户列表（管理员功能）
 */
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          avatar: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              orders: true,
              addresses: true
            }
          }
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    return res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    return res.status(500).json({
      success: false,
      message: '获取用户列表时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 获取指定用户的详细信息（管理员功能）
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        addresses: true,
        orders: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            orders: true,
            addresses: true,
            favoriteItems: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user by id error:', error);
    return res.status(500).json({
      success: false,
      message: '获取用户详情时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 更新指定用户的信息（管理员功能）
 */
const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, avatar, role } = req.body;

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        phone,
        avatar,
        role,
        updatedAt: new Date()
      }
    });

    return res.status(200).json({
      success: true,
      message: '用户信息已更新',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user by id error:', error);
    return res.status(500).json({
      success: false,
      message: '更新用户信息时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 删除指定用户（管理员功能）
 */
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 删除用户（级联删除会处理相关数据）
    await prisma.user.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: '用户已成功删除'
    });
  } catch (error) {
    console.error('Delete user by id error:', error);
    return res.status(500).json({
      success: false,
      message: '删除用户时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 获取当前登录用户的地址列表
 */
const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return res.status(200).json({
      success: true,
      data: addresses
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    return res.status(500).json({
      success: false,
      message: '获取地址列表时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 创建新地址
 */
const createAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { street, city, state, zipCode, country, isDefault } = req.body;

    // 如果设置为默认地址，先将其他地址设置为非默认
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        street,
        city,
        state,
        zipCode,
        country,
        isDefault: isDefault || false,
        userId
      }
    });

    return res.status(201).json({
      success: true,
      message: '地址已成功创建',
      data: newAddress
    });
  } catch (error) {
    console.error('Create address error:', error);
    return res.status(500).json({
      success: false,
      message: '创建地址时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 更新地址
 */
const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { street, city, state, zipCode, country, isDefault } = req.body;

    // 检查地址是否存在且属于当前用户
    const address = await prisma.address.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: '地址不存在或不属于当前用户'
      });
    }

    // 如果设置为默认地址，先将其他地址设置为非默认
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId,
          id: { not: id }
        },
        data: { isDefault: false }
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        street,
        city,
        state,
        zipCode,
        country,
        isDefault: isDefault || false,
        updatedAt: new Date()
      }
    });

    return res.status(200).json({
      success: true,
      message: '地址已成功更新',
      data: updatedAddress
    });
  } catch (error) {
    console.error('Update address error:', error);
    return res.status(500).json({
      success: false,
      message: '更新地址时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 删除地址
 */
const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // 检查地址是否存在且属于当前用户
    const address = await prisma.address.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: '地址不存在或不属于当前用户'
      });
    }

    await prisma.address.delete({
      where: { id }
    });

    // 如果删除的是默认地址，则将最新的地址设为默认地址
    if (address.isDefault) {
      const latestAddress = await prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });

      if (latestAddress) {
        await prisma.address.update({
          where: { id: latestAddress.id },
          data: { isDefault: true }
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: '地址已成功删除'
    });
  } catch (error) {
    console.error('Delete address error:', error);
    return res.status(500).json({
      success: false,
      message: '删除地址时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * 设置默认地址
 */
const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // 检查地址是否存在且属于当前用户
    const address = await prisma.address.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: '地址不存在或不属于当前用户'
      });
    }

    // 将所有地址设置为非默认
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false }
    });

    // 将目标地址设置为默认
    const updatedAddress = await prisma.address.update({
      where: { id },
      data: { isDefault: true }
    });

    return res.status(200).json({
      success: true,
      message: '默认地址已设置',
      data: updatedAddress
    });
  } catch (error) {
    console.error('Set default address error:', error);
    return res.status(500).json({
      success: false,
      message: '设置默认地址时发生错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
}; 