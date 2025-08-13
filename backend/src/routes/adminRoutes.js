const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { verifyAdminToken, adminRateLimiter } = require('../middleware/adminAuth');
const { cleanupDummyData } = require('../controllers/cleanupController');
const {
    adminLogin,
    getDashboardStats,
    getAllOrders,
    updateOrderStatus,
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getAllUsers
} = require('../controllers/adminController');

// Admin Authentication (public route with rate limiting)
router.post('/login', adminRateLimiter, adminLogin);

// Protected Admin Routes - All require valid admin JWT token
// Dashboard Stats
router.get('/dashboard', verifyAdminToken, getDashboardStats);

// Order Management Routes
router.get('/orders', verifyAdminToken, getAllOrders);
router.put('/orders/:orderId/status', verifyAdminToken, updateOrderStatus);

// Product Management Routes
router.get('/products', verifyAdminToken, getAllProducts);
router.post('/products', verifyAdminToken, upload.single('image'), addProduct);
router.put('/products/:productId', verifyAdminToken, upload.single('image'), updateProduct);
router.delete('/products/:productId', verifyAdminToken, deleteProduct);

// User Management Routes
router.get('/users', verifyAdminToken, getAllUsers);

// Cleanup dummy data (development only)
if (process.env.NODE_ENV === 'development') {
    router.post('/cleanup-dummy-data', verifyAdminToken, cleanupDummyData);
}

// Image Upload Route
router.post('/upload-image', verifyAdminToken, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }

        // Use production URL or fallback to localhost for development
        const baseUrl = process.env.NODE_ENV === 'production' 
            ? 'https://alankree-production.up.railway.app'
            : 'http://localhost:5001';
        const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
        
        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            imageUrl: imageUrl,
            filename: req.file.filename
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
