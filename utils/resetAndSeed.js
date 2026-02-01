import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const resetAndSeed = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Delete ALL existing super admins
    const deleted = await User.deleteMany({ role: 'super_admin' });
    console.log(`🗑️  Deleted ${deleted.deletedCount} existing super admin(s)`);

    // Create new super admin
    const superAdmin = await User.create({
      name: process.env.SUPER_ADMIN_NAME || 'Md Mijanur Molla',
      email: process.env.SUPER_ADMIN_EMAIL || 'md.mijanur@edulearnix.in',
      password: process.env.SUPER_ADMIN_PASSWORD || 'Mijanur@9735',
      role: 'super_admin',
      status: 'approved',
    });

    console.log('✅ New Super Admin created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Name:  ${superAdmin.name}`);
    console.log(`   Email: ${superAdmin.email}`);
    console.log(`   Role:  ${superAdmin.role}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

resetAndSeed();
