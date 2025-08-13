const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function generateSecurePassword() {
    console.log('🔐 Secure Admin Password Generator');
    console.log('================================');
    
    rl.question('Enter your new admin password: ', async (password) => {
        if (password.length < 8) {
            console.log('❌ Password must be at least 8 characters long');
            process.exit(1);
        }
        
        try {
            const saltRounds = 12; // Higher security
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            
            console.log('');
            console.log('✅ Password hashed successfully!');
            console.log('');
            console.log('Add this to your Railway environment variables:');
            console.log('================================================');
            console.log(`ADMIN_PASSWORD_HASH=${hashedPassword}`);
            console.log('');
            console.log('🔒 Keep this hash secret and secure!');
            console.log('🚀 Update Railway dashboard → Variables → ADMIN_PASSWORD_HASH');
            
        } catch (error) {
            console.error('❌ Error generating hash:', error);
        }
        
        rl.close();
    });
}

generateSecurePassword();
