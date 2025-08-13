const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');
const { verifyAdminCredentials } = require('../middleware/adminAuth');

// Import temporary orders from orderController
const { getTemporaryOrders } = require('./orderController');

// Secure Admin Login with JWT
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const authResult = await verifyAdminCredentials(email, password);
        
        if (!authResult.success) {
            // Log failed login attempts (in production, implement proper logging)
            console.log(`❌ Failed admin login attempt for email: ${email} at ${new Date().toISOString()}`);
            
            return res.status(401).json({
                success: false,
                message: authResult.message
            });
        }

        // Log successful login
        console.log(`✅ Successful admin login for: ${email} at ${new Date().toISOString()}`);

        res.status(200).json({
            success: true,
            message: 'Admin login successful',
            token: authResult.token,
            admin: authResult.admin
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during login'
        });
    }
};

// Get Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
    try {
        // Get total orders
        const totalOrders = await Order.countDocuments();
        
        // Get pending orders
        const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
        
        // Get delivered orders
        const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });
        
        // Get total revenue
        const revenueData = await Order.aggregate([
            { $match: { orderStatus: 'delivered' } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;
        
        // Get total products
        const totalProducts = await Product.countDocuments();
        
        // Get low stock products (assuming stock field exists)
        const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10 } });
        
        // Get recent orders (last 5) with proper formatting
        const recentOrdersData = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5);
        
        // Format recent orders for frontend
        const recentOrders = recentOrdersData.map(order => ({
            id: order._id,
            customer: order.user ? order.user.name : 'Unknown Customer',
            amount: order.totalPrice || 0,
            status: order.orderStatus || 'pending',
            date: order.createdAt ? order.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        }));
        
        // Get orders by status
        const ordersByStatus = await Order.aggregate([
            { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
        ]);
        
        // Get monthly revenue (last 6 months)
        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    orderStatus: 'delivered',
                    createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    revenue: { $sum: '$totalPrice' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalOrders,
                pendingOrders,
                deliveredOrders,
                totalRevenue,
                totalProducts,
                lowStockProducts,
                recentOrders,
                ordersByStatus,
                monthlyRevenue
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get All Users with Order History
exports.getAllUsers = async (req, res) => {
    try {
        const mongoReady = mongoose.connection.readyState === 1;
        
        if (!mongoReady) {
            return res.status(503).json({
                success: false,
                message: 'Database connection not available',
                users: []
            });
        }

        // Get all users with their order statistics
        const users = await User.find({ role: 'user' })
            .select('-password')
            .lean();

        // Get order statistics for each user
        const usersWithStats = await Promise.all(
            users.map(async (user) => {
                // Find orders by user email since user info is stored directly in order
                const userOrders = await Order.find({ 'user.email': user.email })
                    .sort({ createdAt: -1 });

                const totalOrders = userOrders.length;
                const totalSpent = userOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
                const lastOrder = userOrders[0];
                
                // Order status breakdown
                const orderStatusBreakdown = {};
                userOrders.forEach(order => {
                    orderStatusBreakdown[order.orderStatus] = (orderStatusBreakdown[order.orderStatus] || 0) + 1;
                });

                // Map recent orders to frontend format (last 5)
                const recentOrderHistory = userOrders.slice(0, 5).map(order => ({
                    _id: order._id,
                    items: order.orderItems,
                    status: order.orderStatus,
                    totalPrice: order.totalPrice,
                    createdAt: order.createdAt,
                    paymentMethod: order.paymentMethod
                }));

                return {
                    ...user,
                    totalOrders,
                    totalSpent,
                    lastOrderDate: lastOrder ? lastOrder.createdAt : null,
                    orderStatusBreakdown,
                    orderHistory: recentOrderHistory,
                    isActive: totalOrders > 0 // Mark user as active if they have orders
                };
            })
        );

        res.status(200).json({
            success: true,
            users: usersWithStats,
            totalUsers: usersWithStats.length
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get User Details with Complete Order History
exports.getUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;
        const mongoReady = mongoose.connection.readyState === 1;
        
        if (!mongoReady) {
            return res.status(503).json({
                success: false,
                message: 'Database connection not available'
            });
        }

        // Get user details
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get complete order history
        const orders = await Order.find({ user: userId })
            .sort({ createdAt: -1 });

        // Calculate user statistics
        const stats = {
            totalOrders: orders.length,
            totalSpent: orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0),
            averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0) / orders.length : 0,
            favoriteCategories: {},
            ordersByStatus: {},
            monthlySpending: {}
        };

        // Analyze order patterns
        orders.forEach(order => {
            // Status breakdown
            stats.ordersByStatus[order.orderStatus] = (stats.ordersByStatus[order.orderStatus] || 0) + 1;
            
            // Monthly spending
            const monthKey = `${order.createdAt.getFullYear()}-${order.createdAt.getMonth() + 1}`;
            stats.monthlySpending[monthKey] = (stats.monthlySpending[monthKey] || 0) + (order.totalPrice || 0);
            
            // Favorite categories
            order.orderItems?.forEach(item => {
                if (item.product?.category) {
                    stats.favoriteCategories[item.product.category] = (stats.favoriteCategories[item.product.category] || 0) + item.quantity;
                }
            });
        });

        // Map orders to frontend format
        const mappedOrders = orders.map(order => ({
            _id: order._id,
            items: order.orderItems,
            status: order.orderStatus,
            totalPrice: order.totalPrice,
            createdAt: order.createdAt,
            user: order.user,
            paymentMethod: order.paymentMethod
        }));

        res.status(200).json({
            success: true,
            user,
            orders: mappedOrders,
            stats
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get All Products (Sarees Inventory)
exports.getAllProducts = async (req, res) => {
    try {
        const mongoReady = mongoose.connection.readyState === 1;
        
        if (!mongoReady) {
            return res.status(503).json({
                success: false,
                message: 'Database connection not available',
                products: []
            });
        }

        const { category, sortBy, search } = req.query;
        
        // Build query
        let query = {};
        if (category) query.category = category;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Get products
        let productsQuery = Product.find(query);
        
        // Apply sorting
        switch (sortBy) {
            case 'price_asc':
                productsQuery = productsQuery.sort({ price: 1 });
                break;
            case 'price_desc':
                productsQuery = productsQuery.sort({ price: -1 });
                break;
            case 'name':
                productsQuery = productsQuery.sort({ name: 1 });
                break;
            case 'newest':
                productsQuery = productsQuery.sort({ createdAt: -1 });
                break;
            default:
                productsQuery = productsQuery.sort({ createdAt: -1 });
        }

        const products = await productsQuery;

        // Get product statistics
        const productStats = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    averagePrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            }
        ]);

        // Get products with order statistics
        const productsWithStats = await Promise.all(
            products.map(async (product) => {
                const orderItems = await Order.aggregate([
                    { $unwind: '$orderItems' },
                    { $match: { 'orderItems.product': product._id } },
                    {
                        $group: {
                            _id: '$orderItems.product',
                            totalSold: { $sum: '$orderItems.quantity' },
                            totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
                            orderCount: { $sum: 1 }
                        }
                    }
                ]);

                const stats = orderItems[0] || { totalSold: 0, totalRevenue: 0, orderCount: 0 };
                
                return {
                    ...product.toObject(),
                    salesStats: {
                        totalSold: stats.totalSold,
                        totalRevenue: stats.totalRevenue,
                        orderCount: stats.orderCount
                    }
                };
            })
        );

        res.status(200).json({
            success: true,
            products: productsWithStats,
            productStats,
            totalProducts: products.length
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get Order Tracking History
exports.getOrderTracking = async (req, res) => {
    try {
        const { orderId } = req.params;
        const mongoReady = mongoose.connection.readyState === 1;
        
        if (!mongoReady) {
            return res.status(503).json({
                success: false,
                message: 'Database connection not available'
            });
        }

        const order = await Order.findById(orderId)
            .populate('user', 'name email phone');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Map order to frontend format
        const mappedOrder = {
            _id: order._id,
            user: order.user,
            items: order.orderItems,
            status: order.orderStatus,
            totalPrice: order.totalPrice,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            paymentMethod: order.paymentMethod,
            statusHistory: order.statusHistory
        };

        // Generate tracking history based on order status and timestamps
        const trackingHistory = [
            {
                status: 'placed',
                timestamp: order.createdAt,
                description: 'Order placed successfully',
                completed: true
            }
        ];

        // Add status-based tracking points
        const statusFlow = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
        const currentStatusIndex = statusFlow.indexOf(order.orderStatus);

        statusFlow.forEach((status, index) => {
            if (index <= currentStatusIndex && status !== 'placed') {
                trackingHistory.push({
                    status,
                    timestamp: order.statusHistory?.find(h => h.status === status)?.timestamp || order.updatedAt,
                    description: getStatusDescription(status),
                    completed: true
                });
            } else if (index === currentStatusIndex + 1) {
                trackingHistory.push({
                    status,
                    timestamp: null,
                    description: getStatusDescription(status),
                    completed: false,
                    current: true
                });
            }
        });

        res.status(200).json({
            success: true,
            order: mappedOrder,
            trackingHistory
        });
    } catch (error) {
        console.error('Error fetching order tracking:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Helper function for status descriptions
function getStatusDescription(status) {
    const descriptions = {
        'pending': 'Order is being reviewed',
        'confirmed': 'Order has been confirmed',
        'processing': 'Order is being prepared',
        'shipped': 'Order has been shipped',
        'delivered': 'Order has been delivered',
        'cancelled': 'Order has been cancelled'
    };
    return descriptions[status] || 'Status updated';
}

// Get All Orders (with filters)
exports.getAllOrders = async (req, res) => {
    try {
        let orders;
        
        // Check if MongoDB is available
        const mongoReady = mongoose.connection.readyState === 1;
        
        if (!mongoReady) {
            // Return temporary orders if MongoDB not available
            const temporaryOrders = getTemporaryOrders();
            orders = temporaryOrders;
            console.log(`Admin returning ${temporaryOrders.length} temporary orders (MongoDB not available)`);
            
            return res.status(200).json({
                success: true,
                count: orders.length,
                orders,
                note: 'Using temporary storage - MongoDB not connected'
            });
        }
        
        // MongoDB is available - use the original logic
        const { status, page = 1, limit = 50, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        
        let query = {};
        if (status) {
            query.orderStatus = status;
        }
        
        orders = await Order.find(query)
            .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        
        // Map the orders to match frontend expectations with complete details
        const mappedOrders = orders.map(order => ({
            _id: order._id,
            user: order.user ? {
                _id: order.user._id || order._id,
                name: order.user.name,
                email: order.user.email,
                phone: order.user.phone,
                address: order.user.address
            } : null,
            items: order.orderItems ? order.orderItems.map(item => ({
                _id: item._id,
                product: {
                    _id: item._id,
                    name: item.name || 'Unknown Product',
                    description: item.description || 'No description available',
                    category: item.category || 'Saree',
                    image: item.image || '/images/default-saree.jpg',
                    originalPrice: item.originalPrice || item.price,
                    price: item.price
                },
                quantity: item.quantity || 1,
                price: item.price,
                subtotal: (item.price * item.quantity) || 0
            })) : [],
            status: order.orderStatus,
            totalPrice: order.totalPrice,
            paymentMethod: order.paymentMethod,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            shippingAddress: order.shippingAddress || order.user?.address,
            statusHistory: order.statusHistory,
            delivery: order.delivery,
            orderSummary: {
                totalItems: order.orderItems ? order.orderItems.reduce((sum, item) => sum + item.quantity, 0) : 0,
                itemsBreakdown: order.orderItems ? order.orderItems.map(item => 
                    `${item.quantity}x ${item.name || 'Product'}`
                ).join(', ') : 'No items'
            }
        }));
        
        const total = await Order.countDocuments(query);
        
        res.status(200).json({
            success: true,
            orders: mappedOrders,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total
            },
            note: 'Connected to MongoDB'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get Recent Orders
exports.getRecentOrders = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));
        
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get Orders by Status
exports.getOrdersByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order status'
            });
        }
        
        const orders = await Order.find({ orderStatus: status })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, notes } = req.body;
        
        const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order status'
            });
        }
        
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        // Update order status
        order.orderStatus = status;
        
        // Add status update to history
        if (!order.statusHistory) {
            order.statusHistory = [];
        }
        
        order.statusHistory.push({
            status,
            updatedAt: new Date(),
            notes: notes || '',
            updatedBy: 'admin'
        });
        
        // Update specific date fields based on status
        if (status === 'confirmed') {
            order.confirmedAt = new Date();
        } else if (status === 'shipped') {
            order.shippedAt = new Date();
        } else if (status === 'delivered') {
            order.deliveredAt = new Date();
        }
        
        await order.save();
        
        res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update Delivery Status
exports.updateDeliveryStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { deliveryStatus, trackingNumber, estimatedDelivery, deliveryAgent } = req.body;
        
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        // Update delivery information
        if (!order.delivery) {
            order.delivery = {};
        }
        
        order.delivery.status = deliveryStatus;
        order.delivery.trackingNumber = trackingNumber;
        order.delivery.estimatedDelivery = estimatedDelivery;
        order.delivery.agent = deliveryAgent;
        order.delivery.updatedAt = new Date();
        
        await order.save();
        
        res.status(200).json({
            success: true,
            message: 'Delivery information updated successfully',
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Assign Delivery Agent
exports.assignDeliveryAgent = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { agentName, agentPhone, agentEmail } = req.body;
        
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        // Update delivery agent
        if (!order.delivery) {
            order.delivery = {};
        }
        
        order.delivery.agent = {
            name: agentName,
            phone: agentPhone,
            email: agentEmail,
            assignedAt: new Date()
        };
        
        await order.save();
        
        res.status(200).json({
            success: true,
            message: 'Delivery agent assigned successfully',
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get Order Details
exports.getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const order = await Order.findById(orderId)
            .populate('user', 'name email phone address');
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Create detailed order breakdown
        const orderDetails = {
            _id: order._id,
            orderNumber: order._id.toString().slice(-8).toUpperCase(),
            
            // Customer Information
            customer: order.user ? {
                _id: order.user._id,
                name: order.user.name,
                email: order.user.email,
                phone: order.user.phone,
                address: order.user.address
            } : null,
            
            // Order Items with complete details
            items: order.orderItems ? order.orderItems.map(item => ({
                _id: item._id,
                product: {
                    _id: item._id,
                    name: item.name || 'Unknown Product',
                    description: item.description || 'No description available',
                    category: item.category || 'Saree',
                    image: item.image || '/images/default-saree.jpg',
                    originalPrice: item.originalPrice || item.price,
                    currentPrice: item.price,
                    specifications: item.specifications || {}
                },
                quantity: item.quantity || 1,
                unitPrice: item.price,
                subtotal: (item.price * item.quantity) || 0,
                itemTotal: (item.price * item.quantity) || 0
            })) : [],
            
            // Order Status and Dates
            status: order.orderStatus,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus || 'pending',
            
            // Financial Summary
            pricing: {
                subtotal: order.orderItems ? order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0,
                tax: order.tax || 0,
                shipping: order.shippingCost || 0,
                discount: order.discount || 0,
                totalPrice: order.totalPrice
            },
            
            // Shipping Information
            shippingAddress: order.shippingAddress || order.user?.address,
            
            // Timestamps
            dates: {
                orderPlaced: order.createdAt,
                lastUpdated: order.updatedAt,
                confirmed: order.confirmedAt || null,
                shipped: order.shippedAt || null,
                delivered: order.deliveredAt || null
            },
            
            // Order Summary
            summary: {
                totalItems: order.orderItems ? order.orderItems.reduce((sum, item) => sum + item.quantity, 0) : 0,
                uniqueProducts: order.orderItems ? order.orderItems.length : 0,
                categoriesOrdered: order.orderItems ? [...new Set(order.orderItems.map(item => item.product?.category).filter(Boolean))] : [],
                itemsList: order.orderItems ? order.orderItems.map(item => 
                    `${item.quantity}x ${item.product?.name || 'Product'} (₹${item.price})`
                ) : []
            },
            
            // Status History
            statusHistory: order.statusHistory || [],
            
            // Delivery Information
            delivery: order.delivery || null,
            
            // Additional Notes
            notes: order.notes || '',
            specialInstructions: order.specialInstructions || ''
        };
        
        res.status(200).json({
            success: true,
            order: orderDetails
        });
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get All Products
exports.getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 20, category, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        
        let query = {};
        if (category) {
            query.category = category;
        }
        
        const products = await Product.find(query)
            .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        
        const total = await Product.countDocuments(query);
        
        res.status(200).json({
            success: true,
            products,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Add New Product
exports.addProduct = async (req, res) => {
    try {
        let productData = { ...req.body };
        
        // If image file was uploaded, use Cloudinary URL or fallback to local
        if (req.file) {
            // Cloudinary provides the secure URL directly
            productData.image = req.file.path || req.file.secure_url || (() => {
                // Fallback for local upload
                const baseUrl = process.env.NODE_ENV === 'production' 
                    ? 'https://alankree-production.up.railway.app'
                    : 'http://localhost:5001';
                return `${baseUrl}/uploads/${req.file.filename}`;
            })();
        }
        
        const product = await Product.create(productData);
        
        res.status(201).json({
            success: true,
            message: 'Product added successfully',
            product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Update Product
exports.updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        let updateData = { ...req.body };
        
        // If image file was uploaded, use Cloudinary URL or fallback to local
        if (req.file) {
            // Cloudinary provides the secure URL directly
            updateData.image = req.file.path || req.file.secure_url || (() => {
                // Fallback for local upload
                const baseUrl = process.env.NODE_ENV === 'production' 
                    ? 'https://alankree-production.up.railway.app'
                    : 'http://localhost:5001';
                return `${baseUrl}/uploads/${req.file.filename}`;
            })();
        }
        
        const product = await Product.findByIdAndUpdate(
            productId,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        
        const product = await Product.findByIdAndDelete(productId);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get Inventory Status
exports.getInventoryStatus = async (req, res) => {
    try {
        // Get low stock products
        const lowStockProducts = await Product.find({ stock: { $lt: 10 } });
        
        // Get out of stock products
        const outOfStockProducts = await Product.find({ stock: 0 });
        
        // Get total inventory value
        const inventoryValue = await Product.aggregate([
            { $group: { _id: null, total: { $sum: { $multiply: ['$price', '$stock'] } } } }
        ]);
        
        const totalValue = inventoryValue.length > 0 ? inventoryValue[0].total : 0;
        
        res.status(200).json({
            success: true,
            inventory: {
                lowStockProducts,
                outOfStockProducts,
                totalValue,
                lowStockCount: lowStockProducts.length,
                outOfStockCount: outOfStockProducts.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get User Orders
exports.getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        const orders = await Order.find({ 'user.email': user.email })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            user: {
                name: user.name,
                email: user.email
            },
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
