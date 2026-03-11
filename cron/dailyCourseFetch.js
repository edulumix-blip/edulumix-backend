/**
 * Daily cron job: Fetch free Udemy courses at a scheduled time.
 * Schedule controlled via COURSE_FETCH_CRON_SCHEDULE (default: 8:00 AM IST)
 */
import cron from 'node-cron';
import { runExternalCourseFetch } from '../utils/runCourseFetch.js';

const ENABLED = process.env.COURSE_FETCH_CRON_ENABLED !== 'false';
const SCHEDULE = process.env.COURSE_FETCH_CRON_SCHEDULE || '0 12 * * *'; // 12:00 PM (noon) daily
const TIMEZONE = process.env.COURSE_FETCH_CRON_TIMEZONE || 'Asia/Kolkata';

let scheduledTask = null;

export function startDailyCourseFetchCron() {
  if (!ENABLED) {
    console.log('⏸️  Daily course fetch cron is disabled (COURSE_FETCH_CRON_ENABLED=false)');
    return;
  }

  if (!cron.validate(SCHEDULE)) {
    console.warn('⚠️  Invalid COURSE_FETCH_CRON_SCHEDULE:', SCHEDULE, '- cron not started');
    return;
  }

  const runFetch = async () => {
    const start = Date.now();
    try {
      const result = await runExternalCourseFetch(15);
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      console.log(
        `📗 [Cron] Course fetch completed in ${elapsed}s: created=${result.created}, updated=${result.updated || 0}, skipped=${result.skipped}, ` +
        `udemy=${result.udemyFetched}` +
        (result.errors?.length ? `, errors=${result.errors.length}` : '')
      );
    } catch (err) {
      console.error('❌ [Cron] Course fetch failed:', err.message);
    }
  };

  scheduledTask = cron.schedule(SCHEDULE, runFetch, {
    timezone: TIMEZONE,
  });

  console.log(`⏰ Daily course fetch cron scheduled: ${SCHEDULE} (${TIMEZONE})`);
}

export function stopDailyCourseFetchCron() {
  if (scheduledTask) {
    scheduledTask.stop();
    scheduledTask = null;
    console.log('🛑 Daily course fetch cron stopped');
  }
}
