const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        address: {
            street: String,
            city: String,
            state: String,
            pincode: String,
            country: String
        }
    },
    orderItems: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: false  // Make it optional for now
        },
        productId: String,  // Add this for storing simple product IDs
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        price: {
            type: Number,
            required: true
        },
        image: String
    }],
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cod', 'card', 'upi']
    },
    paymentResult: {
        status: String,
        transactionId: String,
        updateTime: String
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    statusHistory: [{
        status: {
            type: String,
            required: true
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        notes: String,
        updatedBy: String
    }],
    confirmedAt: Date,
    processingAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    delivery: {
        status: {
            type: String,
            enum: ['pending', 'assigned', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed'],
            default: 'pending'
        },
        trackingNumber: String,
        estimatedDelivery: Date,
        agent: {
            name: String,
            phone: String,
            email: String,
            assignedAt: Date
        },
        updatedAt: Date
    },
    notes: String,
    adminNotes: String
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
