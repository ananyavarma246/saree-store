const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');
const {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    getNotificationStats
} = require('../controllers/notificationController');

// All routes require admin authentication
router.use(authenticateAdmin);

// Get notifications
router.get('/', getNotifications);

// Get notification statistics
router.get('/stats', getNotificationStats);

// Mark notification as read
router.put('/:notificationId/read', markNotificationAsRead);

// Mark all notifications as read
router.put('/mark-all-read', markAllNotificationsAsRead);

// Delete notification
router.delete('/:notificationId', deleteNotification);

module.exports = router;
