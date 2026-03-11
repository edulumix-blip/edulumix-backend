/**
 * Resource fetch cron: Dev.to, freeCodeCamp, Hashnode, YouTube, Medium, Hacker News.
 * Schedule: every 1 hour (default). Override via RESOURCE_FETCH_CRON_SCHEDULE.
 */
import cron from 'node-cron';
import { runExternalResourceFetch } from '../utils/runResourceFetch.js';
import { runExternalBlogFetch } from '../utils/runBlogFetch.js';

const ENABLED = process.env.RESOURCE_FETCH_CRON_ENABLED !== 'false';
const SCHEDULE = process.env.RESOURCE_FETCH_CRON_SCHEDULE || '0 * * * *'; // Every hour at :00
const TIMEZONE = process.env.RESOURCE_FETCH_CRON_TIMEZONE || 'Asia/Kolkata';

let scheduledTask = null;

export function startDailyResourceFetchCron() {
  if (!ENABLED) {
    console.log('⏸️  Daily resource fetch cron is disabled (RESOURCE_FETCH_CRON_ENABLED=false)');
    return;
  }

  if (!cron.validate(SCHEDULE)) {
    console.warn('⚠️  Invalid RESOURCE_FETCH_CRON_SCHEDULE:', SCHEDULE, '- cron not started');
    return;
  }

  const runFetch = async () => {
    const start = Date.now();
    try {
      const [resResult, blogResult] = await Promise.all([
        runExternalResourceFetch(),
        runExternalBlogFetch(),
      ]);
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      console.log(
        `📚 [Cron] Fetch done in ${elapsed}s: Resources created=${resResult.created}, ` +
        `Blogs created=${blogResult.created} (devto=${resResult.devtoFetched}, medium=${resResult.mediumFetched}, hn=${resResult.hackernewsFetched})` +
        (resResult.errors?.length ? `, errors=${resResult.errors.length}` : '')
      );
    } catch (err) {
      console.error('❌ [Cron] Fetch failed:', err.message);
    }
  };

  scheduledTask = cron.schedule(SCHEDULE, runFetch, {
    timezone: TIMEZONE,
  });

  console.log(`⏰ Resource fetch cron: every 1 hour (${SCHEDULE}) - ${TIMEZONE}`);
}

export function stopDailyResourceFetchCron() {
  if (scheduledTask) {
    scheduledTask.stop();
    scheduledTask = null;
    console.log('🛑 Daily resource fetch cron stopped');
  }
}
