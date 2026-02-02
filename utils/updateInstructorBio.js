import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const updateInstructorBio = async () => {
  try {
    console.log('🔄 Updating instructor bio for all courses...');

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const coursesCollection = db.collection('courses');

    const newBio = 'Expert instructor with experience in teaching technology and programming. Passionate about making complex concepts simple and accessible.';

    // Update courses where instructor is an embedded object
    const result = await coursesCollection.updateMany(
      { 'instructor.name': 'Md Mijanur Molla' },
      { 
        $set: { 
          'instructor.bio': newBio
        } 
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} courses with new instructor bio`);
    console.log('🎉 Done!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

updateInstructorBio();
