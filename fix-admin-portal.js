// Script to fix admin portal issues
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function fixAdminPortal() {
    console.log('🔧 FIXING ADMIN PORTAL ISSUES...\n');
    
    // Step 1: Test current admin login status
    console.log('1. Testing current admin login...');
    try {
        const loginResponse = await fetch('https://alankree-production.up.railway.app/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@alankree.com',
                password: 'admin123'
            })
        });
        
        const loginData = await loginResponse.json();
        console.log(`Status: ${loginResponse.status}`);
        console.log(`Response:`, loginData);
        
        if (loginData.success) {
            console.log('✅ Admin login working!');
            return; // No need to continue if it's working
        } else {
            console.log('❌ Admin login failing - fixing environment variables...');
        }
    } catch (error) {
        console.log('❌ Admin login error:', error.message);
    }
    
    // Step 2: Check what admin credentials are expected
    console.log('\n2. Checking backend admin controller...');
    console.log('Expected credentials:');
    console.log('Email: admin@alankree.com');
    console.log('Password: admin123');
    console.log('Hash: $2b$12$FMu3EgqLiSvpkWvNV8ZeMO7bWV8OgqnI/gnkez7PrSul2tDuzDTDW');
    
    // Step 3: Test if environment variables are accessible
    console.log('\n3. Testing environment variable access...');
    try {
        const response = await fetch('https://alankree-production.up.railway.app/api/admin/debug-env', {
            method: 'GET'
        });
        console.log('Debug endpoint status:', response.status);
    } catch (error) {
        console.log('Debug endpoint not available - need to add it');
    }
    
    console.log('\n🎯 SOLUTION STEPS:');
    console.log('1. Go to Railway Dashboard: https://railway.app/');
    console.log('2. Find your "alankree-production" project');
    console.log('3. Go to Settings > Environment Variables');
    console.log('4. Add these variables:');
    console.log('   ADMIN_EMAIL=admin@alankree.com');
    console.log('   ADMIN_PASSWORD_HASH=$2b$12$FMu3EgqLiSvpkWvNV8ZeMO7bWV8OgqnI/gnkez7PrSul2tDuzDTDW');
    console.log('5. Click "Deploy" to restart the service');
    console.log('\n📱 Alternative: Use Railway CLI:');
    console.log('   railway variables set ADMIN_EMAIL=admin@alankree.com');
    console.log('   railway variables set ADMIN_PASSWORD_HASH="$2b$12$FMu3EgqLiSvpkWvNV8ZeMO7bWV8OgqnI/gnkez7PrSul2tDuzDTDW"');
}

fixAdminPortal().catch(console.error);
