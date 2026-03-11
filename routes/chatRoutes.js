import express from 'express';
import Groq from 'groq-sdk';
import { chatValidation, handleValidationErrors } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.post('/', chatValidation, handleValidationErrors, async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'Chat service is not configured',
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
    const messages = [
      {
        role: 'system',
        content: 'You are EduLumix Assistant, a helpful chatbot for EduLumix - a career platform for freshers in India. You help with jobs, resources, courses, mock tests, career guidance, and platform questions. Be friendly, concise, and helpful. Answer in the same language the user uses (English, Hindi, or Bangla).',
      },
      ...history.slice(-10).map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: message.trim() },
    ];

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
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
    console.error('Chat error:', error?.message || error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to get response',
    });
  }
});

export default router;
