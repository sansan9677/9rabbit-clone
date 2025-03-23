const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @route   POST /api/orders
 * @desc    创建新订单
 * @access  Private
 */
router.post('/', authenticate, orderController.createOrder);

/**
 * @route   GET /api/orders/my
 * @desc    获取当前用户的所有订单
 * @access  Private
 */
router.get('/my', authenticate, orderController.getMyOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    获取订单详情
 * @access  Private
 */
router.get('/:id', authenticate, orderController.getOrderById);

/**
 * @route   POST /api/orders/:id/cancel
 * @desc    取消订单
 * @access  Private
 */
router.post('/:id/cancel', authenticate, orderController.cancelOrder);

/**
 * @route   POST /api/orders/:id/payment
 * @desc    处理订单支付
 * @access  Private
 */
router.post('/:id/payment', authenticate, orderController.processPayment);

/**
 * @route   GET /api/orders
 * @desc    获取所有订单（管理员功能）
 * @access  Private/Admin
 */
router.get('/', authenticate, authorize('ADMIN'), orderController.getAllOrders);

/**
 * @route   PUT /api/orders/:id/status
 * @desc    更新订单状态（管理员功能）
 * @access  Private/Admin
 */
router.put('/:id/status', authenticate, authorize('ADMIN'), orderController.updateOrderStatus);

module.exports = router; 