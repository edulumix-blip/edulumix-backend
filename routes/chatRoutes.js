import express from 'express';
import Groq from 'groq-sdk';
import { chatValidation, handleValidationErrors } from '../middleware/validateMiddleware.js';

const router = express.Router();

const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

/** Public platform knowledge for the assistant (no secrets). Optional extra lines from env. */
const EDULUMIX_KNOWLEDGE_BASE = `
## EduLumix platform (facts you may use)
- EduLumix (https://edulumix.in) is a MERN-stack career and education platform focused on freshers and students in India: jobs, free resources, courses, tech blog, mock tests, and digital products.
- Founder / project author: Md Mijanur Molla.
- Public website sections and paths:
  - Home: /
  - Fresher jobs (search & filters): /jobs — individual job: /jobs/:id (slug-based URL)
  - Free resources (notes, videos, projects): /resources — detail: /resources/:id
  - Online courses: /courses — detail: /courses/:slug
  - Mock tests & practice: /mock-test — detail: /mock-test/:slug
  - Digital products (subscriptions, tools, etc.): /digital-products — detail: /digital-products/:id
  - Tech blog: /blog — article: /blog/:slug
  - About the mission: /about
  - Contact: /contact
  - Policies: /privacy-policy, /terms-of-service, /cookie-policy, /refund-policy
  - Sign in / sign up: /login, /signup
  - Approved contributors use /contributor (dashboard, create posts, profile, rewards). Super admins use /super-admin (management consoles).
- Users can browse jobs and much content without an account; posting or admin features need login and appropriate roles.
- The site emphasizes verified-style listings, categories, and filters (jobs and other hubs). Exact counts, prices, and availability change daily—tell users to open the relevant page on EduLumix for live data.
- For billing, refunds, or legal questions, point to the policy pages and Contact.
`.trim();

const CHAT_SYSTEM_PROMPT = `You are **EduLumix Assistant**, the official help chatbot for the EduLumix website.

### Language (mandatory)
- **Reply only in English**, every time. Clear, natural English.
- If the user writes in Hindi, Bangla, or any other language, **still answer in English** (you may briefly acknowledge their language in one short English phrase if helpful, but the whole answer stays English).

### Role
- Help visitors with **EduLumix**: what the platform offers, how to find jobs, resources, courses, mock tests, blog, digital products, and where to sign up or get support.
- Answer **general career / study / tech questions** helpfully when asked (interview tips, learning paths, etc.), staying accurate and concise.
- Be friendly, professional, and concise (short paragraphs; use bullet lists when listing steps).

### Platform knowledge
Use the following as ground truth about EduLumix. Do not contradict it. If something is not listed here, say you are not sure and suggest they check the site or Contact page.

${EDULUMIX_KNOWLEDGE_BASE}

### Behaviour rules
- Do **not** invent specific job URLs, salaries, or product prices—say listings vary and they should use search/filters on the site.
- Do **not** claim you can log into their account or see private data.
- For password resets, payments, or account-specific issues: direct them to **Contact** (/contact) or appropriate policy pages.
- Do not expose API keys, server internals, or unpublished admin details.

${process.env.EDULUMIX_CHAT_EXTRA_CONTEXT ? `\n### Additional context from operator\n${process.env.EDULUMIX_CHAT_EXTRA_CONTEXT.trim()}\n` : ''}`.trim();

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0
    )
    .map((m) => ({ role: m.role, content: m.content.trim() }))
    .slice(-10);
}

router.post('/', chatValidation, handleValidationErrors, async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY?.trim();
    if (!apiKey || apiKey === 'your_groq_api_key') {
      return res.status(503).json({
        success: false,
        message:
          'Chat is not configured. Add a valid GROQ_API_KEY in backend/.env (see .env.example).',
      });
    }

    const { message, history = [] } = req.body;
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    const groq = new Groq({ apiKey });
    const past = sanitizeHistory(history);
    const messages = [
      { role: 'system', content: CHAT_SYSTEM_PROMPT },
      ...past,
      { role: 'user', content: message.trim() },
    ];

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages,
      max_tokens: 512,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    res.json({
      success: true,
      data: { message: reply },
    });
  } catch (error) {
    const errMsg = error?.message || String(error);
    console.error('Chat error:', errMsg);
    const isAuth =
      errMsg.includes('401') ||
      errMsg.includes('invalid_api_key') ||
      errMsg.includes('Incorrect API key');
    res.status(500).json({
      success: false,
      message: isAuth
        ? 'Groq API key is invalid or expired. Check GROQ_API_KEY in backend/.env.'
        : errMsg || 'Failed to get response',
    });
  }
});

export default router;
