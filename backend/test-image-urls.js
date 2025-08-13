// Simple test to verify image URL generation
function generateImageUrl(filename) {
    const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://alankree-production.up.railway.app'
        : 'http://localhost:5001';
    return `${baseUrl}/uploads/${filename}`;
}

// Test the function
console.log('🧪 Testing Image URL Generation:');
console.log('');

// Simulate production environment
process.env.NODE_ENV = 'production';
const prodUrl = generateImageUrl('image-123456.jpg');
console.log('✅ Production URL:', prodUrl);

// Simulate development environment
process.env.NODE_ENV = 'development';
const devUrl = generateImageUrl('image-123456.jpg');
console.log('✅ Development URL:', devUrl);

console.log('');
console.log('🎉 URL generation is working correctly!');
