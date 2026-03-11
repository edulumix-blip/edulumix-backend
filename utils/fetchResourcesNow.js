/**
 * One-time script: Fetch external resources and save to DB.
 * Usage: node utils/fetchResourcesNow.js
 */
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import { runExternalResourceFetch } from './runResourceFetch.js';

dotenv.config();

async function main() {
  console.log('Connecting to DB...');
  await connectDB();
  console.log('Running resource fetch (Dev.to, freeCodeCamp, Hashnode, YouTube, Medium, Hacker News)...');
  const result = await runExternalResourceFetch();
  console.log('Done!', result);
  process.exit(0);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
