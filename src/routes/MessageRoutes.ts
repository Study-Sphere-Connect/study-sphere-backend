import express from 'express';
import { authenticateJWT } from '../middlewares/jwt';
import MessageController from '../controllers/MessageController';

const router = express.Router();

router.get('/get',MessageController.getMessages);
router.get('/create',MessageController.createMessage);

export default router;