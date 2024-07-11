import express from 'express';
import { authenticateJWT } from '../middlewares/jwt';
import WalletController from '../controllers/WalletController';

const router = express.Router();

router.get('/get', authenticateJWT, WalletController.fetchWalletInfo);
router.post('/create', authenticateJWT, WalletController.createWallet);

export default router;