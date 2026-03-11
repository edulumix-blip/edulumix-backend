/**
 * Cron job: Fetch jobs from Adzuna + JSearch at scheduled intervals.
 * Default: every 3 hours (0:00, 3:00, 6:00, 9:00, 12:00, 15:00, 18:00, 21:00 IST)
 */
import cron from 'node-cron';
import { runExternalJobFetch } from '../utils/runJobFetch.js';

const ENABLED = process.env.JOB_FETCH_CRON_ENABLED !== 'false';
const SCHEDULE = process.env.JOB_FETCH_CRON_SCHEDULE || '0 */3 * * *'; // Every 3 hours
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

  console.log(`⏰ Job fetch cron scheduled: every 3 hours (${SCHEDULE}) - ${TIMEZONE}`);
}

export function stopDailyJobFetchCron() {
  if (scheduledTask) {
    scheduledTask.stop();
    scheduledTask = null;
    console.log('🛑 Daily job fetch cron stopped');
  }
}
