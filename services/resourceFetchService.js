/**
 * Resource Fetch Service - Fetches resources from Dev.to, freeCodeCamp, Hashnode, YouTube,
 * Medium, Hacker News. All posts saved with Super Admin credentials.
 */

import Parser from 'rss-parser';

const MAX_DESC = 1000;

// Map tags/labels to Resource category enum
const mapCategory = (tags, title = '') => {
  const t = `${(tags || '').toLowerCase()} ${(title || '').toLowerCase()}`;
  if (/interview|job|hiring/.test(t)) return 'Interview Notes';
  if (/tool|vscode|api|docker|git/.test(t)) return 'Tools & Technology';
  if (/ai|blockchain|cloud|trend/.test(t)) return 'Trending Technology';
  if (/video|tutorial|course|learn/.test(t)) return 'Video Resources';
  if (/project|portfolio|build/.test(t)) return 'Software Project';
  if (/hardware|iot|arduino/.test(t)) return 'Hardware Project';
  return 'Software Notes';
};

const truncate = (s, max = MAX_DESC) => {
  if (!s || typeof s !== 'string') return '';
  const clean = s.replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : clean.slice(0, max - 3) + '...';
};

/**
 * Fetch articles from Dev.to
 */
export async function fetchFromDevTo(perPage = 20) {
  const url = `https://dev.to/api/articles?per_page=${perPage}&page=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Dev.to API error: ${res.status}`);

  const articles = await res.json();
  const resources = [];

  for (const a of articles || []) {
    const tags = Array.isArray(a.tag_list) ? a.tag_list.join(', ') : (a.tags || '');
    resources.push({
      externalId: String(a.id),
      source: 'devto',
      title: (a.title || '').trim().slice(0, 150) || 'Untitled',
      category: mapCategory(tags, a.title),
      subcategory: 'Dev.to',
      link: a.url || a.canonical_url || '',
      description: truncate(a.description || a.title),
      thumbnail: a.cover_image || a.social_image || '',
      isVideo: false,
    });
  }

  return resources;
}

/**
 * Fetch articles from freeCodeCamp News (via Hashnode - freeCodeCamp migrated from Ghost)
 */
export async function fetchFromFreeCodeCamp(first = 15) {
  const query = `query GetPosts($host: String!, $first: Int!) {
    publication(host: $host) {
      posts(first: $first) {
        edges {
          node {
            id
            title
            url
            brief
            coverImage { url }
          }
        }
      }
    }
  }`;

  const res = await fetch('https://gql.hashnode.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { host: 'freecodecamp.org', first },
    }),
  });

  if (!res.ok) throw new Error(`freeCodeCamp (Hashnode) API error: ${res.status}`);

  const json = await res.json();
  const edges = json?.data?.publication?.posts?.edges || [];
  const resources = [];

  for (const { node } of edges) {
    if (!node?.id || !node?.url) continue;
    resources.push({
      externalId: node.id,
      source: 'freecodecamp',
      title: (node.title || '').trim().slice(0, 150) || 'Untitled',
      category: mapCategory('', node.title),
      subcategory: 'freeCodeCamp',
      link: node.url,
      description: truncate(node.brief || node.title),
      thumbnail: node.coverImage?.url || '',
      isVideo: false,
    });
  }

  return resources;
}

/**
 * Fetch posts from Hashnode (GraphQL)
 */
export async function fetchFromHashnode(first = 15) {
  const query = `query GetPosts($host: String!, $first: Int!) {
    publication(host: $host) {
      posts(first: $first) {
        edges {
          node {
            id
            title
            url
            brief
            coverImage { url }
          }
        }
      }
    }
  }`;

  const res = await fetch('https://gql.hashnode.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { host: 'hashnode.dev', first },
    }),
  });

  if (!res.ok) throw new Error(`Hashnode API error: ${res.status}`);

  const json = await res.json();
  const edges = json?.data?.publication?.posts?.edges || [];
  const resources = [];

  for (const { node } of edges) {
    if (!node?.id || !node?.url) continue;
    resources.push({
      externalId: node.id,
      source: 'hashnode',
      title: (node.title || '').trim().slice(0, 150) || 'Untitled',
      category: mapCategory('', node.title),
      subcategory: 'Hashnode',
      link: node.url,
      description: truncate(node.brief || node.title),
      thumbnail: node.coverImage?.url || '',
      isVideo: false,
    });
  }

  return resources;
}

/**
 * Fetch educational videos from YouTube Data API v3
 */
