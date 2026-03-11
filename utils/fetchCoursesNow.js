/**
 * One-time script: Fetch external courses and save to DB.
 * Usage: node utils/fetchCoursesNow.js
 */
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import { runExternalCourseFetch } from './runCourseFetch.js';

dotenv.config();

async function main() {
  console.log('Connecting to DB...');
  await connectDB();
  console.log('Running course fetch (Udemy)...');
  const result = await runExternalCourseFetch(10);
  console.log('Done!', result);
  process.exit(0);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
