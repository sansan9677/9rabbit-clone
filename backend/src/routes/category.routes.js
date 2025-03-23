const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @route   GET /api/categories
 * @desc    获取所有分类
 * @access  Public
 */
router.get('/', categoryController.getAllCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    根据ID获取分类
 * @access  Public
 */
router.get('/:id', categoryController.getCategoryById);

/**
 * @route   GET /api/categories/:id/products
 * @desc    获取分类下的产品
 * @access  Public
 */
router.get('/:id/products', categoryController.getCategoryProducts);

/**
 * @route   POST /api/categories
 * @desc    创建新分类（管理员功能）
 * @access  Private/Admin
 */
router.post('/', authenticate, authorize('ADMIN'), categoryController.createCategory);

/**
 * @route   PUT /api/categories/:id
 * @desc    更新分类（管理员功能）
 * @access  Private/Admin
 */
router.put('/:id', authenticate, authorize('ADMIN'), categoryController.updateCategory);

/**
 * @route   DELETE /api/categories/:id
 * @desc    删除分类（管理员功能）
 * @access  Private/Admin
 */
router.delete('/:id', authenticate, authorize('ADMIN'), categoryController.deleteCategory);

module.exports = router; 