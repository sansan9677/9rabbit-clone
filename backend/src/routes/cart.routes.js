const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { authenticate } = require('../middleware/auth');

/**
 * @route   GET /api/cart
 * @desc    获取当前用户的购物车
 * @access  Private
 */
router.get('/', authenticate, cartController.getCart);

/**
 * @route   POST /api/cart/items
 * @desc    添加商品到购物车
 * @access  Private
 */
router.post('/items', authenticate, cartController.addItemToCart);

/**
 * @route   PUT /api/cart/items/:itemId
 * @desc    更新购物车中的商品数量
 * @access  Private
 */
router.put('/items/:itemId', authenticate, cartController.updateCartItem);

/**
 * @route   DELETE /api/cart/items/:itemId
 * @desc    从购物车中移除商品
 * @access  Private
 */
router.delete('/items/:itemId', authenticate, cartController.removeCartItem);

/**
 * @route   DELETE /api/cart
 * @desc    清空购物车
 * @access  Private
 */
router.delete('/', authenticate, cartController.clearCart);

module.exports = router; 