const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @route   GET /api/users/profile
 * @desc    获取当前用户的个人资料
 * @access  Private
 */
router.get('/profile', authenticate, userController.getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    更新当前用户的个人资料
 * @access  Private
 */
router.put('/profile', authenticate, userController.updateProfile);

/**
 * @route   DELETE /api/users/profile
 * @desc    删除当前用户的账户
 * @access  Private
 */
router.delete('/profile', authenticate, userController.deleteAccount);

/**
 * @route   GET /api/users
 * @desc    获取所有用户（管理员功能）
 * @access  Private/Admin
 */
router.get('/', authenticate, authorize('ADMIN'), userController.getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    根据ID获取用户信息（管理员功能）
 * @access  Private/Admin
 */
router.get('/:id', authenticate, authorize('ADMIN'), userController.getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    根据ID更新用户信息（管理员功能）
 * @access  Private/Admin
 */
router.put('/:id', authenticate, authorize('ADMIN'), userController.updateUserById);

/**
 * @route   DELETE /api/users/:id
 * @desc    根据ID删除用户（管理员功能）
 * @access  Private/Admin
 */
router.delete('/:id', authenticate, authorize('ADMIN'), userController.deleteUserById);

/**
 * @route   GET /api/users/addresses
 * @desc    获取当前用户的地址列表
 * @access  Private
 */
router.get('/addresses', authenticate, userController.getAddresses);

/**
 * @route   POST /api/users/addresses
 * @desc    创建新地址
 * @access  Private
 */
router.post('/addresses', authenticate, userController.createAddress);

/**
 * @route   PUT /api/users/addresses/:id
 * @desc    更新地址
 * @access  Private
 */
router.put('/addresses/:id', authenticate, userController.updateAddress);

/**
 * @route   DELETE /api/users/addresses/:id
 * @desc    删除地址
 * @access  Private
 */
router.delete('/addresses/:id', authenticate, userController.deleteAddress);

/**
 * @route   PUT /api/users/addresses/:id/default
 * @desc    设置默认地址
 * @access  Private
 */
router.put('/addresses/:id/default', authenticate, userController.setDefaultAddress);

module.exports = router; 