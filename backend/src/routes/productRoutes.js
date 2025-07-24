const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Get all products
router.get('/', productController.getProducts);

// Get single product
router.get('/:id', productController.getProduct);

// Create product
router.post('/', productController.createProduct);

module.exports = router;
