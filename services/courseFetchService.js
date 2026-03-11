/**
 * Course Fetch Service - Fetches free Udemy courses via RapidAPI
 * Supports: udemy-free-courses, paid-udemy-course-for-free, etc.
 * Stores full API response in rawApiData.
 */

// Priority order: 1) Vintarok (best free tier), 2) udemy-free, 3) paid-udemy
const VINTAROK_HOST = 'udemy-coupons-courses-instructors-data-api.p.rapidapi.com';
const UDEMY_FREE_HOST = process.env.RAPIDAPI_UDEMY_FREE_HOST || 'udemy-free-courses.p.rapidapi.com';
const UDEMY_HOST = process.env.RAPIDAPI_UDEMY_HOST || 'paid-udemy-course-for-free.p.rapidapi.com';

// Map Udemy category to our schema enum
const mapCategory = (label) => {
  if (!label) return 'Others';
  const l = String(label).toLowerCase();
  if (l.includes('web') || l.includes('frontend') || l.includes('full stack')) return 'Web Development';
  if (l.includes('mobile') || l.includes('android') || l.includes('ios')) return 'Mobile Development';
  if (l.includes('data') || l.includes('analytics')) return 'Data Science';
  if (l.includes('machine learning') || l.includes('ml') || l.includes('ai')) return 'Machine Learning';
  if (l.includes('devops') || l.includes('docker') || l.includes('kubernetes')) return 'DevOps';
  if (l.includes('cyber') || l.includes('security')) return 'Cybersecurity';
  if (l.includes('cloud') || l.includes('aws') || l.includes('azure')) return 'Cloud Computing';
  if (l.includes('ui') || l.includes('ux') || l.includes('design')) return 'UI/UX Design';
  if (l.includes('marketing') || l.includes('digital')) return 'Digital Marketing';
  if (l.includes('interview') || l.includes('dsa') || l.includes('algorithm')) return 'Interview Prep';
  if (l.includes('dsa') || l.includes('data structure')) return 'DSA';
  if (l.includes('python') || l.includes('javascript') || l.includes('java')) return 'Programming Languages';
  if (l.includes('office') || l.includes('excel') || l.includes('word')) return 'Others';
  if (l.includes('marketing') || l.includes('business')) return 'Digital Marketing';
  if (l.includes('teaching') || l.includes('academic') || l.includes('photo') || l.includes('video')) return 'Others';
  return 'Others';
};

const truncate = (s, max = 5000) => {
  if (!s || typeof s !== 'string') return '';
  const clean = String(s).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : clean.slice(0, max - 3) + '...';
};

// Parse org_price from API: "$9.99" or "₹999" -> number
const parsePrice = (val) => {
  if (val == null) return 0;
  const str = String(val).replace(/[^0-9.]/g, '');
  const n = parseFloat(str);
  return isNaN(n) ? 0 : Math.round(n * 100) / 100;
};

// Convert USD to INR (Udemy prices are in USD)
const USD_TO_INR = Number(process.env.USD_TO_INR_RATE) || 84;
const toINR = (usd) => Math.round((usd || 0) * USD_TO_INR);

