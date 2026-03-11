/**
 * Fetch tech blogs from Dev.to and Medium only. Save to Blog (Tech Blog page).
 * Super Admin as author. Cover image required - shown on each blog.
 */
import Blog from '../models/Blog.js';
import User from '../models/User.js';
import { fetchAllBlogSources } from '../services/blogFetchService.js';

export async function runExternalBlogFetch(opts = {}) {
  const superAdmin = await User.findOne({ role: 'super_admin' });
  if (!superAdmin) throw new Error('Super Admin user not found. Run npm run seed first.');

  const results = await fetchAllBlogSources(opts);
  const all = [...results.devto, ...results.medium];

  let created = 0;
  let skipped = 0;

  for (const raw of all) {
    const exists = await Blog.findOne({ source: raw.source, externalId: raw.externalId });
    if (exists) { skipped++; continue; }
    if (!raw.link || !raw.title) continue;

    const content = (raw.description || raw.title) + `\n\n**Read full article:** [${raw.link}](${raw.link})`;
    await Blog.create({
      title: raw.title.slice(0, 200),
      content,
      excerpt: (raw.description || raw.title).slice(0, 300),
      shortDescription: (raw.description || raw.title).slice(0, 500),
      category: 'Tech Blog',
      coverImage: raw.coverImage || '',
      tags: [raw.subcategory].filter(Boolean),
      author: superAdmin._id,
      isPublished: true,
      source: raw.source,
      externalId: raw.externalId,
      externalLink: raw.link,
    });
    created++;
  }

  return {
    created,
    skipped,
    totalFetched: all.length,
    errors: results.errors,
  };
}

/**
 * Delete all previously fetched blogs (only devto, medium) - keeps manual blogs
 */
export async function deleteFetchedBlogs() {
  const result = await Blog.deleteMany({ source: { $in: ['devto', 'medium'] } });
  return { deleted: result.deletedCount };
}
