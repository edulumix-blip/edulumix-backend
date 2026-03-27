/**
 * Cron job: Fetch jobs from Adzuna + JSearch at scheduled intervals.
 */
import cron from 'node-cron';
import { runExternalJobFetch } from '../utils/runJobFetch.js';

const ENABLED = process.env.JOB_FETCH_CRON_ENABLED !== 'false';
// Daily 3:50 AM in JOB_FETCH_CRON_TIMEZONE (default Asia/Kolkata) — Adzuna + JSearch
const SCHEDULE = process.env.JOB_FETCH_CRON_SCHEDULE || '50 3 * * *';
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
    } catch (err) {
      console.error('❌ [Cron] Job fetch failed:', err.message);
    }
  };

  scheduledTask = cron.schedule(SCHEDULE, runFetch, {
    timezone: TIMEZONE,
  });

  console.log(`⏰ Job fetch cron: daily at 3:50 (${SCHEDULE}) - ${TIMEZONE}`);
}

export function stopDailyJobFetchCron() {
  if (scheduledTask) {
    scheduledTask.stop();
    scheduledTask = null;
    console.log('🛑 Daily job fetch cron stopped');
  }
}
