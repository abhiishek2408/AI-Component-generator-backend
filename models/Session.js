import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  chatHistory: [
    {
      role: {
        type: String,
        enum: ['user', 'assistant'], // ✅ match OpenAI roles
        required: true
      },
      text: {
        type: String,
        required: true
      }
    }
  ],
  code: {
    jsx: {
      type: String,
      default: ''
    },
    css: {
      type: String,
      default: ''
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Session', sessionSchema);
