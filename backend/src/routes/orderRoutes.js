const express = require('express');
const router = express.Router();
const { authenticateUser, authenticateAdmin, optionalAuth } = require('../middleware/auth');
const {
    createOrder,
    getAllOrders,
    getOrderDetails,
    updateOrderStatus,
    getMyOrders,
    trackOrder,
    cancelOrder
} = require('../controllers/orderController');

// Create new order (temporarily public for testing)
router.post('/create', createOrder);

// Create new order with authentication (for when JWT is properly implemented)
router.post('/create-auth', authenticateUser, createOrder);

// Get order details (requires authentication or admin)
router.get('/:id', optionalAuth, getOrderDetails);

// Track order (public route with order ID and email)
router.get('/track/:orderId', trackOrder);

// Cancel order (requires authentication)
router.put('/:id/cancel', authenticateUser, cancelOrder);

// Get customer's orders (requires authentication)
router.get('/user/my-orders', authenticateUser, getMyOrders);

// Admin routes (require admin authentication)
router.get('/admin/all', authenticateAdmin, getAllOrders);
router.put('/admin/status/:id', authenticateAdmin, updateOrderStatus);

module.exports = router;
