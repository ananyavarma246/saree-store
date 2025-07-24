const bcrypt = require('bcrypt');

async function generateHash() {
    try {
        const password = 'admin123';
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        console.log('Generated hash for "admin123":', hash);
        
        // Test the hash
        const isValid = await bcrypt.compare('admin123', hash);
        console.log('Hash validation test:', isValid);
        
        // Test the current hash
        const currentHash = '$2b$10$qM7bK6X5iG0QXlAJ8r9YWu8P3hF9nG7KLmXvR2sPqA1oBcDeFgHiK';
        const currentValid = await bcrypt.compare('admin123', currentHash);
        console.log('Current hash validation:', currentValid);
        
    } catch (error) {
        console.error('Error:', error);
    }
}

generateHash();
