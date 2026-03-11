/**
 * Shared logic for fetching external jobs and saving to DB.
 * Used by both the API controller and the daily cron.
 */
import Job from '../models/Job.js';
import User from '../models/User.js';
import { fetchAllExternalJobs } from '../services/jobFetchService.js';

/**
 * Fetch jobs from Adzuna + JSearch and save new ones to DB.
 * @param {number} adzunaLimit - Results per page for Adzuna
 * @param {number} jsearchPages - Number of pages for JSearch
 * @returns {Promise<{created: number, skipped: number, adzunaFetched: number, jsearchFetched: number, errors: Array}>}
 */
export async function runExternalJobFetch(adzunaLimit = 20, jsearchPages = 2) {
  const superAdmin = await User.findOne({ role: 'super_admin' });
  if (!superAdmin) {
    throw new Error('Super Admin user not found. Run npm run seed first.');
  }

  const results = await fetchAllExternalJobs(adzunaLimit, jsearchPages);
  let created = 0;
  let skipped = 0;

  const allJobs = [...results.adzuna, ...results.jsearch];

  for (const raw of allJobs) {
    const exists = await Job.findOne({
      source: raw.source,
      externalId: raw.externalId,
    });
    if (exists) {
      skipped++;
      continue;
    }

    const { externalId, source, ...jobData } = raw;
    if (!jobData.applyLink || !jobData.title || !jobData.company) continue;

    await Job.create({
      ...jobData,
      postedBy: superAdmin._id,
      source,
      externalId,
    });
    created++;
  }

  return {
    created,
    skipped,
    adzunaFetched: results.adzuna.length,
    jsearchFetched: results.jsearch.length,
    errors: results.errors,
  };
}
