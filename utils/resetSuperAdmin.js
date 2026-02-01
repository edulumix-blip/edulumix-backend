import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const resetSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Delete existing super admin
    const deleted = await User.deleteOne({ email: 'mdmijanur.molla@edulearnix.com' });
    console.log('🗑️  Deleted existing super admin:', deleted.deletedCount);

    // Create new super admin (password will be hashed by pre-save hook)
    const superAdmin = await User.create({
      name: process.env.SUPER_ADMIN_NAME || 'Md Mijanur Molla',
      email: process.env.SUPER_ADMIN_EMAIL || 'mdmijanur.molla@edulearnix.com',
      password: process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123',
      role: 'super_admin',
      status: 'approved',
    });

    console.log('✅ Super Admin recreated successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Email: ${superAdmin.email}`);
    console.log(`   Password: SuperAdmin@123`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

resetSuperAdmin();
