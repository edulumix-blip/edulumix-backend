/**
 * Blog Fetch Service - Only Dev.to and Medium for Tech Blog page.
 * Fetches cover/thumbnail for each post.
 */
import Parser from 'rss-parser';

const MAX_DESC = 1000;

const truncate = (s, max = MAX_DESC) => {
  if (!s || typeof s !== 'string') return '';
  const clean = String(s).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : clean.slice(0, max - 3) + '...';
};

// Extract first image URL from HTML string
const extractFirstImage = (html) => {
  if (!html || typeof html !== 'string') return '';
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1].trim() : '';
};

/**
 * Fetch from Dev.to - has cover_image, social_image
 */
export async function fetchFromDevToForBlog(perPage = 25) {
  const url = `https://dev.to/api/articles?per_page=${perPage}&page=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Dev.to API error: ${res.status}`);

  const articles = await res.json();
  const items = [];

  for (const a of articles || []) {
    const coverImage = a.cover_image || a.social_image || '';
    items.push({
      externalId: String(a.id),
      source: 'devto',
      title: (a.title || '').trim().slice(0, 200) || 'Untitled',
      description: truncate(a.description || a.title),
      link: a.url || a.canonical_url || '',
      coverImage,
      subcategory: 'Dev.to',
    });
  }
  return items;
}

/**
 * Fetch from Medium RSS - extract cover from content or enclosure
 */
export async function fetchFromMediumForBlog(limit = 25) {
  const parser = new Parser();
  const tags = ['javascript', 'programming', 'web-development', 'software-development', 'react', 'python'];
  const seen = new Set();
  const items = [];

  for (const tag of tags) {
    if (items.length >= limit) break;
    try {
      const feed = await parser.parseURL(`https://medium.com/feed/tag/${tag}`);
      for (const item of feed?.items || []) {
        const guid = item.guid || item.link;
        if (!guid || seen.has(guid)) continue;
        seen.add(guid);
        const link = item.link || item.guid || '';
        if (!link || !item.title) continue;

        let coverImage = item.enclosure?.url || item.thumbnail || '';
        if (!coverImage && item.content) coverImage = extractFirstImage(item.content);

        items.push({
          externalId: (guid || link).slice(0, 200),
          source: 'medium',
          title: (item.title || '').trim().slice(0, 200) || 'Untitled',
          description: truncate(item.contentSnippet || item.content || item.title),
          link,
          coverImage,
          subcategory: 'Medium',
        });
        if (items.length >= limit) return items;
      }
    } catch (_) {}
  }
  return items;
}

/**
 * Fetch blogs from Dev.to + Medium only
 */
export async function fetchAllBlogSources(opts = {}) {
  const { devToPerPage = 25, mediumLimit = 25 } = opts;
  const results = { devto: [], medium: [], errors: [] };

  try {
    results.devto = await fetchFromDevToForBlog(devToPerPage);
  } catch (e) {
    results.errors.push({ source: 'devto', message: e.message });
  }

  try {
    results.medium = await fetchFromMediumForBlog(mediumLimit);
  } catch (e) {
    results.errors.push({ source: 'medium', message: e.message });
  }

  return results;
}
