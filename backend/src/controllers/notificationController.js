const Order = require('../models/order');
const Product = require('../models/product');

// In-memory storage for notifications (in production, use Redis or database)
let notifications = [];

// Add new notification
const addNotification = (type, message, data = {}) => {
    const notification = {
        id: Date.now().toString(),
        type, // 'new_order', 'low_stock', 'order_cancelled', 'payment_received'
        message,
        data,
        timestamp: new Date(),
        read: false
    };
    
    notifications.unshift(notification);
    
    // Keep only last 100 notifications
    if (notifications.length > 100) {
        notifications = notifications.slice(0, 100);
    }
    
    return notification;
};

// Get all notifications
exports.getNotifications = async (req, res) => {
    try {
        const { unreadOnly = false, limit = 20 } = req.query;
        
        let filteredNotifications = notifications;
        
        if (unreadOnly === 'true') {
            filteredNotifications = notifications.filter(n => !n.read);
        }
        
        const result = filteredNotifications.slice(0, parseInt(limit));
        
        res.status(200).json({
            success: true,
            notifications: result,
            unreadCount: notifications.filter(n => !n.read).length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Mark notification as read
exports.markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        
        const notification = notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
        }
        
        res.status(200).json({
            success: true,
            message: 'Notification marked as read'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Mark all notifications as read
exports.markAllNotificationsAsRead = async (req, res) => {
    try {
        notifications.forEach(n => n.read = true);
        
        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        
        notifications = notifications.filter(n => n.id !== notificationId);
        
        res.status(200).json({
            success: true,
            message: 'Notification deleted'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Create notification for new order
exports.createNewOrderNotification = (order) => {
    return addNotification(
        'new_order',
        `New order #${order._id.toString().slice(-6)} received from ${order.user.name}`,
        {
            orderId: order._id,
            customerName: order.user.name,
            amount: order.totalPrice,
            itemCount: order.orderItems.length
        }
    );
};

// Create notification for low stock
exports.createLowStockNotification = (product) => {
    return addNotification(
        'low_stock',
        `Low stock alert: ${product.name} (${product.stock} remaining)`,
        {
            productId: product._id,
            productName: product.name,
            currentStock: product.stock
        }
    );
};

// Create notification for order cancellation
exports.createOrderCancelledNotification = (order) => {
    return addNotification(
        'order_cancelled',
        `Order #${order._id.toString().slice(-6)} has been cancelled by ${order.user.name}`,
        {
            orderId: order._id,
            customerName: order.user.name,
            amount: order.totalPrice
        }
    );
};

// Create notification for payment received
exports.createPaymentReceivedNotification = (order) => {
    return addNotification(
        'payment_received',
        `Payment received for order #${order._id.toString().slice(-6)} - ₹${order.totalPrice}`,
        {
            orderId: order._id,
            amount: order.totalPrice,
            paymentMethod: order.paymentMethod
        }
    );
};

// Auto-generate notifications for low stock products
exports.checkAndCreateLowStockNotifications = async () => {
    try {
        const lowStockProducts = await Product.find({ stock: { $lt: 10, $gt: 0 } });
        
        for (const product of lowStockProducts) {
            // Check if we already have a recent notification for this product
            const recentNotification = notifications.find(n => 
                n.type === 'low_stock' && 
                n.data.productId === product._id.toString() &&
                (Date.now() - new Date(n.timestamp).getTime()) < 24 * 60 * 60 * 1000 // Within 24 hours
            );
            
            if (!recentNotification) {
                exports.createLowStockNotification(product);
            }
        }
    } catch (error) {
        console.error('Error checking low stock:', error);
    }
};

// Get notification statistics
exports.getNotificationStats = async (req, res) => {
    try {
        const stats = {
            total: notifications.length,
            unread: notifications.filter(n => !n.read).length,
            byType: {}
        };
        
        // Count by type
        notifications.forEach(n => {
            stats.byType[n.type] = (stats.byType[n.type] || 0) + 1;
        });
        
        res.status(200).json({
            success: true,
            stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
