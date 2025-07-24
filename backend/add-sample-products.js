const mongoose = require('mongoose');
const Product = require('./src/models/product');

// Connect to MongoDB
mongoose.connect('mongodb+srv://gssananyavarma2003:Anandananya2004@cluster0.08xgxv0.mongodb.net/alankree-saree-store?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

const sampleProducts = [
  {
    name: "Elegant Red Silk Saree",
    description: "Beautiful red silk saree perfect for special occasions. Features intricate gold work and traditional patterns.",
    price: 2500,
    originalPrice: 3000,
    category: "saree",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&h=600&fit=crop",
    rating: 4.5,
    reviews: 25,
    sizes: ["Free Size"]
  },
  {
    name: "Classic Blue Cotton Saree",
    description: "Comfortable cotton saree in beautiful blue color. Perfect for daily wear and casual events.",
    price: 1200,
    originalPrice: 1500,
    category: "saree",
    image: "https://images.unsplash.com/photo-1594736797933-d0c6e5c7c7e6?w=500&h=600&fit=crop",
    rating: 4.2,
    reviews: 18,
    sizes: ["Free Size"]
  },
  {
    name: "Traditional Green Banarasi Saree",
    description: "Authentic Banarasi saree in green with gold zari work. A timeless piece for weddings and festivals.",
    price: 4500,
    originalPrice: 5500,
    category: "saree",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=600&fit=crop",
    rating: 4.8,
    reviews: 42,
    sizes: ["Free Size"]
  },
  {
    name: "Golden Pearl Drop Earrings",
    description: "Elegant pearl drop earrings with gold finish. Perfect complement to traditional outfits.",
    price: 800,
    originalPrice: 1000,
    category: "earrings",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=600&fit=crop",
    rating: 4.3,
    reviews: 15,
    sizes: ["One Size"]
  },
  {
    name: "Silver Jhumka Earrings",
    description: "Traditional silver jhumka earrings with intricate designs. A classic choice for ethnic wear.",
    price: 600,
    originalPrice: 750,
    category: "earrings",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=600&fit=crop",
    rating: 4.1,
    reviews: 22,
    sizes: ["One Size"]
  },
  {
    name: "Diamond Stud Earrings",
    description: "Sparkling diamond stud earrings perfect for special occasions and everyday elegance.",
    price: 1500,
    originalPrice: 1800,
    category: "earrings",
    image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&h=600&fit=crop",
    rating: 4.7,
    reviews: 38,
    sizes: ["One Size"]
  }
];

async function addSampleProducts() {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Add sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Added ${products.length} sample products`);
    
    console.log('Sample products:');
    products.forEach(product => {
      console.log(`- ${product.name} (${product.category}) - ₹${product.price}`);
    });
    
  } catch (error) {
    console.error('Error adding sample products:', error);
  } finally {
    mongoose.connection.close();
  }
}

addSampleProducts();
