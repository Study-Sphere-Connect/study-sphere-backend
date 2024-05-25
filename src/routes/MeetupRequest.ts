import express from "express"
import MeetupRequestController  from "../controllers/MeetupRequestController"
import { authenticateJWT } from "../middlewares/jwt";
import { validate } from "../middlewares/zodValidate";
import { MeetupRequestSchema } from "../schemas/MeetupRequestSchema";

const router = express.Router();

router.post('/', authenticateJWT, validate(MeetupRequestSchema), MeetupRequestController.createMeetupRequest);

router.post('/:id', authenticateJWT, MeetupRequestController.updateMeetupRequest);

export default router;