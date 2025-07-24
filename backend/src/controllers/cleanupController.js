const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');

// Clean up all dummy/sample data
exports.cleanupDummyData = async (req, res) => {
    try {
        // Remove dummy users (with example emails)
        const deletedUsers = await User.deleteMany({ 
            email: { $regex: '@example\.com$' } 
        });

        // Remove dummy orders (with example emails)
        const deletedOrders = await Order.deleteMany({ 
            'user.email': { $regex: '@example\.com$' } 
        });

        // Remove all sample products (since they were created for testing)
        const deletedProducts = await Product.deleteMany({});

        res.status(200).json({
            success: true,
            message: "Dummy data cleaned up successfully",
            data: {
                deletedUsers: deletedUsers.deletedCount,
                deletedOrders: deletedOrders.deletedCount,
                deletedProducts: deletedProducts.deletedCount
            }
        });
    } catch (error) {
        console.error('Cleanup error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to cleanup dummy data",
            error: error.message
        });
    }
};
