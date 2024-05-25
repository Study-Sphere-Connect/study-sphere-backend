import express from 'express';
import { authenticateJWT } from '../middlewares/jwt';
import ConversationController from '../controllers/ConversationController';

const router = express.Router();

router.get('/get',ConversationController.getConversations);
router.get('/create',ConversationController.createConversation);

export default router;