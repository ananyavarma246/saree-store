const mongoose = require('mongoose');
const Order = require('../models/order');
const User = require('../models/user');
const { createNewOrderNotification, createOrderCancelledNotification } = require('./notificationController');

// Create new order
exports.createOrder = async (req, res) => {
    try {
        let userData;
        
        // Check if user is authenticated (has req.user from middleware)
        if (req.user && req.user.id) {
            try {
                // Get user information from database
                const user = await User.findById(req.user.id);
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: 'User not found'
                    });
                }
                userData = {
                    name: user.name,
                    email: user.email,
                    address: req.body.shippingAddress || user.addresses.find(addr => addr.isDefault) || user.addresses[0]
                };
            } catch (dbError) {
                console.log('Error fetching user from database:', dbError);
                return res.status(500).json({
                    success: false,
                    message: 'Database error while fetching user'
                });
            }
        } else {
            // For guest orders or when user data is sent in request body
            userData = req.body.user;
            if (!userData || !userData.name || !userData.email) {
                return res.status(400).json({
                    success: false,
                    message: 'User information is required'
                });
            }
            
            // Check if user exists, if not create a new user record
            try {
                let existingUser = await User.findOne({ email: userData.email });
                
                if (!existingUser) {
                    // Create new user record for guest checkout
                    const newUser = new User({
                        name: userData.name,
                        email: userData.email,
                        phone: req.body.customerInfo?.phone || '',
                        addresses: [{
                            address: req.body.customerInfo?.address || '',
                            city: req.body.customerInfo?.city || '',
                            state: req.body.customerInfo?.state || '',
                            zipCode: req.body.customerInfo?.zipCode || '',
                            isDefault: true
                        }],
                        isRegistered: false, // Mark as guest user
                        orders: []
                    });
                    
                    await newUser.save();
                    console.log('✅ Created new user record for guest order:', userData.email);
                } else {
                    console.log('✅ User already exists:', userData.email);
                }
            } catch (userError) {
                console.log('Warning: Could not create/update user record:', userError.message);
                // Continue with order creation even if user creation fails
            }
        }

        // Create order data for MongoDB
        const mongoOrderData = {
            user: userData,
            orderItems: req.body.orderItems.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.image
            })),
            paymentMethod: req.body.paymentMethod,
            paymentResult: req.body.paymentResult,
            totalPrice: req.body.totalPrice,
            shippingAddress: req.body.shippingAddress,
            status: 'pending',
            statusHistory: [{
                status: 'pending',
                updatedAt: new Date(),
                notes: 'Order placed successfully',
                updatedBy: 'system'
            }]
        };
        
        // Always save to MongoDB
        const newOrder = new Order(mongoOrderData);
        await newOrder.save();
        
        console.log('Order saved to MongoDB successfully:', newOrder._id);

        // Update user's orders array
        try {
            const user = await User.findOne({ email: userData.email });
            if (user) {
                user.orders.push(newOrder._id);
                await user.save();
                console.log('✅ Updated user orders array');
            }
        } catch (userUpdateError) {
            console.log('Warning: Could not update user orders:', userUpdateError.message);
        }

        // Create notification for admin (if notification system is available)
        try {
            createNewOrderNotification(newOrder);
        } catch (notificationError) {
            console.log('Notification system not available:', notificationError.message);
        }

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order: newOrder
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to create order',
            error: error.message
        });
    }
};

// Get all orders (for admin)
exports.getAllOrders = async (req, res) => {
    try {
        // Always fetch from MongoDB
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .exec();
        
        console.log(`Fetched ${orders.length} orders from MongoDB`);
        
        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch orders',
            error: error.message
        });
    }
};

// Get single order details
exports.getOrderDetails = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('orderItems.product');

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update order status (for admin)
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Update order status
        order.orderStatus = req.body.status;

        // If order is delivered, add delivered date
        if (req.body.status === 'delivered') {
            order.deliveredAt = Date.now();
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get customer's orders
exports.getMyOrders = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const orders = await Order.find({ 'user.email': user.email })
            .populate('orderItems.product')
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

// Track Order (public route)
exports.trackOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required to track order'
            });
        }

        const order = await Order.findOne({ 
            _id: orderId, 
            'user.email': email 
        }).populate('orderItems.product');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found or email does not match'
            });
        }

        res.status(200).json({
            success: true,
            order: {
                _id: order._id,
                orderStatus: order.orderStatus,
                statusHistory: order.statusHistory,
                delivery: order.delivery,
                totalPrice: order.totalPrice,
                createdAt: order.createdAt,
                confirmedAt: order.confirmedAt,
                shippedAt: order.shippedAt,
                deliveredAt: order.deliveredAt,
                orderItems: order.orderItems
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Cancel Order
exports.cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const user = await User.findById(req.user.id);

        const order = await Order.findOne({ 
            _id: id, 
            'user.email': user.email 
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (['delivered', 'cancelled'].includes(order.orderStatus)) {
            return res.status(400).json({
                success: false,
                message: `Cannot cancel order that is already ${order.orderStatus}`
            });
        }

        if (order.orderStatus === 'shipped') {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel order that has already been shipped'
            });
        }

        order.orderStatus = 'cancelled';
        order.statusHistory.push({
            status: 'cancelled',
            updatedAt: new Date(),
            notes: reason || 'Cancelled by customer',
            updatedBy: 'customer'
        });

        await order.save();

        // Create notification for admin
        createOrderCancelledNotification(order);

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
