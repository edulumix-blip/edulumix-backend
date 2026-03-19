/**
 * Cron job: Fetch jobs from Adzuna + JSearch at scheduled intervals.
 * After fetch, sync closed status (mark jobs no longer in API results as Closed).
 */
import cron from 'node-cron';
import { runExternalJobFetch, syncClosedStatusFromSource } from '../utils/runJobFetch.js';

const ENABLED = process.env.JOB_FETCH_CRON_ENABLED !== 'false';
const SCHEDULE = process.env.JOB_FETCH_CRON_SCHEDULE || '0 * * * *'; // Every hour (same as blog)
const TIMEZONE = process.env.JOB_FETCH_CRON_TIMEZONE || 'Asia/Kolkata';

let scheduledTask = null;

export function startDailyJobFetchCron() {
  if (!ENABLED) {
    console.log('⏸️  Daily job fetch cron is disabled (JOB_FETCH_CRON_ENABLED=false)');
    return;
  }

  if (!cron.validate(SCHEDULE)) {
    console.warn('⚠️  Invalid JOB_FETCH_CRON_SCHEDULE:', SCHEDULE, '- cron not started');
    return;
  }

  const runFetch = async () => {
    const start = Date.now();
    try {
      const result = await runExternalJobFetch(20, 2);
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      console.log(
        `📥 [Cron] Job fetch completed in ${elapsed}s: created=${result.created}, skipped=${result.skipped}, ` +
        `adzuna=${result.adzunaFetched}, jsearch=${result.jsearchFetched}` +
        (result.errors?.length ? `, errors=${result.errors.length}` : '')
      );
      const sync = await syncClosedStatusFromSource(20, 2);
      if (sync.closed > 0) {
        console.log(`🔒 [Cron] Sync closed: ${sync.closed} jobs (adzuna=${sync.adzunaClosed}, jsearch=${sync.jsearchClosed})`);
      }
      if (sync.errors?.length) {
        console.warn(`⚠️ [Cron] Sync closed had ${sync.errors.length} API error(s)`);
      }
    } catch (err) {
      console.error('❌ [Cron] Job fetch failed:', err.message);
    }
  };

  scheduledTask = cron.schedule(SCHEDULE, runFetch, {
    timezone: TIMEZONE,
  });

  console.log(`⏰ Job fetch cron scheduled: every hour (${SCHEDULE}) - ${TIMEZONE}`);
}

export function stopDailyJobFetchCron() {
  if (scheduledTask) {
    scheduledTask.stop();
    scheduledTask = null;
    console.log('🛑 Daily job fetch cron stopped');
  }
}
