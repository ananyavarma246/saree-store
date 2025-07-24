const mongoose = require('mongoose');
const User = require('./src/models/user');
const bcrypt = require('bcrypt');

// Load environment variables
require('dotenv').config();

async function updateUserPassword() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find the user
    const user = await User.findOne({ email: 'ananyavarma9052911139@gmail.com' });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('\n🔍 CURRENT USER DETAILS:');
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Current password (hashed): ${user.password}`);
    
    // Update password to 123456
    console.log('\n🔄 UPDATING PASSWORD TO: 123456');
    user.password = '123456'; // This will be automatically hashed by the pre-save hook
    await user.save();
    
    console.log('✅ Password updated successfully!');
    
    // Verify the new password
    console.log('\n🔐 TESTING NEW PASSWORD:');
    const testPassword = '123456';
    const isMatch = await user.comparePassword(testPassword);
    console.log(`Password "${testPassword}" match: ${isMatch}`);
    
    // Test wrong password
    const wrongPassword = 'guestuser123';
    const wrongMatch = await user.comparePassword(wrongPassword);
    console.log(`Wrong password "${wrongPassword}" match: ${wrongMatch}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

updateUserPassword();
