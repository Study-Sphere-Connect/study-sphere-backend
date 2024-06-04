import express from "express"
import { authenticateJWT } from "../middlewares/jwt";
import SubscriptionController  from "../controllers/SubscriptionController"
import { upload } from "../configs/multer";

const router = express.Router();

router.get('/', authenticateJWT, SubscriptionController.getSubscriptionByUserAction);

router.post('/update', authenticateJWT, upload.none(), SubscriptionController.decreaseRemainingMeetings);

router.post('/transfer', authenticateJWT, upload.none(), SubscriptionController.transferToAccount);

router.post('/stripe', authenticateJWT,upload.none(), SubscriptionController.subscriptionHandler);

router.post('/create', authenticateJWT, upload.none(), SubscriptionController.createSubscriptionAction);


export default router;