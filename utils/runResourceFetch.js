/**
 * Shared logic for fetching external resources and saving to DB.
 * Used by both the API controller and the daily cron.
 */
import Resource from '../models/Resource.js';
import User from '../models/User.js';
import { fetchAllExternalResources } from '../services/resourceFetchService.js';

/**
 * Fetch resources from Dev.to, freeCodeCamp, Hashnode, YouTube, Medium, Hacker News.
 * All saved with Super Admin as postedBy.
 */
export async function runExternalResourceFetch(opts = {}) {
  const superAdmin = await User.findOne({ role: 'super_admin' });
  if (!superAdmin) {
    throw new Error('Super Admin user not found. Run npm run seed first.');
  }

  const results = await fetchAllExternalResources(opts);
  let created = 0;
  let skipped = 0;

  const all = [
    ...results.devto,
    ...results.freecodecamp,
    ...results.hashnode,
    ...results.youtube,
    ...results.medium,
    ...results.hackernews,
  ];

  for (const raw of all) {
    const exists = await Resource.findOne({
      source: raw.source,
      externalId: raw.externalId,
    });
    if (exists) {
      skipped++;
      continue;
    }

    const { externalId, source, ...data } = raw;
    if (!data.link || !data.title) continue;

    await Resource.create({
      ...data,
      postedBy: superAdmin._id,
      source,
      externalId,
    });
    created++;
  }

  return {
    created,
    skipped,
    devtoFetched: results.devto.length,
    freecodecampFetched: results.freecodecamp.length,
    hashnodeFetched: results.hashnode.length,
    youtubeFetched: results.youtube.length,
    mediumFetched: results.medium.length,
    hackernewsFetched: results.hackernews.length,
    errors: results.errors,
  };
}
