const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');

/**
 * @route   POST /api/auth/register
 * @desc    用户注册
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    用户登录
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    刷新访问令牌
 * @access  Private
 */
router.post('/refresh-token', authenticate, authController.refreshToken);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    请求密码重置
 * @access  Public
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    使用重置令牌重置密码
 * @access  Public
 */
router.post('/reset-password', authController.resetPassword);

/**
 * @route   PUT /api/auth/change-password
 * @desc    修改密码
 * @access  Private
 */
router.put('/change-password', authenticate, authController.changePassword);

/**
 * @route   POST /api/auth/logout
 * @desc    用户登出
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout);

module.exports = router; 