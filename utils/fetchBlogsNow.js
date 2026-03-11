/**
 * One-time script: Fetch tech blogs and save to Blog collection (shows on /blog page).
 * Usage: node utils/fetchBlogsNow.js
 */
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import { runExternalBlogFetch } from './runBlogFetch.js';

dotenv.config();

async function main() {
  console.log('Connecting to DB...');
  await connectDB();
  console.log('Fetching tech blogs (Dev.to, Medium, HN) → Blog collection...');
  const result = await runExternalBlogFetch();
  console.log('Done!', result);
  process.exit(0);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
