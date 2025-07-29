import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { createSession, getMySessions, getSingleSession, updateSession } from '../controllers/sessionController.js';

const router = express.Router();

router.post('/create', protect, createSession);
router.get('/my-sessions', protect, getMySessions);
router.get('/:id', protect, getSingleSession);
router.put('/:id', protect, updateSession);

export default router;
