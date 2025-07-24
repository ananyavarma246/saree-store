const Product = require('../models/product');

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        
        // Filter by category if provided
        if (category) {
            query.category = category;
        }
        
        const products = await Product.find(query);
        res.json({
            success: true,
            products: products
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Get single product
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create product
exports.createProduct = async (req, res) => {
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        originalPrice: req.body.originalPrice,
        category: req.body.category,
        image: req.body.image,
        rating: req.body.rating,
        reviews: req.body.reviews,
        sizes: req.body.sizes
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
