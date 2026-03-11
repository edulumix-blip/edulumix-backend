/**
 * Count documents in MongoDB collections
 * Usage: node utils/countDbDocs.js
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;

  const collections = ['resources', 'blogs', 'jobs', 'courses'];
  const counts = {};

  for (const col of collections) {
    try {
      const c = await db.collection(col).countDocuments();
      counts[col] = c;
    } catch {
      counts[col] = 0;
    }
  }

  console.log('\n📊 Database document counts:');
  console.log('────────────────────────────');
  console.log('Resources (Dev.to, Medium, HN etc):', counts.resources);
  console.log('Blogs (Tech Blog/Events):           ', counts.blogs);
  console.log('Jobs:                               ', counts.jobs);
  console.log('Courses:                            ', counts.courses);
  console.log('────────────────────────────\n');

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
