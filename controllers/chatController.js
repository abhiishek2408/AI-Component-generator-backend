import axios from 'axios';
import jwt from 'jsonwebtoken';
import Session from '../models/Session.js';

export const generateComponent = async (req, res) => {
  const { prompt, sessionId } = req.body;

  try {
    const response = await axios.post(
      process.env.AI_PROVIDER_URL,
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful React component generator. Return code in JSX and CSS." },
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;

    const jsxMatch = content.match(/<[^>]+>[\s\S]*<\/[^>]+>/);
    const cssMatch = content.match(/```css([\s\S]*?)```/);

    const jsxCode = jsxMatch ? jsxMatch[0].trim() : '';
    const cssCode = cssMatch ? cssMatch[1].trim() : '';

    const session = await Session.findById(sessionId);
    if (session) {
      session.chatHistory.push(prompt);
      session.code = { jsx: jsxCode, css: cssCode };
      await session.save();
    }

    res.json({
      jsx: jsxCode,
      css: cssCode,
      raw: content
    });
  } catch (error) {
    console.error('AI Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'AI generation failed', error: error.message });
  }
};