export async function fetchFromYouTube(maxResults = 10) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error('YOUTUBE_API_KEY must be set in .env');

  const queries = ['programming tutorial', 'web development tutorial', 'coding interview'];
  const seen = new Set();
  const resources = [];

  for (const q of queries) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(q)}&maxResults=${Math.min(5, maxResults)}&key=${apiKey}&order=date&relevanceLanguage=en`;
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`YouTube API error: ${res.status} - ${err?.error?.message || res.statusText}`);
    }

    const data = await res.json();
    const items = data.items || [];

    for (const item of items) {
      const vid = item.id?.videoId;
      if (!vid || seen.has(vid)) continue;
      seen.add(vid);

      const s = item.snippet || {};
      const videoUrl = `https://www.youtube.com/watch?v=${vid}`;
      const thumb = s.thumbnails?.maxres?.url || s.thumbnails?.high?.url || s.thumbnails?.default?.url || '';

      resources.push({
        externalId: vid,
        source: 'youtube',
        title: (s.title || '').trim().slice(0, 150) || 'Untitled',
        category: 'Video Resources',
        subcategory: 'YouTube',
        link: videoUrl,
        description: truncate(s.description || s.title),
        thumbnail: thumb,
        isVideo: true,
      });
    }
  }

  return resources.slice(0, maxResults);
}

/**
 * Fetch tech articles from Medium via RSS (no API key)
 */
export async function fetchFromMedium(limit = 15) {
  const parser = new Parser();
  const tags = ['javascript', 'programming', 'web-development', 'software-development', 'react'];
  const seen = new Set();
  const resources = [];

  for (const tag of tags) {
    if (resources.length >= limit) break;
    try {
      const feed = await parser.parseURL(`https://medium.com/feed/tag/${tag}`);
      const items = feed?.items || [];
      for (const item of items) {
        const guid = item.guid || item.link;
        if (!guid || seen.has(guid)) continue;
        seen.add(guid);
        const link = item.link || item.guid || '';
        if (!link || !item.title) continue;
        resources.push({
          externalId: (guid || link).slice(0, 200),
          source: 'medium',
          title: (item.title || '').trim().slice(0, 150) || 'Untitled',
          category: mapCategory(item.categories?.join?.() || '', item.title),
          subcategory: 'Medium',
          link,
          description: truncate(item.contentSnippet || item.content || item.title),
          thumbnail: item.enclosure?.url || item.thumbnail || '',
          isVideo: false,
        });
        if (resources.length >= limit) return resources;
      }
    } catch (_) {}
  }
  return resources;
}

/**
 * Fetch top stories from Hacker News (no API key)
 */
export async function fetchFromHackerNews(limit = 15) {
  const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
  if (!res.ok) throw new Error(`Hacker News API error: ${res.status}`);

  const ids = await res.json();
  const resources = [];
  const techKeywords = /javascript|python|react|node|api|code|programming|developer|software|startup|tech|web|ai|ml|data/i;

  for (let i = 0; i < Math.min(ids.length, 50) && resources.length < limit; i++) {
    try {
      const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${ids[i]}.json`);
      if (!itemRes.ok) continue;
      const item = await itemRes.json();
      if (!item || item.deleted || item.type !== 'story' || !item.url) continue;
      if (!techKeywords.test((item.title || '') + (item.url || ''))) continue;

      resources.push({
        externalId: String(item.id),
        source: 'hackernews',
        title: (item.title || '').trim().slice(0, 150) || 'Untitled',
        category: mapCategory('', item.title),
        subcategory: 'Hacker News',
        link: item.url,
        description: truncate(item.title),
        thumbnail: '',
        isVideo: false,
      });
    } catch (_) {}
  }
  return resources;
}

/**
 * Fetch from all sources
 */
export async function fetchAllExternalResources(opts = {}) {
  const {
    devToPerPage = 20,
    freeCodeCampFirst = 15,
    hashnodeFirst = 15,
    youtubeMax = 10,
    mediumLimit = 15,
    hackernewsLimit = 15,
  } = opts;

  const results = {
    devto: [],
    freecodecamp: [],
    hashnode: [],
    youtube: [],
    medium: [],
    hackernews: [],
    errors: [],
  };

  try {
    results.devto = await fetchFromDevTo(devToPerPage);
  } catch (e) {
    results.errors.push({ source: 'devto', message: e.message });
  }

  try {
    results.freecodecamp = await fetchFromFreeCodeCamp(freeCodeCampFirst);
  } catch (e) {
    results.errors.push({ source: 'freecodecamp', message: e.message });
  }

  try {
    results.hashnode = await fetchFromHashnode(hashnodeFirst);
  } catch (e) {
    results.errors.push({ source: 'hashnode', message: e.message });
  }

  try {
    results.youtube = await fetchFromYouTube(youtubeMax);
  } catch (e) {
    results.errors.push({ source: 'youtube', message: e.message });
  }

  try {
    results.medium = await fetchFromMedium(mediumLimit);
  } catch (e) {
    results.errors.push({ source: 'medium', message: e.message });
  }

  try {
    results.hackernews = await fetchFromHackerNews(hackernewsLimit);
  } catch (e) {
    results.errors.push({ source: 'hackernews', message: e.message });
  }

  return results;
}
