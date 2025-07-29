import Session from '../models/Session.js';

export const createSession = async (req, res) => {
  try {
    const newSession = await Session.create({ user: req.user.id });
    res.json(newSession);
  } catch (error) {
    console.error("Create Session Error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user.id });
    res.json(sessions);
  } catch (error) {
    console.error("Get My Sessions Error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSingleSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    if (session.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    res.json(session);
  } catch (error) {
    console.error("Get Single Session Error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const updateSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    if (session.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not your session' });
    }

    // 🛡 Validate chatHistory before assigning
    if (req.body.chatHistory) {
      const isValid = Array.isArray(req.body.chatHistory) &&
        req.body.chatHistory.every(
          (entry) => entry && typeof entry.text === 'string' && typeof entry.role === 'string'
        );

      if (!isValid) {
        return res.status(400).json({ message: 'Invalid chat history: text and role required' });
      }

      session.chatHistory = req.body.chatHistory;
    }

    if (req.body.code) {
      session.code = {
        jsx: req.body.code.jsx || '',
        css: req.body.code.css || '',
      };
    }

    await session.save();

    res.json({ success: true, message: 'Session updated successfully' });
  } catch (error) {
    console.error('Update Session Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