const fetchUdemyApi = (apiKey, host, path) => {
  const url = `https://${host}${path}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'x-rapidapi-key': apiKey,
      'X-RapidAPI-Host': host,
      'x-rapidapi-host': host,
    },
  });
};

/**
 * Normalize any API course object to our schema + rawApiData
 * Handles udemy-free-courses and other structures
 */
function normalizeWithRaw(c, rawObj) {
  const raw = rawObj || c;
  const getStr = (obj, ...keys) => {
    for (const k of keys) {
      const v = obj?.[k];
      if (v != null && typeof v === 'string') return v.trim();
    }
    return '';
  };
  const getNum = (obj, ...keys) => {
    for (const k of keys) {
      const v = obj?.[k];
      if (v != null) {
        const n = parseFloat(String(v).replace(/[^0-9.]/g, ''));
        if (!isNaN(n)) return n;
      }
    }
    return 0;
  };
  const getUrl = (obj) => {
    const u = obj?.url || obj?.link || obj?.course_url || obj?.enrollment_url || obj?.coupon;
    if (typeof u === 'string' && (u.startsWith('http') || u.startsWith('//'))) return u;
    if (obj?.id && obj?.slug) return `https://www.udemy.com/course/${obj.slug || obj.id}/`;
    return '';
  };

  const title = getStr(c, 'title', 'name', 'headline') || getStr(raw, 'title', 'name', 'headline') || 'Untitled';
  const desc = getStr(c, 'desc_text', 'description', 'headline') || getStr(raw, 'desc_text', 'description', 'headline') || title;
  const image = getStr(c, 'pic', 'image_url', 'image', 'thumbnail') || getStr(raw, 'pic', 'image_url', 'image', 'thumbnail');
  const url = getUrl(c) || getUrl(raw);
  const extId = String(c?.id ?? c?.sku ?? raw?.id ?? raw?.sku ?? title + url);

  if (!url && !extId) return null;

  return {
    externalId: extId,
    source: 'udemy',
    rawApiData: raw,
    title: title.slice(0, 150),
    description: truncate(desc, 5000),
    shortDescription: truncate(desc, 300),
    thumbnail: image,
    category: mapCategory(c?.category ?? c?.primary_category ?? raw?.category ?? raw?.primary_category),
    level: 'All Levels',
    actualPrice: toINR(parsePrice(c?.org_price ?? raw?.org_price ?? c?.price ?? raw?.price)),
    offerPrice: 0,
    isFree: true,
    lessons: [],
    totalDuration: getNum(c, 'duration_minutes') || getNum(c, 'duration') * 60 || getNum(raw, 'duration_minutes') || getNum(raw, 'duration') * 60 || 0,
    totalLessons: 0,
    instructor: {
      name: c?.instructor?.name ?? raw?.instructor?.name ?? c?.authors?.[0]?.display_name ?? raw?.authors?.[0]?.display_name ?? 'Udemy Instructor',
      bio: c?.instructor?.bio ?? raw?.instructor?.job_title ?? '',
      avatar: c?.instructor?.avatar ?? raw?.instructor?.image ?? raw?.authors?.[0]?.image ?? '',
    },
    enrollmentLink: url,
    isPublished: true,
    tags: [].concat(c?.category ?? raw?.category ?? [], c?.primary_subcategory ?? raw?.primary_subcategory ?? []).filter(Boolean),
  };
}

const HOSTS_TO_TRY = [
  'udemy-paid-courses-for-free-api.p.rapidapi.com',
  'paid-udemy-course-for-free.p.rapidapi.com',
  'udemy-coupons-courses-instructors-data-api.p.rapidapi.com',
];

/**
 * Parse API response into course items (handles various structures)
 */
function extractCourseItems(data) {
  if (Array.isArray(data)) return data;
  const list = data?.courses || data?.data || data?.results || data?.items || [];
  return Array.isArray(list) ? list : [];
}

/**
 * Normalize raw course object to our schema
 * Handles both: paid-udemy-course-for-free API (title, coupon, pic, desc_text, category)
 * and vintarok API (course, authors, coupon)
 */
