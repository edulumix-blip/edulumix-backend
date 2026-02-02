import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';

dotenv.config();

const checkCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const courses = await Course.find({}).sort({ createdAt: -1 }).limit(3);
    
    console.log('📚 Sample courses:');
    courses.forEach(course => {
      console.log(`\nTitle: ${course.title}`);
      console.log(`Instructor type: ${typeof course.instructor}`);
      console.log(`Instructor:`, course.instructor);
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkCourses();
