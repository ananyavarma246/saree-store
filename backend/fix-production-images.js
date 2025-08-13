const mongoose = require('mongoose');

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://gssananyavarma2003:Anandananya2004@cluster0.08xgxv0.mongodb.net/alankree-saree-store?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Product schema (minimal for updates)
const ProductSchema = new mongoose.Schema({
    name: String,
    image: String,
});

const Product = mongoose.model('Product', ProductSchema);

async function fixProductionImageUrls() {
    try {
        console.log('🔄 Fixing production image URLs...');
        
        // Update any remaining localhost URLs to use production domain
        const result = await Product.updateMany(
            { image: { $regex: 'localhost:5001' } },
            [{ 
                $set: { 
                    image: { 
                        $replaceOne: { 
                            input: "$image", 
                            find: "http://localhost:5001", 
                            replacement: "https://alankree-production.up.railway.app" 
                        } 
                    } 
                } 
            }]
        );
        
        console.log(`✅ Updated ${result.modifiedCount} products with localhost URLs`);
        
        // Show all current products and their image URLs
        const products = await Product.find({}, 'name image').lean();
        console.log('\n📋 Current products in database:');
        products.forEach(p => {
            console.log(`- ${p.name}: ${p.image}`);
        });
        
        console.log(`\n🎉 Total products: ${products.length}`);
    } catch (error) {
        console.error('❌ Error fixing image URLs:', error);
    } finally {
        await mongoose.connection.close();
        console.log('📝 Database connection closed');
    }
}

// Connect and fix
connectDB().then(() => {
    fixProductionImageUrls();
});
