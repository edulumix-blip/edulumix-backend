import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const fetchSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find super admin
    const superAdmin = await User.findOne({ role: 'super_admin' });
    
    if (!superAdmin) {
      console.log('❌ No super admin found in database');
      process.exit(1);
    }

    console.log('\n🔑 Super Admin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Name:     ${superAdmin.name}`);
    console.log(`   Email:    ${superAdmin.email}`);
    console.log(`   Role:     ${superAdmin.role}`);
    console.log(`   Status:   ${superAdmin.status}`);
    console.log(`   Password: (hashed) ${superAdmin.password.substring(0, 30)}...`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fetchSuperAdmin();
