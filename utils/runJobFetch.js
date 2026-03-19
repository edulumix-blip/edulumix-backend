/**
 * Shared logic for fetching external jobs and saving to DB.
 * Used by both the API controller and the daily cron.
 */
import Job from '../models/Job.js';
import User from '../models/User.js';
import { fetchAllExternalJobs, getCurrentExternalJobIds } from '../services/jobFetchService.js';

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

/**
 * Sync closed status from source: mark as Closed any Open job (adzuna/jsearch)
 * whose externalId is no longer in the current API results.
 * @param {number} adzunaLimit - Same as fetch (results per page for Adzuna)
 * @param {number} jsearchPages - Same as fetch (pages for JSearch)
 * @returns {Promise<{ closed: number, adzunaClosed: number, jsearchClosed: number, errors: Array }>}
 */
export async function syncClosedStatusFromSource(adzunaLimit = 20, jsearchPages = 2) {
  const { adzuna: adzunaIds, jsearch: jsearchIds, errors } = await getCurrentExternalJobIds(adzunaLimit, jsearchPages);

  let adzunaClosed = 0;
  let jsearchClosed = 0;

  // Only close jobs for a source when we have current IDs (API succeeded). Empty set = skip to avoid closing all.
  if (adzunaIds.size > 0) {
    const adzunaOpen = await Job.find({
      status: 'Open',
      source: 'adzuna',
      externalId: { $nin: Array.from(adzunaIds) },
    }).select('_id');
    const adzunaIdsToClose = adzunaOpen.map((d) => d._id);
    adzunaClosed = adzunaIdsToClose.length;
    if (adzunaClosed > 0) {
      await Job.updateMany(
        { _id: { $in: adzunaIdsToClose } },
        { $set: { status: 'Closed', closedSyncedAt: new Date() } }
      );
    }
  }

  if (jsearchIds.size > 0) {
    const jsearchOpen = await Job.find({
      status: 'Open',
      source: 'jsearch',
      externalId: { $nin: Array.from(jsearchIds) },
    }).select('_id');
    const jsearchIdsToClose = jsearchOpen.map((d) => d._id);
    jsearchClosed = jsearchIdsToClose.length;
    if (jsearchClosed > 0) {
      await Job.updateMany(
        { _id: { $in: jsearchIdsToClose } },
        { $set: { status: 'Closed', closedSyncedAt: new Date() } }
      );
    }
  }

  return {
    closed: adzunaClosed + jsearchClosed,
    adzunaClosed,
    jsearchClosed,
    errors,
  };
}