function normalizeCourse(c, author = {}) {
  // paid-udemy-course-for-free format: { id, sku, pic, title, coupon, desc_text, category }
  if (c.coupon && typeof c.coupon === 'string' && c.coupon.startsWith('http')) {
    const enrollmentLink = c.coupon;
    if (!enrollmentLink || !c.title) return null;
    const usdPrice = parsePrice(c.org_price) || 0;
    const actualPrice = toINR(usdPrice); // Store in INR
    return {
      externalId: String(c.id || c.sku || c.title + enrollmentLink),
      source: 'udemy',
      rawApiData: c,
      title: (c.title || '').trim().slice(0, 150) || 'Untitled',
      description: truncate(c.desc_text || c.description || c.title, 5000),
      shortDescription: truncate(c.desc_text || c.description || c.title, 300),
      thumbnail: c.pic || c.image_url || c.image || '',
      category: mapCategory(c.category || c.primary_category),
      level: 'All Levels',
      actualPrice: actualPrice || 0,
      offerPrice: 0,
      isFree: true,
      lessons: [],
      totalDuration: (c.duration || 0) * 60 || 0,
      totalLessons: 0,
      instructor: { name: 'Udemy Instructor', bio: '', avatar: '' },
      enrollmentLink,
      isPublished: true,
      tags: [].concat(c.category || []).filter(Boolean),
    };
  }

  // vintarok / course.php format: { course, authors, coupon }
  const course = c.course || c;
  const coupon = c.coupon || course.coupon || {};
  const courseAuthors = course.authors || c.authors || [];
  const courseAuthor = courseAuthors[0] || author;
  const courseUrl = course.url || course.link || course.course_url || '';
  const couponCode = coupon.code || course.coupon_code || '';
  const usdPrice = coupon.regular_price ?? course.price ?? 0;
  const actualPriceINR = toINR(parsePrice(usdPrice));

  let enrollmentLink = courseUrl;
  if (couponCode && courseUrl) {
    enrollmentLink = courseUrl.includes('?') ? `${courseUrl}&couponCode=${couponCode}` : `${courseUrl}?couponCode=${couponCode}`;
  } else if (course.id && couponCode) {
    enrollmentLink = `https://www.udemy.com/course/${course.slug || course.id}/?couponCode=${couponCode}`;
  } else if (courseUrl) {
    enrollmentLink = courseUrl;
  } else if (course.id) {
    enrollmentLink = `https://www.udemy.com/course/${course.slug || course.id}/`;
  }
  if (!enrollmentLink || !course.title) return null;

  return {
    externalId: String(course.id || course.course_id || course.title + courseUrl),
    source: 'udemy',
    rawApiData: c,
    title: (course.title || '').trim().slice(0, 150) || 'Untitled',
    description: truncate(course.description || course.headline || course.title, 5000),
    shortDescription: truncate(course.description || course.headline || course.title, 300),
    thumbnail: course.image_url || course.image || course.thumbnail || course.image_240x135 || '',
    category: mapCategory(course.primary_category || course.category),
    level: 'All Levels',
    actualPrice: actualPriceINR || 0,
    offerPrice: 0,
    isFree: true,
    lessons: [],
    totalDuration: course.duration_minutes || (course.duration_hours || 0) * 60 || 0,
    totalLessons: 0,
    instructor: {
      name: courseAuthor?.display_name || courseAuthor?.name || 'Udemy Instructor',
      bio: courseAuthor?.job_title || '',
      avatar: courseAuthor?.image || courseAuthor?.avatar || '',
    },
    enrollmentLink,
    isPublished: true,
    tags: [].concat(course.primary_category || [], course.primary_subcategory || []).filter(Boolean),
  };
}

/**
 * Fetch from Vintarok - Udemy Coupons, Courses & Instructors Data API
 * https://rapidapi.com/vintarok-vintarok-default/api/udemy-coupons-courses-instructors-data-api
 * Endpoints: /courses.php (list), /authors.php (author + courses)
 * Free tier: limit 10 per request. Subscribe on RapidAPI to use.
 */
async function fetchFromVintarokApi(apiKey, limit) {
  const courses = [];
  const seenIds = new Set();
  const queries = ['web', 'python', 'javascript', 'react', 'programming', 'data'];

  // 1) Try /courses.php?q=X&limit=10
  for (const q of queries) {
    if (courses.length >= limit) break;
    try {
      const res = await fetchUdemyApi(
        apiKey,
        VINTAROK_HOST,
        `/courses.php?q=${encodeURIComponent(q)}&limit=10`
      );
      if (!res.ok) continue;
      const data = await res.json();
      if (data?.ok === false || data?.error) continue;

      const items = Array.isArray(data?.courses) ? data.courses
        : Array.isArray(data?.data?.courses) ? data.data.courses
        : Array.isArray(data?.data) ? data.data
        : extractCourseItems(data);

      for (const item of items) {
        const norm = normalizeCourse(item);
        if (norm && !seenIds.has(norm.externalId)) {
          seenIds.add(norm.externalId);
          courses.push(norm);
          if (courses.length >= limit) return courses;
        }
      }
    } catch (_) {}
  }

  // 2) Fallback: /api/v1/author?q=X&include=courses&limit=10
  if (courses.length === 0) {
    for (const q of queries) {
      if (courses.length >= limit) break;
      try {
        const res = await fetchUdemyApi(
          apiKey,
          VINTAROK_HOST,
          `/api/v1/author?q=${encodeURIComponent(q)}&include=courses&limit=10`
        );
        if (!res.ok) continue;
        const data = await res.json();
        if (data?.ok === false || data?.error) continue;

        let items = [];
        if (Array.isArray(data?.courses)) items = data.courses;
        else if (Array.isArray(data?.data?.courses)) items = data.data.courses;
        else if (data?.author?.courses) items = Array.isArray(data.author.courses) ? data.author.courses : [data.author.courses];

        for (const item of items) {
          const norm = normalizeCourse(item);
          if (norm && !seenIds.has(norm.externalId)) {
            seenIds.add(norm.externalId);
            courses.push(norm);
            if (courses.length >= limit) return courses;
          }
        }
      } catch (_) {}
    }
  }

  return courses.length > 0 ? courses : null;
}

