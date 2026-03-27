/**
 * Tech blog fetch cron: Dev.to + Medium → Blog collection.
 * Default: every 12 hours at :00 (Asia/Kolkata).
 */
import cron from 'node-cron';
import { runExternalBlogFetch } from '../utils/runBlogFetch.js';

const ENABLED = process.env.BLOG_FETCH_CRON_ENABLED !== 'false';
const SCHEDULE = process.env.BLOG_FETCH_CRON_SCHEDULE || '0 */12 * * *';
const TIMEZONE = process.env.BLOG_FETCH_CRON_TIMEZONE || 'Asia/Kolkata';

let scheduledTask = null;

export function startDailyBlogFetchCron() {
  if (!ENABLED) {
    console.log('⏸️  Tech blog fetch cron is disabled (BLOG_FETCH_CRON_ENABLED=false)');
    return;
  }

  if (!cron.validate(SCHEDULE)) {
    console.warn('⚠️  Invalid BLOG_FETCH_CRON_SCHEDULE:', SCHEDULE, '- blog cron not started');
    return;
  }

  const runFetch = async () => {
    const start = Date.now();
    try {
      const blogResult = await runExternalBlogFetch();
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      console.log(
        `📝 [Cron] Tech blog fetch done in ${elapsed}s: created=${blogResult.created}, skipped=${blogResult.skipped}` +
          (blogResult.errors?.length ? `, errors=${blogResult.errors.length}` : '')
      );
    } catch (err) {
      console.error('❌ [Cron] Tech blog fetch failed:', err.message);
    }
  };

  scheduledTask = cron.schedule(SCHEDULE, runFetch, {
    timezone: TIMEZONE,
  });

  console.log(`⏰ Tech blog fetch cron: every 12h (${SCHEDULE}) - ${TIMEZONE}`);
}

export function stopDailyBlogFetchCron() {
  if (scheduledTask) {
    scheduledTask.stop();
    scheduledTask = null;
    console.log('🛑 Tech blog fetch cron stopped');
  }
}
