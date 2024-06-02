import express from 'express';
import { authenticateJWT } from '../middlewares/jwt';
import ConversationController from '../controllers/ConversationController';

const router = express.Router();

router.get('/get', authenticateJWT, ConversationController.getConversations);
router.post('/create', authenticateJWT, ConversationController.createConversation);

export default router;