/**
 * Fetch from udemy-free-courses.p.rapidapi.com
 * Endpoint: /courses/?id=288&pagination=1 or /courses/?pagination=0
 */
async function fetchFromUdemyFreeApi(apiKey, limit) {
  const courses = [];
  const seenIds = new Set();
  for (let pagination = 0; pagination <= 2 && courses.length < limit; pagination++) {
    const res = await fetchUdemyApi(apiKey, UDEMY_FREE_HOST, `/courses/?pagination=${pagination}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.messages?.includes?.('unreachable') || data?.info) return null;
    const items = extractCourseItems(data);
    for (const c of items) {
      const norm = normalizeWithRaw(c, c);
      if (norm && !seenIds.has(norm.externalId)) {
        seenIds.add(norm.externalId);
        courses.push(norm);
        if (courses.length >= limit) return courses;
      }
    }
  }
  return courses;
}

/**
 * Fetch free Udemy courses from RapidAPI
 * Tries udemy-free-courses first, then paid-udemy-course-for-free
 */
export async function fetchFromUdemy(limit = 15) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) throw new Error('RAPIDAPI_KEY must be set in .env');

  const courses = [];
  const seenIds = new Set();
  let lastError = null;

  // 1) Try Vintarok first (best free tier, long-term)
  try {
    const vintarok = await fetchFromVintarokApi(apiKey, limit);
    if (vintarok && vintarok.length > 0) return vintarok;
  } catch (_) {}

  // 2) Try udemy-free-courses
  try {
    const free = await fetchFromUdemyFreeApi(apiKey, limit);
    if (free && free.length > 0) return free;
  } catch (_) {}

  const host = UDEMY_HOST;

  // paid-udemy-course-for-free: GET /?page=0 returns { value: [...] }
  for (let page = 0; page <= 2 && courses.length < limit; page++) {
    const res = await fetchUdemyApi(apiKey, host, `/?page=${page}`);
    if (!res.ok) {
      lastError = `[${host}] ${res.status}`;
      break;
    }
    const data = await res.json();
    const items = data.value || data.courses || data.data || (Array.isArray(data) ? data : []);
    for (const c of Array.isArray(items) ? items : []) {
      const normalized = normalizeCourse(c);
      if (normalized && !seenIds.has(normalized.externalId)) {
        seenIds.add(normalized.externalId);
        courses.push(normalized);
        if (courses.length >= limit) return courses.slice(0, limit);
      }
    }
  }

  if (courses.length === 0 && lastError) {
    throw new Error(`Udemy API error: ${lastError}`);
  }

  return courses.slice(0, limit);
}

// Fallback: popular free Udemy course links when API fails
const FALLBACK_COURSES = [
  { title: 'Python for Beginners', url: 'https://www.udemy.com/course/pythonforbeginners/', category: 'Programming Languages' },
  { title: 'JavaScript Fundamentals', url: 'https://www.udemy.com/course/javascript-for-beginners/', category: 'Web Development' },
  { title: 'Web Development Bootcamp', url: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/', category: 'Web Development' },
  { title: 'Data Structures & Algorithms', url: 'https://www.udemy.com/course/datastructurescncpp/', category: 'DSA' },
  { title: 'React - The Complete Guide', url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', category: 'Web Development' },
];

/**
 * Fetch from Udemy (main entry). Uses fallback courses when API fails.
 */
export async function fetchAllExternalCourses(limit = 15) {
  const results = { udemy: [], errors: [] };

  try {
    results.udemy = await fetchFromUdemy(limit);
  } catch (e) {
    results.errors.push({ source: 'udemy', message: e.message });
    // Use fallback when API fails (user not subscribed or API down)
    results.udemy = FALLBACK_COURSES.slice(0, limit).map((c, i) => ({
      externalId: `fallback-${i}`,
      source: 'udemy',
      title: c.title,
      description: `Free Udemy course - ${c.title}. Enroll via the link.`,
      shortDescription: `Free course: ${c.title}`,
      thumbnail: '',
      category: c.category,
      level: 'All Levels',
      actualPrice: 0,
      offerPrice: 0,
      isFree: true,
      lessons: [],
      totalDuration: 0,
      totalLessons: 0,
      instructor: { name: 'Udemy Instructor', bio: '', avatar: '' },
      enrollmentLink: c.url,
      isPublished: true,
      tags: [c.category],
    }));
  }

  return results;
}
