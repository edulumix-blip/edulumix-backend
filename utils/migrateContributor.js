import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Blog from '../models/Blog.js';
import Resource from '../models/Resource.js';
import Course from '../models/Course.js';
import MockTest from '../models/MockTest.js';
import DigitalProduct from '../models/DigitalProduct.js';

dotenv.config();

const migrateContributorData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find current super admin
    const superAdmin = await User.findOne({ role: 'super_admin' });
    
    if (!superAdmin) {
      console.log('❌ No super admin found!');
      process.exit(1);
    }

    console.log(`\n🔧 Migrating all content to Super Admin:`);
    console.log(`   Name: ${superAdmin.name}`);
    console.log(`   Email: ${superAdmin.email}`);
    console.log(`   ID: ${superAdmin._id}\n`);

    // Update all Jobs
    const jobsUpdated = await Job.updateMany(
      {},
      { $set: { contributor: superAdmin._id } }
    );
    console.log(`✅ Updated ${jobsUpdated.modifiedCount} jobs`);

    // Update all Blogs
    const blogsUpdated = await Blog.updateMany(
      {},
      { $set: { author: superAdmin._id } }
    );
    console.log(`✅ Updated ${blogsUpdated.modifiedCount} blogs`);

    // Update all Resources
    const resourcesUpdated = await Resource.updateMany(
      {},
      { $set: { contributor: superAdmin._id } }
    );
    console.log(`✅ Updated ${resourcesUpdated.modifiedCount} resources`);

    // Update all Courses
    const coursesUpdated = await Course.updateMany(
      {},
      { $set: { instructor: superAdmin._id } }
    );
    console.log(`✅ Updated ${coursesUpdated.modifiedCount} courses`);

    // Update all Mock Tests
    const mockTestsUpdated = await MockTest.updateMany(
      {},
      { $set: { creator: superAdmin._id } }
    );
    console.log(`✅ Updated ${mockTestsUpdated.modifiedCount} mock tests`);

    // Update all Digital Products
    const productsUpdated = await DigitalProduct.updateMany(
      {},
      { $set: { seller: superAdmin._id } }
    );
    console.log(`✅ Updated ${productsUpdated.modifiedCount} digital products`);

    console.log('\n🎉 Migration completed successfully!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during migration:', error.message);
    process.exit(1);
  }
};

migrateContributorData();
