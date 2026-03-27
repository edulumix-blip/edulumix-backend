/**
 * Resource fetch cron: Dev.to, freeCodeCamp, Hashnode, YouTube, Medium, Hacker News.
 * Default: every 40 hours (interval from process start), not tied to wall clock.
 * Override hours via RESOURCE_FETCH_INTERVAL_HOURS.
 */
import { runExternalResourceFetch } from '../utils/runResourceFetch.js';

const ENABLED = process.env.RESOURCE_FETCH_CRON_ENABLED !== 'false';
const HOURS_RAW = process.env.RESOURCE_FETCH_INTERVAL_HOURS;
const PARSED = Number.parseFloat(HOURS_RAW || '40', 10);
const INTERVAL_HOURS = Number.isFinite(PARSED) && PARSED > 0 ? PARSED : 40;
const INTERVAL_MS = INTERVAL_HOURS * 60 * 60 * 1000;

let intervalId = null;
let running = false;

export function startDailyResourceFetchCron() {
  if (!ENABLED) {
    console.log('⏸️  Resource fetch scheduler is disabled (RESOURCE_FETCH_CRON_ENABLED=false)');
    return;
  }

  const runFetch = async () => {
    if (running) {
      console.warn('⚠️  [Cron] Resource fetch skipped — previous run still in progress');
      return;
    }
    running = true;
    const start = Date.now();
    try {
      const resResult = await runExternalResourceFetch();
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      console.log(
        `📚 [Cron] Resource fetch done in ${elapsed}s: created=${resResult.created}, ` +
          `devto=${resResult.devtoFetched}, medium=${resResult.mediumFetched}, hn=${resResult.hackernewsFetched}` +
          (resResult.errors?.length ? `, errors=${resResult.errors.length}` : '')
      );
    } catch (err) {
      console.error('❌ [Cron] Resource fetch failed:', err.message);
    } finally {
      running = false;
    }
  };

  intervalId = setInterval(runFetch, INTERVAL_MS);

  console.log(
    `⏰ Resource fetch scheduler: every ${INTERVAL_HOURS}h (${Math.round(INTERVAL_MS / 1000)}s interval)`
  );
}

export function stopDailyResourceFetchCron() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('🛑 Resource fetch scheduler stopped');
  }
}
