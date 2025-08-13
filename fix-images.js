require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    originalPrice: Number,
    category: String,
    image: String,
    rating: Number,
    reviews: Number,
    sizes: [String],
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

async function fixImages() {
    try {
        console.log('🔄 Updating product images...');
        
        // Update template products with placeholder images
        await Product.updateOne(
            { name: 'Kanjivaram Silk Saree - Blue' },
            { image: 'https://via.placeholder.com/400x500/4A90E2/FFFFFF?text=Kanjivaram+Silk+Saree' }
        );
        
        await Product.updateOne(
            { name: 'Chanderi Cotton Saree - Pink' },
            { image: 'https://via.placeholder.com/400x500/FF6B9D/FFFFFF?text=Chanderi+Cotton+Saree' }
        );
        
        await Product.updateOne(
            { name: 'Gold Jhumka Earrings' },
            { image: 'https://via.placeholder.com/400x500/FFD700/000000?text=Gold+Jhumka+Earrings' }
        );
        
        // Update any localhost URLs to placeholder images
        await Product.updateMany(
            { image: { $regex: 'localhost' } },
            { image: 'https://via.placeholder.com/400x500/8E44AD/FFFFFF?text=Custom+Product' }
        );
        
        console.log('✅ Image URLs updated successfully!');
        
        // Show updated products
        const products = await Product.find({});
        console.log('\n📋 Updated products:');
        products.forEach(p => {
            console.log(`- ${p.name}: ${p.image}`);
        });
        
        mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error updating images:', error);
        mongoose.connection.close();
    }
}

fixImages();
