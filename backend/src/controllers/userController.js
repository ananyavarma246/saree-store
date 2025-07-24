const User = require('../models/user');
const Order = require('../models/order');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Admin credentials (same as in adminController)
const ADMIN_CREDENTIALS = {
    email: 'admin@alankree.com',
    password: '$2b$10$z/Oh9ClDGE9Xbr44XbWijOQlC4rIOEchqKV4fZt8hsVOxny0i1CqO' // "admin123"
};

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '30d'
    });
};

// Register User
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            phone
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Login User (with admin check)
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if this is an admin login
        if (email === ADMIN_CREDENTIALS.email) {
            const isAdminPasswordValid = await bcrypt.compare(password, ADMIN_CREDENTIALS.password);
            if (isAdminPasswordValid) {
                // Generate admin token
                const token = generateToken('admin');
                
                return res.status(200).json({
                    success: true,
                    message: 'Admin login successful',
                    token,
                    user: {
                        id: 'admin',
                        name: 'Administrator',
                        email: email,
                        phone: '',
                        addresses: [],
                        role: 'admin',
                        isAdmin: true
                    }
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }
        }

        // Regular user login
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                addresses: user.addresses,
                role: 'user',
                isAdmin: false
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password')
            .populate('wishlist');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
    try {
        const { name, phone, preferences } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, phone, preferences },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// Add to Cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        
        const user = await User.findById(req.user.id);
        
        // Check if product already in cart
        const existingItem = user.cart.find(item => 
            item.product.toString() === productId
        );
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.cart.push({ product: productId, quantity });
        }
        
        await user.save();
        
        const updatedUser = await User.findById(req.user.id)
            .populate('cart.product');
        
        res.status(200).json({
            success: true,
            message: 'Product added to cart',
            cart: updatedUser.cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get Cart
exports.getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('cart.product');
        
        res.status(200).json({
            success: true,
            cart: user.cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        
        const user = await User.findById(req.user.id);
        user.cart = user.cart.filter(item => 
            item.product.toString() !== productId
        );
        
        await user.save();
        
        const updatedUser = await User.findById(req.user.id)
            .populate('cart.product');
        
        res.status(200).json({
            success: true,
            message: 'Product removed from cart',
            cart: updatedUser.cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update Cart Quantity
exports.updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        
        const user = await User.findById(req.user.id);
        const cartItem = user.cart.find(item => 
            item.product.toString() === productId
        );
        
        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Product not found in cart'
            });
        }
        
        cartItem.quantity = quantity;
        await user.save();
        
        const updatedUser = await User.findById(req.user.id)
            .populate('cart.product');
        
        res.status(200).json({
            success: true,
            message: 'Cart quantity updated',
            cart: updatedUser.cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Add to Wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        
        const user = await User.findById(req.user.id);
        
        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
            await user.save();
        }
        
        const updatedUser = await User.findById(req.user.id)
            .populate('wishlist');
        
        res.status(200).json({
            success: true,
            message: 'Product added to wishlist',
            wishlist: updatedUser.wishlist
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Remove from Wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        
        const user = await User.findById(req.user.id);
        user.wishlist = user.wishlist.filter(id => 
            id.toString() !== productId
        );
        
        await user.save();
        
        const updatedUser = await User.findById(req.user.id)
            .populate('wishlist');
        
        res.status(200).json({
            success: true,
            message: 'Product removed from wishlist',
            wishlist: updatedUser.wishlist
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get Wishlist
exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('wishlist');
        
        res.status(200).json({
            success: true,
            wishlist: user.wishlist
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Add Address
exports.addAddress = async (req, res) => {
    try {
        const addressData = req.body;
        
        const user = await User.findById(req.user.id);
        
        // If this is the first address, make it default
        if (user.addresses.length === 0) {
            addressData.isDefault = true;
        }
        
        // If setting as default, remove default from other addresses
        if (addressData.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }
        
        user.addresses.push(addressData);
        await user.save();
        
        res.status(200).json({
            success: true,
            message: 'Address added successfully',
            addresses: user.addresses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Update Address
exports.updateAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const addressData = req.body;
        
        const user = await User.findById(req.user.id);
        const address = user.addresses.id(addressId);
        
        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }
        
        // If setting as default, remove default from other addresses
        if (addressData.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }
        
        Object.assign(address, addressData);
        await user.save();
        
        res.status(200).json({
            success: true,
            message: 'Address updated successfully',
            addresses: user.addresses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Delete Address
exports.deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        
        const user = await User.findById(req.user.id);
        user.addresses.id(addressId).remove();
        
        await user.save();
        
        res.status(200).json({
            success: true,
            message: 'Address deleted successfully',
            addresses: user.addresses
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
        const user = await User.findById(req.user.id);
        
        const orders = await Order.find({ 'user.email': user.email })
            .populate('orderItems.product')
            .sort({ createdAt: -1 });
        
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
