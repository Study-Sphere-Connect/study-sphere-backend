import express from 'express';
import { authenticateJWT } from '../middlewares/jwt';
import MessageController from '../controllers/MessageController';

const router = express.Router();

router.get('/:id', authenticateJWT, MessageController.getMessages);
router.post('/create', authenticateJWT, MessageController.createMessage);

export default router;