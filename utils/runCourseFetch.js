/**
 * Shared logic for fetching external courses and saving to DB.
 * Used by both the API controller and the daily cron.
 */
import Course from '../models/Course.js';
import User from '../models/User.js';
import { fetchAllExternalCourses } from '../services/courseFetchService.js';

/**
 * Fetch courses from Udemy and save new ones to DB.
 */
export async function runExternalCourseFetch(limit = 15) {
  const superAdmin = await User.findOne({ role: 'super_admin' });
  if (!superAdmin) {
    throw new Error('Super Admin user not found. Run npm run seed first.');
  }

  const results = await fetchAllExternalCourses(limit);
  let created = 0;
  let skipped = 0;

  let updated = 0;
  for (const raw of results.udemy) {
    const exists = await Course.findOne({
      source: raw.source,
      externalId: raw.externalId,
    });
    if (exists) {
      // Update price for existing courses (actual price from Udemy)
      if (raw.actualPrice > 0 || raw.offerPrice !== undefined) {
        await Course.findByIdAndUpdate(exists._id, {
          actualPrice: raw.actualPrice ?? exists.actualPrice,
          offerPrice: raw.offerPrice ?? exists.offerPrice,
        });
        updated++;
      }
      skipped++;
      continue;
    }

    const { externalId, source, rawApiData, ...data } = raw;
    if (!data.title || !data.enrollmentLink) continue;

    await Course.create({
      ...data,
      postedBy: superAdmin._id,
      source,
      externalId,
      rawApiData: rawApiData || null,
    });
    created++;
  }

  return {
    created,
    skipped,
    updated,
    udemyFetched: results.udemy.length,
    errors: results.errors,
  };
}
