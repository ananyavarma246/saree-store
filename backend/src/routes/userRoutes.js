const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    addToCart,
    getCart,
    removeFromCart,
    updateCartQuantity,
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    addAddress,
    updateAddress,
    deleteAddress,
    getUserOrders
} = require('../controllers/userController');
const { authenticateUser } = require('../middleware/auth');

// Authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (require authentication)
router.use(authenticateUser); // All routes below require authentication

// User profile routes
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

// Cart routes
router.get('/cart', getCart);
router.post('/cart', addToCart);
router.put('/cart/:productId', updateCartQuantity);
router.delete('/cart/:productId', removeFromCart);

// Wishlist routes
router.get('/wishlist', getWishlist);
router.post('/wishlist/:productId', addToWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);

// Address routes
router.post('/addresses', addAddress);
router.put('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', deleteAddress);

// Order history
router.get('/orders', getUserOrders);

module.exports = router;
