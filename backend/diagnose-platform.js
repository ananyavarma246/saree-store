// Quick diagnostic to check what's wrong with the deployment
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function diagnosePlatform() {
    console.log('🔍 DIAGNOSING PLATFORM ISSUES...\n');
    
    // Test 1: Backend Health
    console.log('1. Testing Backend Health...');
    try {
        const response = await fetch('https://alankree-production.up.railway.app/api/products');
        const data = await response.json();
        console.log(`✅ Backend Status: ${response.status}`);
        console.log(`✅ Products Available: ${data.products?.length || 0}`);
        
        if (data.products && data.products.length > 0) {
            console.log('📋 Sample Products:');
            data.products.slice(0, 3).forEach((p, i) => {
                console.log(`   ${i+1}. ${p.name} - ${p.category} - ₹${p.price}`);
            });
        }
    } catch (error) {
        console.log('❌ Backend Error:', error.message);
    }
    
    // Test 2: Admin Login
    console.log('\n2. Testing Admin Login...');
    try {
        const response = await fetch('https://alankree-production.up.railway.app/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@alankree.com',
                password: 'admin123'
            })
        });
        
        const data = await response.json();
        console.log(`Status: ${response.status}`);
        console.log(`Response:`, data);
        
        if (!data.success) {
            console.log('❌ Admin login failing - likely environment variable issue');
            console.log('💡 SOLUTION: Update Railway environment variables:');
            console.log('   ADMIN_EMAIL=admin@alankree.com');
            console.log('   ADMIN_PASSWORD_HASH=$2b$12$FMu3EgqLiSvpkWvNV8ZeMO7bWV8OgqnI/gnkez7PrSul2tDuzDTDW');
        }
    } catch (error) {
        console.log('❌ Admin Login Error:', error.message);
    }
    
    // Test 3: Category Filtering
    console.log('\n3. Testing Category Filtering...');
    try {
        const response = await fetch('https://alankree-production.up.railway.app/api/products?category=sarees');
        const data = await response.json();
        console.log(`✅ Sarees Category: ${data.products?.length || 0} products found`);
        
        if (data.products) {
            data.products.forEach((p, i) => {
                console.log(`   ${i+1}. ${p.name} (${p.category})`);
            });
        }
    } catch (error) {
        console.log('❌ Category Filter Error:', error.message);
    }
    
    console.log('\n🎯 SUMMARY OF ISSUES:');
    console.log('1. If admin login fails → Update Railway environment variables');
    console.log('2. If products not showing → Check frontend API calls');
    console.log('3. If images not loading → Check image URLs');
}

diagnosePlatform().catch(console.error);
