const mongoose = require('mongoose');
const Product = require('./src/models/product');

// Load environment variables
require('dotenv').config();

const sampleProducts = [
  {
    name: "Banarasi Silk Saree - Red",
    description: "Exquisite handwoven Banarasi silk saree in rich red color with intricate gold zari work",
    price: 15000,
    originalPrice: 18000,
    category: "saree",
    image: "/images/saree1.jpg",
    rating: 4.5,
    reviews: 120,
    sizes: ["Free Size"]
  },
  {
    name: "Kanjivaram Silk Saree - Blue",
    description: "Traditional Kanjivaram silk saree in royal blue with temple border design",
    price: 18000,
    originalPrice: 22000,
    category: "saree",
    image: "/images/saree2.jpg",
    rating: 4.8,
    reviews: 85,
    sizes: ["Free Size"]
  },
  {
    name: "Chanderi Cotton Saree - Pink",
    description: "Lightweight Chanderi cotton saree perfect for daily wear in soft pink shade",
    price: 8000,
    originalPrice: 10000,
    category: "saree",
    image: "/images/saree3.jpg",
    rating: 4.2,
    reviews: 150,
    sizes: ["Free Size"]
  },
  {
    name: "Gold Jhumka Earrings",
    description: "Traditional gold-plated jhumka earrings with intricate patterns",
    price: 3500,
    originalPrice: 4000,
    category: "earrings",
    image: "/images/earring1.jpg",
    rating: 4.6,
    reviews: 95,
    sizes: ["One Size"]
  },
  {
    name: "Pearl Drop Earrings",
    description: "Elegant pearl drop earrings perfect for special occasions",
    price: 2500,
    originalPrice: 3000,
    category: "earrings",
    image: "/images/earring2.jpg",
    rating: 4.4,
    reviews: 70,
    sizes: ["One Size"]
  },
  {
    name: "Kundan Chandbali Earrings",
    description: "Beautiful kundan chandbali earrings with meenakari work",
    price: 4500,
    originalPrice: 5500,
    category: "earrings",
    image: "/images/earring3.jpg",
    rating: 4.7,
    reviews: 110,
    sizes: ["One Size"]
  }
];

async function populateProducts() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Created ${products.length} products successfully!`);

    console.log('\nProducts created:');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ${product.category} - ₹${product.price}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

populateProducts();
