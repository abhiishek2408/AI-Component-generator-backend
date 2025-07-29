import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { generateComponent } from '../controllers/chatController.js';

const router = express.Router();

router.post('/generate', protect, generateComponent);

export default router;
