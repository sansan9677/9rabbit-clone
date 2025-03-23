const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @route   GET /api/products
 * @desc    获取所有产品
 * @access  Public
 */
router.get('/', productController.getAllProducts);

/**
 * @route   GET /api/products/featured
 * @desc    获取推荐产品
 * @access  Public
 */
router.get('/featured', productController.getFeaturedProducts);

/**
 * @route   GET /api/products/search
 * @desc    搜索产品
 * @access  Public
 */
router.get('/search', productController.searchProducts);

/**
 * @route   GET /api/products/favorites
 * @desc    获取用户收藏的产品
 * @access  Private
 */
router.get('/favorites', authenticate, productController.getFavoriteProducts);

/**
 * @route   POST /api/products/:id/favorite
 * @desc    添加或移除产品收藏
 * @access  Private
 */
router.post('/:id/favorite', authenticate, productController.toggleFavoriteProduct);

/**
 * @route   GET /api/products/:id
 * @desc    根据ID获取产品详情
 * @access  Public
 */
router.get('/:id', productController.getProductById);

/**
 * @route   POST /api/products
 * @desc    创建新产品（管理员功能）
 * @access  Private/Admin
 */
router.post('/', authenticate, authorize('ADMIN'), productController.createProduct);

/**
 * @route   PUT /api/products/:id
 * @desc    更新产品（管理员功能）
 * @access  Private/Admin
 */
router.put('/:id', authenticate, authorize('ADMIN'), productController.updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    删除产品（管理员功能）
 * @access  Private/Admin
 */
router.delete('/:id', authenticate, authorize('ADMIN'), productController.deleteProduct);

module.exports = router; 