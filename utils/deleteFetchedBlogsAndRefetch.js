/**
 * Delete all fetched blogs, then fetch fresh from Dev.to + Medium only.
 * Usage: node utils/deleteFetchedBlogsAndRefetch.js
 */
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import { deleteFetchedBlogs, runExternalBlogFetch } from './runBlogFetch.js';

dotenv.config();

async function main() {
  console.log('Connecting to DB...');
  await connectDB();

  console.log('Deleting previously fetched blogs (keeping manual blogs)...');
  const del = await deleteFetchedBlogs();
  console.log('Deleted:', del.deleted);

  console.log('Fetching fresh blogs from Dev.to + Medium only...');
  const result = await runExternalBlogFetch({ devToPerPage: 25, mediumLimit: 25 });
  console.log('Done!', result);

  process.exit(0);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
