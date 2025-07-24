const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const productRoutes = require('./src/routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection using Atlas
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alankree-saree-store')
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Routes
app.use('/api/products', productRoutes);

// Add admin routes
const adminRoutes = require('./src/routes/adminRoutes');
app.use('/api/admin', adminRoutes);

app.post('/api/cart', (req, res) => {
  const { productId } = req.body;
  console.log(`Product ${productId} added to cart`);
  res.json({ success: true, message: `Product ${productId} added to cart` });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});