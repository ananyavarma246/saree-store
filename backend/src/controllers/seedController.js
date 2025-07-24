const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');

// Seed sample data for testing admin portal
exports.seedSampleData = async (req, res) => {
    try {
        // Create sample products
        const sampleProducts = [
            {
                name: "Royal Red Silk Saree",
                description: "Beautiful red silk saree with golden border",
                price: 2500,
                originalPrice: 3000,
                category: "saree",
                image: "/images/red-silk-saree.jpg",
                rating: 4.5,
                sizes: ["Free Size"]
            },
            {
                name: "Blue Cotton Saree",
                description: "Comfortable blue cotton saree for daily wear",
                price: 1200,
                originalPrice: 1500,
                category: "saree",
                image: "/images/blue-cotton-saree.jpg",
                rating: 4.2,
                sizes: ["Free Size"]
            },
            {
                name: "Green Georgette Saree",
                description: "Elegant green georgette saree with embroidery",
                price: 1800,
                originalPrice: 2200,
                category: "saree",
                image: "/images/green-georgette-saree.jpg",
                rating: 4.7,
                sizes: ["Free Size"]
            },
            {
                name: "Golden Pearl Earrings",
                description: "Beautiful golden pearl drop earrings",
                price: 800,
                originalPrice: 1000,
                category: "earrings",
                image: "/images/golden-pearl-earrings.jpg",
                rating: 4.3,
                sizes: ["One Size"]
            },
            {
                name: "Silver Jhumka Earrings",
                description: "Traditional silver jhumka earrings",
                price: 600,
                originalPrice: 750,
                category: "earrings",
                image: "/images/silver-jhumka-earrings.jpg",
                rating: 4.6,
                sizes: ["One Size"]
            }
        ];

        // Clear existing products and add sample ones
        await Product.deleteMany({});
        const products = await Product.insertMany(sampleProducts);

        // Create sample users
        const sampleUsers = [
            {
                name: "Priya Sharma",
                email: "priya@example.com",
                password: "$2b$10$z/Oh9ClDGE9Xbr44XbWijOQlC4rIOEchqKV4fZt8hsVOxny0i1CqO", // "password123"
                phone: "+91 98765 43210",
                addresses: [{
                    name: "Home",
                    street: "123 MG Road",
                    city: "Mumbai",
                    state: "Maharashtra",
                    pincode: "400001",
                    country: "India",
                    isDefault: true
                }],
                role: "user"
            },
            {
                name: "Anita Verma",
                email: "anita@example.com",
                password: "$2b$10$z/Oh9ClDGE9Xbr44XbWijOQlC4rIOEchqKV4fZt8hsVOxny0i1CqO",
                phone: "+91 98765 43211",
                addresses: [{
                    name: "Home",
                    street: "456 Park Street",
                    city: "Delhi",
                    state: "Delhi",
                    pincode: "110001",
                    country: "India",
                    isDefault: true
                }],
                role: "user"
            }
        ];

        await User.deleteMany({ role: 'user' });
        const users = await User.insertMany(sampleUsers);

        // Create sample orders
        const sampleOrders = [
            {
                user: {
                    name: "Priya Sharma",
                    email: "priya@example.com",
                    address: {
                        street: "123 MG Road",
                        city: "Mumbai",
                        state: "Maharashtra",
                        pincode: "400001",
                        country: "India"
                    }
                },
                orderItems: [
                    {
                        product: products[0]._id,
                        name: "Royal Red Silk Saree",
                        quantity: 1,
                        price: 2500,
                        image: "/images/red-silk-saree.jpg"
                    }
                ],
                paymentMethod: "cod",
                totalPrice: 2500,
                orderStatus: "delivered",
                statusHistory: [
                    {
                        status: "pending",
                        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                        notes: "Order placed",
                        updatedBy: "system"
                    },
                    {
                        status: "confirmed",
                        updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
                        notes: "Order confirmed",
                        updatedBy: "admin"
                    },
                    {
                        status: "delivered",
                        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                        notes: "Order delivered successfully",
                        updatedBy: "admin"
                    }
                ],
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            },
            {
                user: {
                    name: "Anita Verma",
                    email: "anita@example.com",
                    address: {
                        street: "456 Park Street",
                        city: "Delhi",
                        state: "Delhi",
                        pincode: "110001",
                        country: "India"
                    }
                },
                orderItems: [
                    {
                        product: products[1]._id,
                        name: "Blue Cotton Saree",
                        quantity: 2,
                        price: 1200,
                        image: "/images/blue-cotton-saree.jpg"
                    }
                ],
                paymentMethod: "card",
                totalPrice: 2400,
                orderStatus: "shipped",
                statusHistory: [
                    {
                        status: "pending",
                        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                        notes: "Order placed",
                        updatedBy: "system"
                    },
                    {
                        status: "confirmed",
                        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                        notes: "Order confirmed",
                        updatedBy: "admin"
                    },
                    {
                        status: "shipped",
                        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                        notes: "Order shipped",
                        updatedBy: "admin"
                    }
                ],
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
            },
            {
                user: {
                    name: "Priya Sharma",
                    email: "priya@example.com",
                    address: {
                        street: "123 MG Road",
                        city: "Mumbai",
                        state: "Maharashtra",
                        pincode: "400001",
                        country: "India"
                    }
                },
                orderItems: [
                    {
                        product: products[2]._id,
                        name: "Green Georgette Saree",
                        quantity: 1,
                        price: 1800,
                        image: "/images/green-georgette-saree.jpg"
                    }
                ],
                paymentMethod: "upi",
                totalPrice: 1800,
                orderStatus: "pending",
                statusHistory: [
                    {
                        status: "pending",
                        updatedAt: new Date(),
                        notes: "Order placed",
                        updatedBy: "system"
                    }
                ],
                createdAt: new Date()
            }
        ];

        await Order.deleteMany({});
        await Order.insertMany(sampleOrders);

        res.status(200).json({
            success: true,
            message: "Sample data created successfully",
            data: {
                products: products.length,
                users: users.length,
                orders: sampleOrders.length
            }
        });
    } catch (error) {
        console.error('Seed data error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to create sample data",
            error: error.message
        });
    }
};
