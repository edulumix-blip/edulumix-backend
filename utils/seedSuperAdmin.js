import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if super admin already exists
    const existingAdmin = await User.findOne({ role: 'super_admin' });
    
    if (existingAdmin) {
      console.log('⚠️  Super Admin already exists:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log('   Skipping seed...');
      process.exit(0);
    }

    // Create super admin
    const superAdmin = await User.create({
      name: process.env.SUPER_ADMIN_NAME || 'Md Mijanur Molla',
      email: process.env.SUPER_ADMIN_EMAIL || 'mdmijanur.molla@edulearnix.com',
      password: process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123',
      role: 'super_admin',
      status: 'approved',
    });

    console.log('✅ Super Admin created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Name:  ${superAdmin.name}`);
    console.log(`   Email: ${superAdmin.email}`);
    console.log(`   Role:  ${superAdmin.role}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Super Admin:', error.message);
    process.exit(1);
  }
};

seedSuperAdmin();
